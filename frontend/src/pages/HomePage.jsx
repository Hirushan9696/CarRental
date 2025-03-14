import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import taxiImage from "../../public/images/taxi.jpg";
import { useAuth } from "../utils/AuthContext"; 

const HomePage = () => {
    const { auth } = useAuth(); 
  
    // Destructure role, userId, and token from auth
    const { role, userId, token } = auth;
  return (
    <div className="container-fluid p-0">
      {/* Hero Section */}
      <div className="position-relative">
        <img
          src={taxiImage}
          alt="Taxi Service"
          className="img-fluid w-100"
          style={{ height: "90vh", objectFit: "cover" }}
        />

        {/* Text Overlay */}
        <div
          className="position-absolute text-white text-center fw-bold"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "3rem",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            padding: "15px 30px",
            borderRadius: "10px",
          }}
        >
          Mega City Cabs - Your Reliable Travel Partner
        </div>

        {/* Call to Action Button */}
        <div
          className="position-absolute text-center"
          style={{
            top: "70%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Link to="/newbooking" state={{ role: role, userId: userId, token: token }}>
            <button
              className="btn fw-bold"
              style={{
                backgroundColor: "#E6C200",
                color: "#222",
                fontSize: "1.2rem",
                padding: "10px 20px",
                borderRadius: "8px",
              }}
            >
              Book a Ride
            </button>
          </Link>
        </div>
      </div>

      {/* About Mega Cabs */}
      <div className="container text-center py-5">
        <h2 className="fw-bold mb-4">Why Choose Mega City Cabs?</h2>
        <p>
          At <b>Mega City Cabs</b>, we are committed to providing safe, reliable, and
          comfortable rides at affordable prices. Whether you need a quick ride
          around the city or a long-distance trip, our professional drivers and
          well-maintained vehicles are ready to serve you 24/7.
        </p>
      </div>

      {/* Services Section */}
      <div className="container text-center py-5">
        <h2 className="fw-bold mb-4">Our Services</h2>
        <div className="row">
          {["Airport Transfers", "City Rides", "Luxury Cabs", "Corporate Travel", "Outstation Rides", "24/7 Availability"].map((service, index) => (
            <div className="col-md-4 mb-4" key={index}>
              <div
                className="card shadow-lg p-4 border-0"
                style={{ backgroundColor: "#222", color: "#E6C200" }}
              >
                <h4 className="fw-bold">{service}</h4>
                <p className="text-light">Experience smooth and comfortable rides with Mega Cabs.</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-3" style={{ backgroundColor: "#111", color: "#E6C200" }}>
        <p className="m-0">📞 Contact Us: 123-456-7890 | ✉️ Email: support@megacitycabs.com</p>
      </footer>
    </div>
  );
};

export default HomePage;

// About Us Page
export const AboutUs = () => {
  return (
    <div className="container py-5">
      <h2 className="fw-bold text-center mb-4">About Mega Cabs</h2>
      <p>
        Established in 2010, Mega City Cabs has been a trusted name in the taxi
        industry, known for safety, punctuality, and comfort. Our fleet of
        well-maintained vehicles and experienced drivers ensure a smooth travel
        experience for all our passengers.
      </p>
      <p>
        We offer a range of services, including airport transfers, luxury
        rides, and city tours. Our mission is to make travel easy, efficient,
        and stress-free for everyone.
      </p>
    </div>
  );
};

// Contact Us Page
export const ContactUs = () => {
  return (
    <div className="container py-5">
      <h2 className="fw-bold text-center mb-4">Contact Us</h2>
      <p className="text-center">
        Have a question or need help? Get in touch with us!
      </p>
      <div className="text-center">
        <p>📍 Location: 123 Main Street, Your City</p>
        <p>📞 Phone: 123-456-7890</p>
        <p>✉️ Email: support@megacitycabs.com</p>
      </div>
    </div>
  );
};
