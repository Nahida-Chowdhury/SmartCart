import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Categories", path: "/admin/categories" },
    { name: "Brands", path: "/admin/brands" },
    { name: "Products", path: "/admin/products" },
    { name: "Orders", path: "/admin/orders" },
    { name: "Users", path: "/admin/users" },
    { name: "Shipping", path: "/admin/shipping" },
    { name: "Settings", path: "/admin/settings" },
    { name: "Logout", path: "/admin/logout" },
  ];

  return (
    <div className="card shadow-sm">
      <div className="card-body p-0">
        <ul className="list-group list-group-flush">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li
                key={item.name}
                className={`list-group-item border-0 d-flex align-items-center ${
                  isActive
                    ? "bg-primary bg-opacity-10 fw-bold border-start border-4 border-primary border-opacity-50"
                    : ""
                }`}
              >
                <Link
                  to={item.path}
                  className={`text-decoration-none flex-grow-1 ${
                    isActive ? "text-primary" : "text-dark"
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
