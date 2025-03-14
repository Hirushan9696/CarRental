import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Form, Alert, Table, Button } from 'react-bootstrap';
import { useAuth } from "../utils/AuthContext"; 

const Payments = () => {
  const [completedBookings, setCompletedBookings] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Default to current month
  const [error, setError] = useState(null);
  const { auth } = useAuth(); // Get the auth object from context

  // Destructure role, userId, and token from auth
  const { token } = auth;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`http://localhost:9090/api/bookings/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (Array.isArray(response.data)) {
          // Filter bookings to include only those with 'completed' status
          const completedBookings = response.data.filter(booking => booking.status === 'completed');
          setCompletedBookings(completedBookings);
        } else {
          console.error("Unexpected response format", response.data);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setError("Failed to fetch bookings.");
      }
    };
    if (token) fetchBookings();
  }, [token]);

  useEffect(() => {
    // Calculate total cost based on the selected month
    const calculateTotalCost = () => {
      const total = completedBookings.reduce((acc, booking) => {
        const bookingDate = new Date(booking.bookingDate);
        if (bookingDate.getMonth() + 1 === selectedMonth) {
          return acc + booking.cost;
        }
        return acc;
      }, 0);
      setTotalCost(total);
    };

    calculateTotalCost();
  }, [completedBookings, selectedMonth]);

  const handleMonthChange = (event) => {
    setSelectedMonth(Number(event.target.value));
  };

  return (
    <div className="container">
      <h2>Payments For Completed Bookings</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      <Table striped bordered hover responsive variant="light" className="shadow-sm">
        <thead className="table-dark">
          <tr>
            <th>Booking ID</th>
            <th>Booking Date</th>
            <th>Distance</th>
            <th>Cost</th>
            <th>Vehicle Type</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(completedBookings) && completedBookings.length > 0 ? (
            completedBookings.map((booking) => (
              <tr key={booking.bookingId}>
                <td>{booking.bookingId}</td>
                <td>{new Date(booking.bookingDate).toLocaleString()}</td>
                <td>{booking.distance ? parseFloat(booking.distance).toFixed(2) : "N/A"}</td>
                <td>{booking.cost ? parseFloat(booking.cost).toFixed(2) : "N/A"}</td>
                <td>{booking.vehicleType || "N/A"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="11">No bookings available.</td>
            </tr>
          )}
        </tbody>
      </Table>

      <Form.Group controlId="monthSelect" className="mb-3">
        <Form.Label>Select Month</Form.Label>
        <Form.Control as="select" value={selectedMonth} onChange={handleMonthChange}>
          {Array.from({ length: 12 }, (_, index) => (
            <option key={index} value={index + 1}>
              {new Date(0, index).toLocaleString('default', { month: 'long' })}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
      
      <h4>Total Income for {new Date(0, selectedMonth - 1).toLocaleString('default', { month: 'long' })}: ${totalCost.toFixed(2)}</h4>
    </div>
  );
};

export default Payments;