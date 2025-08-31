import React, { useState, useEffect } from "react";
import Layout from "../common/Layout";
import Sidebar from "../common/Sidebar";
import { Link } from "react-router-dom";
import { adminToken, apiUrl } from "../common/http";
import Loader from "../common/Loader";

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    orders: 0,
    products: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = adminToken();

      if (!token) {
        console.error("No admin token found");
        return;
      }

      // Fetch all data in parallel
      const [usersRes, ordersRes, productsRes, recentOrdersRes] =
        await Promise.all([
          fetch(`${apiUrl}/users-count`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch(`${apiUrl}/orders-count`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch(`${apiUrl}/products-count`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch(`${apiUrl}/recent-orders`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

      const usersData = await usersRes.json();
      const ordersData = await ordersRes.json();
      const productsData = await productsRes.json();
      const recentOrdersData = await recentOrdersRes.json();

      setStats({
        users: usersData.data || 0,
        orders: ordersData.data || 0,
        products: productsData.data || 0,
        revenue: ordersData.revenue || 0,
      });

      if (recentOrdersData.status === 200) {
        setRecentOrders(recentOrdersData.data || []);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <Loader />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container-fluid">
        <div className="row">
          <div className="d-flex justify-content-between mt-5 pb-3">
            <h4 className="h4 pb-0 mb-0">Dashboard</h4>
          </div>
          <div className="col-md-3">
            <Sidebar />
          </div>
          <div className="col-md-9">
            {/* Stats Cards */}
            <div className="row">
              <div className="col-md-3 mb-4">
                <div className="card shadow border-0">
                  <div className="card-body text-center">
                    <h2 className="text-primary">{stats.users}</h2>
                    <span className="text-muted">Total Users</span>
                  </div>
                  <div className="card-footer bg-transparent text-center">
                    <Link to="/admin/users" className="text-decoration-none">
                      View Users
                    </Link>
                  </div>
                </div>
              </div>

              <div className="col-md-3 mb-4">
                <div className="card shadow border-0">
                  <div className="card-body text-center">
                    <h2 className="text-success">{stats.orders}</h2>
                    <span className="text-muted">Total Orders</span>
                  </div>
                  <div className="card-footer bg-transparent text-center">
                    <Link to="/admin/orders" className="text-decoration-none">
                      View Orders
                    </Link>
                  </div>
                </div>
              </div>

              <div className="col-md-3 mb-4">
                <div className="card shadow border-0">
                  <div className="card-body text-center">
                    <h2 className="text-info">{stats.products}</h2>
                    <span className="text-muted">Total Products</span>
                  </div>
                  <div className="card-footer bg-transparent text-center">
                    <Link to="/admin/products" className="text-decoration-none">
                      View Products
                    </Link>
                  </div>
                </div>
              </div>

              <div className="col-md-3 mb-4">
                <div className="card shadow border-0">
                  <div className="card-body text-center">
                    <h2 className="text-warning">${stats.revenue}</h2>
                    <span className="text-muted">Total Revenue</span>
                  </div>
                  <div className="card-footer bg-transparent text-center">
                    <span className="text-muted">Revenue</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders Section */}
            <div className="row mt-4">
              <div className="col-12">
                <div className="card shadow">
                  <div className="card-header bg-white">
                    <h5 className="mb-0">Recent Orders</h5>
                  </div>
                  <div className="card-body">
                    {recentOrders.length === 0 ? (
                      <p className="text-muted text-center">No recent orders</p>
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead>
                            <tr>
                              <th>Order ID</th>
                              <th>Customer</th>
                              <th>Amount</th>
                              <th>Status</th>
                              <th>Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {recentOrders.slice(0, 5).map((order) => (
                              <tr key={order.id}>
                                <td>#{order.id}</td>
                                <td>{order.name}</td>
                                <td>${order.grand_total}</td>
                                <td>
                                  <span
                                    className={`badge ${
                                      order.status === "delivered"
                                        ? "bg-success"
                                        : order.status === "pending"
                                        ? "bg-warning"
                                        : order.status === "cancelled"
                                        ? "bg-danger"
                                        : "bg-info"
                                    }`}
                                  >
                                    {order.status}
                                  </span>
                                </td>
                                <td>
                                  {new Date(
                                    order.created_at
                                  ).toLocaleDateString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                    {recentOrders.length > 0 && (
                      <div className="text-center mt-3">
                        <Link
                          to="/admin/orders"
                          className="btn btn-primary btn-sm"
                        >
                          View All Orders
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
