import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Slidebar from "../../common/Sidebar";
import { apiUrl, adminToken } from "../../common/http";

const ShowOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loader, setLoader] = useState(false);

  const fetchOrders = async () => {
    setLoader(true);

    const res = await fetch(`${apiUrl}/orders`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${adminToken()}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setLoader(false);

        if (result.status === 200) {
          //console.log(result);
          setOrders(result.data);
        } else {
          console.log("Something went wrong!");
        }
      });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <Layout>
      <div className="container-fluid pb-5">
        <div className="row">
          <div className="d-flex justify-content-between mt-5 pb-3">
            <h4 className="h4 pb-0 mb-0">Orders</h4>
            {/* <Link to="" className="btn btn-primary">
              Button
            </Link> */}
          </div>
          <div className="col-md-3">
            <Slidebar />
          </div>
          <div className="col-md-9">
            <div className="card shadow">
              <div className="card-body p-4">
                <table className="table table-stripped">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Customer</th>
                      <th>Email</th>
                      <th>Amount</th>
                      <th>Date</th>
                      <th>Payment Status</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => {
                      return (
                        <tr>
                          <td>{order.id}</td>
                          <td>{order.name}</td>
                          <td>{order.email}</td>
                          <td>${order.grand_total}</td>
                          <td>{order.created_at}</td>
                          <td>
                            {order.payment_status == "paid" ? (
                              <span className="badge bg-success">Paid</span>
                            ) : (
                              <span className="badge bg-danger">Not Paid</span>
                            )}
                          </td>
                          <td>{order.id}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ShowOrders;
