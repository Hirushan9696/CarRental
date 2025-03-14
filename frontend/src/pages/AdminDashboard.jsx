import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Alert, Card, Row, Col, Form } from 'react-bootstrap'; 
import { useAuth } from '../utils/AuthContext'; 

const AdminDashboard = () => {
  const { auth } = useAuth(); // Get the auth object from context
  const { token } = auth; // Destructure token from auth

  const [pendingCount, setPendingCount] = useState(0);
  const [ongoingCount, setOngoingCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [driverCount, setDriverCount] = useState(0);
  const [vehicleCount, setVehicleCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [error, setError] = useState(null);
  const [completedBookings, setCompletedBookings] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Default to current month

  // Fetch counts of bookings
  useEffect(() => {
    const fetchBookingsCount = async () => {
      try {
        const response = await axios.get(`http://localhost:9090/api/bookings/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (Array.isArray(response.data)) {
          setPendingCount(response.data.filter(booking => booking.status === 'pending').length);
          setOngoingCount(response.data.filter(booking => booking.status === 'ongoing').length);
          setCompletedCount(response.data.filter(booking => booking.status === 'completed').length);
        } else {
          console.error("Unexpected response format", response.data);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setError("Failed to fetch bookings.");
      }
    };

    if (token) fetchBookingsCount();
  }, [token]);

  // Fetch count of drivers
  useEffect(() => {
    const fetchDriversCount = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/user/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const driverList = response.data.filter(user => user.userRole === "DRIVER");
        setDriverCount(driverList.length);
      } catch (error) {
        console.error("Error fetching drivers:", error);
        setError("Failed to fetch drivers.");
      }
    };

    if (token) fetchDriversCount();
  }, [token]);

  // Fetch count of vehicles
  useEffect(() => {
    const fetchVehiclesCount = async () => {
      try {
        const response = await axios.get(`http://localhost:7075/api/vehicles`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setVehicleCount(response.data.length); // Set the count of vehicles
      } catch (error) {
        console.error("Error fetching vehicles:", error);
        setError("Failed to fetch vehicles.");
      }
    };

    if (token) fetchVehiclesCount();
  }, [token]);

  // Fetch count of users
  useEffect(() => {
    const fetchUsersCount = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/user/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userList = response.data.filter(user => user.userRole === "USER");
        setUserCount(userList.length);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to fetch users.");
      }
    };

    if (token) fetchUsersCount();
  }, [token]);

  // Fetch completed bookings and calculate total cost for the current month
  useEffect(() => {
    const fetchCompletedBookings = async () => {
      try {
        const response = await axios.get(`http://localhost:9090/api/bookings/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (Array.isArray(response.data)) {
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

    if (token) fetchCompletedBookings();
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

  return (
    <div className="container" style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
      <h1 className="h3 mb-4 text-black">Admin Dashboard</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      <Row>
        <Col md={4}>
          <Card className="mb-3" style={{ backgroundColor: '#e9ecef', border: '1px solid #ced4da' }}>
            <Card.Body>
              <Card.Title>Pending Bookings</Card.Title>
              <Card.Text>{pendingCount}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-3" style={{ backgroundColor: '#e9ecef', border: '1px solid #ced4da' }}>
            <Card.Body>
              <Card.Title>Ongoing Bookings</Card.Title>
              <Card.Text>{ongoingCount}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-3" style={{ backgroundColor: '#e9ecef', border: '1px solid #ced4da' }}>
            <Card.Body>
              <Card.Title>Completed Bookings</Card.Title>
              <Card.Text>{completedCount}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={4}>
          <Card className="mb-3" style={{ backgroundColor: '#e9ecef', border: '1px solid #ced4da' }}>
            <Card.Body>
              <Card.Title>Driver Count</Card.Title>
              <Card.Text>{driverCount}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-3" style={{ backgroundColor: '#e9ecef', border: '1px solid #ced4da' }}>
            <Card.Body>
              <Card.Title>Vehicle Count</Card.Title>
              <Card.Text>{vehicleCount}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-3" style={{ backgroundColor: '#e9ecef', border: '1px solid #ced4da' }}>
            <Card.Body>
              <Card.Title>User Count</Card.Title>
              <Card.Text>{userCount}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        
      </Row>
    </div>
  
  );
};

export default AdminDashboard;