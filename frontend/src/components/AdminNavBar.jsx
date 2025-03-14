import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; 

const AdminNavBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user authentication data
    localStorage.removeItem("userToken"); 

    // Redirect to login page
    navigate("/adminLogin"); 
  };
  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: "#222" }}>
      <div className="container">
        <Link className="navbar-brand" to="/adminDashboard" style={{ color: "#E6C200" }}>
          Admin Dashboard
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/adminbookings" style={{ color: "#E6C200" }}>
                Bookings
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/adminDrivers" style={{ color: "#E6C200" }}>
                Drivers
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/adminVehicles" style={{ color: "#E6C200" }}>
                Vehicles
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/adminPayments" style={{ color: "#E6C200" }}>
                Payments
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/adminLogin" style={{ color: "#E6C200" }}>
                Login
              </Link>
            </li>
            <li className="nav-item">
              <button className="nav-link btn btn-link" style={{ color: "#E6C200" }} onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavBar;
