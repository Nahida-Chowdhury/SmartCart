// src/admin/Settings.js
import React, { useState } from "react";
import Layout from "../common/Layout";
import Sidebar from "../common/Sidebar";
import { adminToken, apiUrl } from "../common/http";
import { toast } from "react-toastify";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("password");
  const [loading, setLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
  });

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error("New passwords don't match");
      setLoading(false);
      return;
    }

    try {
      const token = adminToken();
      const response = await fetch(`${apiUrl}/admin/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(passwordData),
      });

      const data = await response.json();

      if (data.status === 200) {
        toast.success("Password changed successfully");
        setPasswordData({
          current_password: "",
          new_password: "",
          confirm_password: "",
        });
      } else {
        toast.error(data.message || "Failed to change password");
      }
    } catch (error) {
      toast.error("Error changing password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container-fluid">
        <div className="row">
          <div className="d-flex justify-content-between mt-5 pb-3">
            <h4 className="h4 pb-0 mb-0">Settings</h4>
          </div>
          <div className="col-md-3">
            <Sidebar />
          </div>
          <div className="col-md-9">
            <div className="card shadow">
              <div className="card-header bg-white">
                <ul className="nav nav-tabs card-header-tabs">
                  <li className="nav-item">
                    <button
                      className={`nav-link ${
                        activeTab === "password" ? "active" : ""
                      }`}
                      onClick={() => setActiveTab("password")}
                    >
                      Change Password
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${
                        activeTab === "profile" ? "active" : ""
                      }`}
                      onClick={() => setActiveTab("profile")}
                    >
                      Profile Settings
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${
                        activeTab === "notifications" ? "active" : ""
                      }`}
                      onClick={() => setActiveTab("notifications")}
                    >
                      Notifications
                    </button>
                  </li>
                </ul>
              </div>
              <div className="card-body">
                {activeTab === "password" && (
                  <form onSubmit={handlePasswordChange}>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Current Password</label>
                          <input
                            type="password"
                            className="form-control"
                            value={passwordData.current_password}
                            onChange={(e) =>
                              setPasswordData({
                                ...passwordData,
                                current_password: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">New Password</label>
                          <input
                            type="password"
                            className="form-control"
                            value={passwordData.new_password}
                            onChange={(e) =>
                              setPasswordData({
                                ...passwordData,
                                new_password: e.target.value,
                              })
                            }
                            required
                            minLength={6}
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            className="form-control"
                            value={passwordData.confirm_password}
                            onChange={(e) =>
                              setPasswordData({
                                ...passwordData,
                                confirm_password: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={loading}
                        >
                          {loading ? "Changing..." : "Change Password"}
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                {activeTab === "profile" && (
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={profileData.name}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              name: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                          type="email"
                          className="form-control"
                          value={profileData.email}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              email: e.target.value,
                            })
                          }
                        />
                      </div>
                      <button className="btn btn-primary">
                        Update Profile
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === "notifications" && (
                  <div className="row">
                    <div className="col-md-8">
                      <div className="form-check form-switch mb-3">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="emailNotifications"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="emailNotifications"
                        >
                          Email Notifications
                        </label>
                      </div>
                      <div className="form-check form-switch mb-3">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="orderAlerts"
                          defaultChecked
                        />
                        <label
                          className="form-check-label"
                          htmlFor="orderAlerts"
                        >
                          New Order Alerts
                        </label>
                      </div>
                      <div className="form-check form-switch mb-3">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="lowStockAlerts"
                          defaultChecked
                        />
                        <label
                          className="form-check-label"
                          htmlFor="lowStockAlerts"
                        >
                          Low Stock Alerts
                        </label>
                      </div>
                      <button className="btn btn-primary">
                        Save Preferences
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
