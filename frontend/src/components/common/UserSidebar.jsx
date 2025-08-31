import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/Auth";

const UserSidebar = () => {
  const { logout } = useContext(AuthContext);
  const location = useLocation();

  const menuItems = [
    { name: "Account", path: "/account" },
    { name: "Orders", path: "/account/orders" },
    { name: "Settings", path: "/account/settings" },
  ];

  return (
    <div className="card shadow mb-5 sidebar">
      <div className="card-body p-4">
        <ul className="list-group list-group-flush">
          {menuItems.map((item) => (
            <li
              key={item.name}
              className={`list-group-item border-0 ${
                location.pathname === item.path ? "bg-light fw-bold" : ""
              }`}
            >
              <Link
                to={item.path}
                className={`text-decoration-none ${
                  location.pathname === item.path ? "text-primary" : "text-dark"
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
          <li className="list-group-item border-0">
            <a
              href="#"
              onClick={logout}
              className="text-danger text-decoration-none"
            >
              Logout
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default UserSidebar;
