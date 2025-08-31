// src/components/Settings.js
import React, { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { apiUrl } from "./common/http";
import { AuthContext } from "./context/Auth";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const profileForm = useForm({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      address: user?.address || "",
      city: user?.city || "",
      state: user?.state || "",
      zip: user?.zip || "",
      mobile: user?.mobile || "",
    },
  });

  const passwordForm = useForm();

  const handleProfileUpdate = async (data) => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/update-profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (result.status === 200) {
        toast.success("Profile updated successfully!");
      } else {
        toast.error(result.message || "Failed to update profile");
      }
    } catch (error) {
      toast.error("An error occurred while updating profile");
    }
    setLoading(false);
  };

  const handlePasswordChange = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
      });

      const result = await res.json();

      if (result.status === 200) {
        toast.success("Password changed successfully!");
        passwordForm.reset();
      } else {
        toast.error(result.message || "Failed to change password");
      }
    } catch (error) {
      toast.error("An error occurred while changing password");
    }
    setLoading(false);
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Settings</h2>

      <div className="row">
        <div className="col-md-3">
          <div className="list-group">
            <button
              className={`list-group-item list-group-item-action ${
                activeTab === "profile" ? "active" : ""
              }`}
              onClick={() => setActiveTab("profile")}
            >
              Profile Settings
            </button>
            <button
              className={`list-group-item list-group-item-action ${
                activeTab === "password" ? "active" : ""
              }`}
              onClick={() => setActiveTab("password")}
            >
              Change Password
            </button>
            <button
              className={`list-group-item list-group-item-action ${
                activeTab === "preferences" ? "active" : ""
              }`}
              onClick={() => setActiveTab("preferences")}
            >
              Preferences
            </button>
          </div>
        </div>

        <div className="col-md-9">
          {activeTab === "profile" && (
            <div className="card">
              <div className="card-header">
                <h5>Profile Information</h5>
              </div>
              <div className="card-body">
                <form onSubmit={profileForm.handleSubmit(handleProfileUpdate)}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Full Name</label>
                      <input
                        {...profileForm.register("name", {
                          required: "Name is required",
                        })}
                        type="text"
                        className={`form-control ${
                          profileForm.formState.errors.name && "is-invalid"
                        }`}
                      />
                      {profileForm.formState.errors.name && (
                        <div className="invalid-feedback">
                          {profileForm.formState.errors.name.message}
                        </div>
                      )}
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Email</label>
                      <input
                        {...profileForm.register("email", {
                          required: "Email is required",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address",
                          },
                        })}
                        type="email"
                        className={`form-control ${
                          profileForm.formState.errors.email && "is-invalid"
                        }`}
                      />
                      {profileForm.formState.errors.email && (
                        <div className="invalid-feedback">
                          {profileForm.formState.errors.email.message}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Address</label>
                    <input
                      {...profileForm.register("address")}
                      type="text"
                      className="form-control"
                    />
                  </div>

                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label className="form-label">City</label>
                      <input
                        {...profileForm.register("city")}
                        type="text"
                        className="form-control"
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">State</label>
                      <input
                        {...profileForm.register("state")}
                        type="text"
                        className="form-control"
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">ZIP Code</label>
                      <input
                        {...profileForm.register("zip")}
                        type="text"
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Mobile Number</label>
                    <input
                      {...profileForm.register("mobile")}
                      type="text"
                      className="form-control"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Update Profile"}
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === "password" && (
            <div className="card">
              <div className="card-header">
                <h5>Change Password</h5>
              </div>
              <div className="card-body">
                <form
                  onSubmit={passwordForm.handleSubmit(handlePasswordChange)}
                >
                  <div className="mb-3">
                    <label className="form-label">Current Password</label>
                    <input
                      {...passwordForm.register("currentPassword", {
                        required: "Current password is required",
                      })}
                      type="password"
                      className={`form-control ${
                        passwordForm.formState.errors.currentPassword &&
                        "is-invalid"
                      }`}
                    />
                    {passwordForm.formState.errors.currentPassword && (
                      <div className="invalid-feedback">
                        {passwordForm.formState.errors.currentPassword.message}
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">New Password</label>
                    <input
                      {...passwordForm.register("newPassword", {
                        required: "New password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters",
                        },
                      })}
                      type="password"
                      className={`form-control ${
                        passwordForm.formState.errors.newPassword &&
                        "is-invalid"
                      }`}
                    />
                    {passwordForm.formState.errors.newPassword && (
                      <div className="invalid-feedback">
                        {passwordForm.formState.errors.newPassword.message}
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Confirm New Password</label>
                    <input
                      {...passwordForm.register("confirmPassword", {
                        required: "Please confirm your password",
                      })}
                      type="password"
                      className={`form-control ${
                        passwordForm.formState.errors.confirmPassword &&
                        "is-invalid"
                      }`}
                    />
                    {passwordForm.formState.errors.confirmPassword && (
                      <div className="invalid-feedback">
                        {passwordForm.formState.errors.confirmPassword.message}
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Changing..." : "Change Password"}
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === "preferences" && (
            <div className="card">
              <div className="card-header">
                <h5>Preferences</h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label">Email Notifications</label>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="orderUpdates"
                    />
                    <label className="form-check-label" htmlFor="orderUpdates">
                      Order updates
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="promotional"
                    />
                    <label className="form-check-label" htmlFor="promotional">
                      Promotional emails
                    </label>
                  </div>
                </div>

                <button className="btn btn-primary">Save Preferences</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
