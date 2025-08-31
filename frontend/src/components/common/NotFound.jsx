import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="row text-center d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="col-md-8">
        <h1 className="display-4 fw-bold text-secondary mb-3">
          Page Not Found
        </h1>
        <p className="lead text-muted mb-4">
          The page you’re trying to access doesn’t exist or may have been moved.
        </p>
        <Link to="/" className="btn btn-outline-primary btn-lg">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
