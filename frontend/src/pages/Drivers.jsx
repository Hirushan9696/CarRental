import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Alert } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext'; 
import "bootstrap/dist/css/bootstrap.min.css";

const Drivers = () => {
  const navigate = useNavigate();
  const { auth } = useAuth(); // Get the auth object from context
  const { role, userId, token } = auth; // Destructure role, userId, and token

  const [drivers, setDrivers] = useState([]);
  const [error, setError] = useState(null);

  // Fetch all drivers with the role of DRIVER
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/user/all`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // Filter drivers with userRole "DRIVER"
        const driverList = response.data.filter(user => user.userRole === "DRIVER");
        setDrivers(driverList);
      } catch (error) {
        console.error("Error fetching drivers:", error);
        setError("Failed to fetch drivers.");
      }
    };

    if (token) {
      fetchDrivers();
    } else {
      console.error("No token available.");
    }
  }, [token]);

  // Handle Update Button
  const handleUpdate = (driverId) => {
    console.log("Updating driver with ID:", driverId);
    navigate("/adminUpdateDriver", { state: { token: token, driverId: driverId } });
  };

 // Handle Delete Button
const handleDelete = async (driverId) => {
  const isConfirmed = window.confirm("Are you sure you want to delete this driver?");
  if (isConfirmed) {
    try {
      const response = await axios.delete(`http://localhost:8080/api/user/delete`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { id: driverId } // Send driverId in the request body
      });
      console.log("Driver deleted:", response.data);
      // Remove the deleted driver from the state
      setDrivers(drivers.filter(driver => driver.id !== driverId));
    } catch (error) {
      console.error("Error deleting driver:", error);
      setError("Failed to delete driver.");
    }
  } else {
    console.log("Driver deletion canceled.");
  }
};

const handleAddNewDriver = () => {
  navigate("/adminAddNewDriver"); // Navigate to the add new driver page
};

  return (
    <div className="container-fluid bg-light min-vh-100">
      <h1 className="h3 mb-4 text-black">Drivers</h1>
      <Button style={{ backgroundColor: "#222" }} onClick={handleAddNewDriver} className="mb-3">
        Add New Driver
      </Button>
      {error && <Alert variant="danger">{error}</Alert>}
      <Table striped bordered hover responsive variant="light" className="shadow-sm">
        <thead className="table-dark">
          <tr>
            <th>Username</th>
            <th>NIC</th>
            <th>Phone Number</th>
            <th>Email</th>
            <th>License Number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(drivers) && drivers.length > 0 ? (
            drivers.map((driver) => (
              <tr key={driver.id}>
                <td>{driver.username}</td>
                <td>{driver.nic}</td>
                <td>{driver.phoneNumber}</td>
                <td>{driver.email}</td>
                <td>{driver.licenseNumber}</td>
                <td>
                  <div className="d-flex justify-content-start">
                    <Button onClick={() => handleUpdate(driver.id)} variant="success" className="me-2">
                      Update
                    </Button>
                    <Button onClick={() => handleDelete(driver.id)} variant="danger">
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No drivers available.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default Drivers;