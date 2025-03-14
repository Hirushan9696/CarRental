import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button } from "react-bootstrap";
import { useLocation, Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "../utils/AuthContext"; 

const Bookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const location = useLocation();
  const { auth } = useAuth(); 

  // Destructure role, userId, and token from auth
  const { role, userId, token } = auth;

  console.log("role:", role);
  console.log("userId:", userId);
  console.log("token:", token)

  useEffect(() => {
    if (!role || !userId || !token) {
      alert("Please login to the system");
      navigate("/adminlogin");
    }
  }, [role, userId, token]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`http://localhost:9090/api/bookings/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (Array.isArray(response.data)) {
          // Filter bookings to include only those with 'pending' or 'assigned' status
          const filteredBookings = response.data.filter(booking => 
            booking.status === 'pending' || booking.status === 'assigned'
          );
          setBookings(filteredBookings);
        } else {
          console.error("Unexpected response format", response.data);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };
    
    if (token) fetchBookings();
  }, [userId, token]);

  const handleUpdate = (bookingId) => {
    navigate("/adminDriverAssign", { state: { role, userId, token, bookingId } });
  };

  const handleDelete = (bookingId) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      axios.delete("http://localhost:9090/api/bookings/deleteByBookingId", {
        data: { bookingId },
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setBookings(bookings.filter((booking) => booking.bookingId !== bookingId));
      })
      .catch((error) => console.error("Error deleting booking:", error));
    }
  };

  return (
    <div className="container-fluid bg-light min-vh-100">
      <div className="bg-white py-4">
      <div className="container d-flex justify-content-between align-items-center mb-3">
      <h1 className="h3 mb-0 text-black">New Bookings</h1>
      <div className="d-flex">
        <Link to="/adminbookingHistory" state={{ role, userId, token }} className="me-2">
          <Button style={{ backgroundColor: "#222" }}>Completed Bookings</Button>
        </Link>
        <Link to="/adminOngoingbookings" state={{ role, userId, token }}>
          <Button style={{ backgroundColor: "#222" }}>Ongoing Bookings</Button>
        </Link>
      </div>
    </div>
      </div>
      <div className="container py-5">
        <Table striped bordered hover responsive variant="light" className="shadow-sm">
          <thead className="table-dark">
            <tr>
              <th>Oder ID</th>
              <th>Pickup Location</th>
              <th>Destination Location</th>
              <th>Status</th>
              <th>Assigned Driver</th>
              <th>Vehicle Number</th>
              <th>Booking Date</th>
              <th>Distance</th>
              <th>Cost</th>
              <th>Vehicle Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(bookings) && bookings.length > 0 ? (
              bookings.map((booking) => (
                <tr key={booking.bookingId}>
                  <td>{booking.bookingId}</td>
                  <td>{booking.pickupLocation}</td>
                  <td>{booking.destinationLocation}</td>
                  <td>{booking.status}</td>
                  <td>{booking.assignedDriverId || "under review"}</td>
                  <td>{booking.vehicleNumber || "under review"}</td>
                  <td>{new Date(booking.bookingDate).toLocaleString()}</td>
                  <td>{booking.distance ? parseFloat(booking.distance).toFixed(2) : "N/A"}</td>
                  <td>{booking.cost ? parseFloat(booking.cost).toFixed(2) : "N/A"}</td>
                  <td>{booking.vehicle}</td>
                  <td>
                    <div className="d-flex justify-content-start">
                      <Button onClick={() => handleUpdate(booking.bookingId)} variant="success" className="me-2">
                        Add driver
                      </Button>
                      <Button onClick={() => handleDelete(booking.bookingId)} variant="danger">
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10">No bookings available.</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default Bookings;
