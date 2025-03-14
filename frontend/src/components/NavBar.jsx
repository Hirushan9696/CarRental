import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const NavBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user authentication data
    localStorage.removeItem("userToken"); 

    // Redirect to login page
    navigate("/login"); 
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: "#222" }}>
      <div className="container">
        <Link className="navbar-brand" to="/home" style={{ color: "#E6C200" }}>
          Mega City Cabs
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
              <Link className="nav-link" to="/home" style={{ color: "#E6C200" }}>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about" style={{ color: "#E6C200" }}>
                About Us
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contact" style={{ color: "#E6C200" }}>
                Contact Us
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/customerDashboard" style={{ color: "#E6C200" }}>
                Book a Ride
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

export default NavBar;
