import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { apiUrl, userToken } from "./common/http";
import { CartContext } from "./context/Cart";
import { toast } from "react-toastify";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";

const CheckoutForm = () => {
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [userData, setUserData] = useState(null);
  const { cartData, subTotal, grandTotal, shipping } = useContext(CartContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("");

  const stripe = useStripe();
  const elements = useElements();

  const handlePaymentMethod = (e) => {
    setPaymentMethod(e.target.value);
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Fetch user data separately
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${apiUrl}/get-profile-details`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${userToken()}`, // Fixed: Added space after Bearer
          },
        });

        const result = await response.json();

        if (result.status === 200 && result.data) {
          setUserData(result.data);
          reset({
            name: result.data.name || "",
            email: result.data.email || "",
            address: result.data.address || "",
            city: result.data.city || "",
            state: result.data.state || "",
            zip: result.data.zip || "",
            mobile: result.data.mobile || "",
          });
        } else {
          console.log("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [reset]);

  const processOrder = async (data) => {
    //console.log(data);
    setLoading(true);
    setPaymentStatus("");
    if (paymentMethod === "cod") {
      saveOrder(data, "not paid");
    } else {
      // Fetch the client secret from the server
      const response = await fetch(`${apiUrl}/create-payment-intent`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${userToken()}`,
        },
        body: JSON.stringify({ amount: grandTotal() * 100 }),
      });

      const result = await response.json();

      if (!result.clientSecret) {
        setPaymentStatus("Unable to process payment. Please try again.");
        setLoading(false);
        return;
      }

      // Ensure Stripe and Elements are loaded
      if (!stripe || !elements) {
        setPaymentStatus("Stripe is not ready. Please try again later.");
        setLoading(false);
        return;
      }

      const clientSecret = result.clientSecret;
      const cardElement = elements.getElement(CardElement);

      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: data.name,
            email: data.email,
            address: {
              line1: data.address,
              city: data.city,
              state: data.state,
              postal_code: data.zip,
            },
          },
        },
      });

      if (paymentResult.error) {
        setPaymentStatus(`Payment failed: ${paymentResult.error.message}`);
      } else if (paymentResult.paymentIntent.status === "succeeded") {
        saveOrder(data, "paid");
        setPaymentStatus("Payment successful!");
      }
    }
  };

  const saveOrder = (formData, paymentStatus) => {
    const newFormData = {
      ...formData,
      grand_total: grandTotal(),
      sub_total: subTotal(),
      shipping: shipping(),
      discount: 0,
      payment_status: paymentStatus,
      payment_method: paymentMethod,

      status: "pending",
      cart: cartData,
    };

    fetch(`${apiUrl}/save-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${userToken()}`,
      },
      body: JSON.stringify(newFormData),
    })
      .then((res) => res.json())
      .then((result) => {
        setLoading(false);
        if (result.status === 200) {
          localStorage.removeItem("cart");
          navigate(`/order/confirmation/${result.id}`);
        } else {
          toast.error(result.message);
        }
      })
      .catch((error) => {
        console.error("Error saving order:", error);
        toast.error("Failed to save order");
      });
  };

  return (
    <div className="container-fluid px-5 pb-5">
      <div className="row">
        <div className="col-md-12">
          <nav aria-label="breadcrumb" className="py-4">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/">Home</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Checkout
              </li>
            </ol>
          </nav>
        </div>
      </div>
      <form onSubmit={handleSubmit(processOrder)}>
        <div className="row">
          <div className="col-md-7">
            <h3 className="border-bottom pb-3">
              <strong>Billing Details</strong>
            </h3>
            <div className="row pt-3">
              <div className="col-md-6">
                <div className="mb-3">
                  <input
                    {...register("name", {
                      required: "The name field is required.",
                    })}
                    type="text"
                    className={`form-control ${
                      errors.name ? "is-invalid" : ""
                    }`}
                    placeholder="Name"
                  />
                  {errors.name && (
                    <p className="invalid-feedback">{errors.name?.message}</p>
                  )}
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <input
                    {...register("email", {
                      required: "The email field is required.",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                    type="text"
                    className={`form-control ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    placeholder="Email"
                  />
                  {errors.email && (
                    <p className="invalid-feedback">{errors.email?.message}</p>
                  )}
                </div>
              </div>
              <div className="mb-3">
                <textarea
                  {...register("address", {
                    required: "The address field is required.",
                  })}
                  className={`form-control ${
                    errors.address ? "is-invalid" : ""
                  }`}
                  rows={3}
                  placeholder="Address"
                ></textarea>
                {errors.address && (
                  <p className="invalid-feedback">{errors.address?.message}</p>
                )}
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <input
                    {...register("city", {
                      required: "The city field is required.",
                    })}
                    type="text"
                    className={`form-control ${
                      errors.city ? "is-invalid" : ""
                    }`}
                    placeholder="City"
                  />
                  {errors.city && (
                    <p className="invalid-feedback">{errors.city?.message}</p>
                  )}
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <input
                    {...register("state", {
                      required: "The state field is required.",
                    })}
                    type="text"
                    className={`form-control ${
                      errors.state ? "is-invalid" : ""
                    }`}
                    placeholder="State"
                  />
                  {errors.state && (
                    <p className="invalid-feedback">{errors.state?.message}</p>
                  )}
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <input
                    {...register("zip", {
                      required: "The zip field is required.",
                    })}
                    type="text"
                    className={`form-control ${errors.zip ? "is-invalid" : ""}`}
                    placeholder="Zip"
                  />
                  {errors.zip && (
                    <p className="invalid-feedback">{errors.zip?.message}</p>
                  )}
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <input
                    {...register("mobile", {
                      required: "The mobile field is required.",
                    })}
                    type="text"
                    className={`form-control ${
                      errors.mobile ? "is-invalid" : ""
                    }`}
                    placeholder="Mobile"
                  />
                  {errors.mobile && (
                    <p className="invalid-feedback">{errors.mobile?.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-5">
            <h3 className="border-bottom pb-3">
              <strong>Items</strong>
            </h3>
            <table className="table">
              <tbody>
                {cartData &&
                  cartData.map((item) => {
                    return (
                      <tr key={`cart-${item.id}`}>
                        <td width={100}>
                          {item.image_url ? (
                            <img
                              src={item.image_url}
                              width={80}
                              alt={item.name || "Product"}
                            />
                          ) : (
                            <div
                              style={{
                                width: 80,
                                height: 80,
                                backgroundColor: "#f0f0f0",
                              }}
                            ></div>
                          )}
                        </td>
                        <td width={600}>
                          <h4>{item.name || "Product"}</h4>
                          <div className="d-flex align-items-center pt-3">
                            <span>${item.price}</span>
                            <div className="ps-3">
                              {item.size && (
                                <button className="btn btn-size">
                                  {item.size}
                                </button>
                              )}
                            </div>
                            <div className="ps-5">X {item.qty}</div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>

            <div className="row">
              <div className="col-md-12">
                <div className="d-flex justify-content-between border-bottom pb-2">
                  <div>Subtotal</div>
                  <div>${subTotal()}</div>
                </div>
                <div className="d-flex justify-content-between border-bottom py-2">
                  <div>Shipping</div>
                  <div>${shipping()}</div>
                </div>
                <div className="d-flex justify-content-between py-2">
                  <div>
                    <strong>Grand Total</strong>
                  </div>
                  <div>${grandTotal()}</div>
                </div>
              </div>
            </div>

            <h3 className="border-bottom pt-4 pb-3">
              <strong>Payment Method</strong>
            </h3>

            <div className="pt-2">
              <input
                type="radio"
                id="stripe"
                name="paymentMethod"
                onChange={handlePaymentMethod}
                checked={paymentMethod === "stripe"}
                value="stripe"
              />
              <label htmlFor="stripe" className="form-label ps-2">
                Stripe
              </label>

              <input
                type="radio"
                id="cod"
                name="paymentMethod"
                onChange={handlePaymentMethod}
                checked={paymentMethod === "cod"}
                value="cod"
                className="ms-3"
              />
              <label htmlFor="cod" className="form-label ps-2">
                COD
              </label>
            </div>

            {paymentMethod == "stripe" && (
              <div className="border p-3">
                <CardElement />
              </div>
            )}

            <div className="d-flex py-3">
              <button disabled={loading} className="btn btn-primary">
                {loading ? "Please wait..." : "Pay Now"}
              </button>
            </div>
            {paymentStatus && (
              <p className="alert alert-info mt-3">{paymentStatus}</p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutForm;
