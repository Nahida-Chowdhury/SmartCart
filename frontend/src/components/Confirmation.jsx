import React, { useEffect, useState } from "react";
import Layout from "./common/Layout";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { apiUrl, userToken } from "./common/http";

const Confirmation = () => {
  const [order, setOrder] = useState([]);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  const params = useParams();

  const fetchOrder = () => {
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
        if (result.status == 200) {
          setOrder(result.data);
          setItems(result.data.items);
        } else {
          //toast.error(result.message);
        }
      });
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  return (
    <Layout>
      <div className="container py-5">
        {loading === true && (
          <div className="text-center py-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {loading === false && order && (
          <div>
            <div className="row">
              <h1 className="text-center fw-bold text-success">Thank You!</h1>
              <p className="text-muted ext-center">
                Your order has beem successfully placed
              </p>
            </div>
            <div className="card shadow">
              <div className="card body">
                <h3 className="fw-bold">Order Summery</h3>
                <hr />
                <div className="row">
                  <div className="col-6">
                    <p>
                      <strong>Order ID:</strong>#{order_id}
                    </p>
                    <p>
                      <strong>Date:</strong>
                      {order.created_at}
                    </p>
                    <p>
                      <strong>Status:</strong>
                      {order.status == "pending" && (
                        <span className="badge bg-warning">Pending</span>
                      )}
                      {order.status == "shipped" && (
                        <span className="badge bg-warning">Shipped</span>
                      )}
                      {order.status == "delivered" && (
                        <span className="badge bg-success">Delivered</span>
                      )}
                      {order.status == "cancelled" && (
                        <span className="badge bg-danger">Cancelled</span>
                      )}
                    </p>
                    <p>
                      <strong>Payment Mathod:</strong>COD
                    </p>
                  </div>
                  <div className="col-6">
                    <p>
                      <strong>Customer: </strong>
                      {order.name}
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
                <div className="row">
                  <div className="col-12">
                    <table className="table-striped table-bordered table">
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
                          <td>{order.subtotal}</td>
                        </tr>

                        <tr>
                          <td className="text-end fw-bold" colSpan={3}>
                            Shipping
                          </td>
                          <td>{order.shipping}</td>
                        </tr>
                        <tr>
                          <td className="text-end fw-bold" colSpan={3}>
                            Grand Total
                          </td>
                          <td>{order.grand_total}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                  <div className="text-center">
                    <button className="btn btn-primary">
                      View Order Details
                    </button>
                    <Link to={"/"} className="btn btn-outline-secondary ms-2">
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {loading == false && !order && (
          <div className="row">
            <h1 className="text-center fw-bold text-muted">Order not found</h1>
          </div>
        )}
      </div>
    </Layout>
  );
};
