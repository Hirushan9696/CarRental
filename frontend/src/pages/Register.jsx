import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";
import taxiImage from '../../public/images/taxi.jpg'; 
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          password: formData.password,
        }),
      });

      if (response.ok) {
        alert('Registration successful!');
        setFormData({ username: '', email: '', phoneNumber: '', password: '', confirmPassword: '' });
        navigate("/login");

      } else {
        const errorText = await response.text();
        alert(`Error: ${errorText}`);
      }
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Failed to register. Please try again.');
    }
  };

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        
        {/* Left Side (Image - 60%) */}
        <div className="col-md-7 d-flex align-items-center justify-content-center position-relative p-0">
                  <img 
                    src={taxiImage} 
                    alt="Taxi" 
                    className="img-fluid w-100 h-100" 
                    style={{ objectFit: "cover" }}
                  />
                  {/* Overlay text */}
                  <div className="position-absolute text-black fw-bold" style={{
                    top: "20%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    fontSize: "3rem",
                    // backgroundColor: "rgba(0, 0, 0, 0.5)",
                    padding: "10px 20px",
                    borderRadius: "10px"
                  }}>
                    Mega Cabs
                  </div>
                </div>

        {/* Right Side (Form - 40%) */}
        <div className="col-md-5 d-flex justify-content-center align-items-center" >
          <div className="card shadow-lg p-4 border-0 w-75" style={{ backgroundColor: '#222222', color: '#E6C200' }}>
            <h3 className="text-center mb-3 fw-bold">Create an Account</h3>

            <form onSubmit={handleSubmit}>
              {/* Username */}
              <div className="mb-3">
                <label className="form-label fw-semibold" style={{ color: '#E6C200' }}>Username</label>
                <input type="text" name="username" value={formData.username} onChange={handleChange} className="form-control bg-dark text-light border-secondary" placeholder="Enter your username" required />
              </div>

              {/* Email */}
              <div className="mb-3">
                <label className="form-label fw-semibold" style={{ color: '#E6C200' }}>Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-control bg-dark text-light border-secondary" placeholder="Enter your email" required />
              </div>

              {/* Phone Number */}
              <div className="mb-3">
                <label className="form-label fw-semibold" style={{ color: '#E6C200' }}>Phone Number</label>
                <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="form-control bg-dark text-light border-secondary" placeholder="Enter phone number" required />
              </div>

              {/* Password */}
              <div className="mb-3">
                <label className="form-label fw-semibold" style={{ color: '#E6C200' }}>Password</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} className="form-control bg-dark text-light border-secondary" placeholder="Enter password" required />
              </div>

              {/* Confirm Password */}
              <div className="mb-3">
                <label className="form-label fw-semibold" style={{ color: '#E6C200' }}>Confirm Password</label>
                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="form-control bg-dark text-light border-secondary" placeholder="Confirm password" required />
              </div>

              {/* Register Button */}
              <button type="submit" className="btn w-100 fw-bold" style={{ backgroundColor: '#E6C200', color: '#222222' }}>
                Register
              </button>
            </form>

            <div className="text-center mt-3">
              <small>Already have an account? <Link to="/login" className="fw-bold" style={{ color: '#E6C200' }}>Login</Link>
              </small>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Register;
