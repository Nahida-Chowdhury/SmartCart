import React, { useEffect, useState } from "react";
import Layout from "./common/Layout";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { apiUrl, userToken } from "./common/http";

const Confirmation = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  const params = useParams();

  const fetchOrder = () => {
    if (!params.id || params.id === "undefined") {
      setLoading(false);
      toast.error("Invalid order ID");
      return;
    }

    fetch(`${apiUrl}/get-order-details/${params.id}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${userToken()}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setLoading(false);
        if (result.status === 200) {
          setOrder(result.data);
          setItems(result.data.items || []);
        } else {
          toast.error(result.message || "Order not found");
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error fetching order:", error);
        toast.error("Failed to fetch order details");
      });
  };

  useEffect(() => {
    fetchOrder();
  }, [params.id]); // Add params.id as dependency

  // Format date function
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Layout>
      <div className="container py-5">
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {!loading && order && (
          <div>
            <div className="row text-center mb-4">
              <h1 className="text-center fw-bold text-success">Thank You!</h1>
              <p className="text-muted">
                Your order has been successfully placed
              </p>
            </div>
            <div className="card shadow">
              <div className="card-body">
                <h3 className="fw-bold">Order Summary</h3>
                <hr />
                <div className="row">
                  <div className="col-md-6">
                    <p>
                      <strong>Order ID:</strong> #{order.id}
                    </p>
                    <p>
                      <strong>Date:</strong> {formatDate(order.created_at)}
                    </p>
                    <p>
                      <strong>Status:</strong>
                      {order.status === "pending" && (
                        <span className="badge bg-warning ms-2">Pending</span>
                      )}
                      {order.status === "shipped" && (
                        <span className="badge bg-info ms-2">Shipped</span>
                      )}
                      {order.status === "delivered" && (
                        <span className="badge bg-success ms-2">Delivered</span>
                      )}
                      {order.status === "cancelled" && (
                        <span className="badge bg-danger ms-2">Cancelled</span>
                      )}
                    </p>
                    <p>
                      <strong>Payment Method:</strong>
                      {order.payment_method === "stripe" ? (
                        <span className="badge bg-success ms-2">Stripe</span>
                      ) : (
                        <span className="badge bg-warning ms-2">COD</span>
                      )}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p>
                      <strong>Customer: </strong>
                      {order.name}
                    </p>
                    <p>
                      <strong>Email: </strong>
                      {order.email}
                    </p>
                    <p>
                      <strong>Address: </strong>
                      {order.address}, {order.city} {order.state} {order.zip}
                    </p>
                    <p>
                      <strong>Contact: </strong>
                      {order.mobile}
                    </p>
                  </div>
                </div>

                <div className="row mt-4">
                  <div className="col-12">
                    <h5>Order Items</h5>
                    <table className="table table-striped table-bordered">
                      <thead>
                        <tr>
                          <th>Item</th>
                          <th>Quantity</th>
                          <th width="150">Price</th>
                          <th width="150">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item) => (
                          <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>{item.qty}</td>
                            <td>${item.unit_price}</td>
                            <td>${item.price}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td className="text-end fw-bold" colSpan={3}>
                            Subtotal
                          </td>
                          <td>${order.subtotal}</td>
                        </tr>
                        <tr>
                          <td className="text-end fw-bold" colSpan={3}>
                            Shipping
                          </td>
                          <td>${order.shipping}</td>
                        </tr>
                        <tr>
                          <td className="text-end fw-bold" colSpan={3}>
                            Grand Total
                          </td>
                          <td>${order.grand_total}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                <div className="text-center mt-4">
                  <Link to="/account/orders" className="btn btn-primary">
                    View All Orders
                  </Link>
                  <Link to="/" className="btn btn-outline-secondary ms-2">
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {!loading && !order && (
          <div className="row text-center">
            <h1 className="text-center fw-bold text-muted">Order not found</h1>
            <p className="text-muted">
              The order you're looking for doesn't exist.
            </p>
            <Link to="/" className="btn btn-primary">
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Confirmation;
