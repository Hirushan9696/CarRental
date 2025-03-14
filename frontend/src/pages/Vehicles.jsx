import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Alert } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext'; // Import useAuth
import "bootstrap/dist/css/bootstrap.min.css";

const Vehicles = () => {
  const navigate = useNavigate();
  const { auth } = useAuth(); // Get the auth object from context
  const { token } = auth; // Destructure token from auth

  const [vehicles, setVehicles] = useState([]);
  const [error, setError] = useState(null);

  // Fetch all vehicles
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await axios.get(`http://localhost:7075/api/vehicles`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setVehicles(response.data); // Set the vehicles in state
      } catch (error) {
        console.error("Error fetching vehicles:", error);
        setError("Failed to fetch vehicles.");
      }
    };

    if (token) {
      fetchVehicles();
    } else {
      console.error("No token available.");
    }
  }, [token]);

  // Handle Update Button
  const handleUpdate = (vehicleId) => {
    console.log("Updating vehicle with ID:", vehicleId);
    navigate("/adminUpdateVehicle", { state: { token: token, vehicleId: vehicleId } });
  };

  // Handle Delete Button
  const handleDelete = async (vehicleId) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this vehicle?");
    if (isConfirmed) {
      try {
        const response = await axios.delete(`http://localhost:7075/api/vehicles/delete/${vehicleId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },

        });
        console.log("Vehicle deleted:", response.data);
        // Remove the deleted vehicle from the state
        setVehicles(vehicles.filter(vehicle => vehicle.id !== vehicleId));
      } catch (error) {
        console.error("Error deleting vehicle:", error);
        setError("Failed to delete vehicle.");
      }
    } else {
      console.log("Vehicle deletion canceled.");
    }
  };

  const handleAddNewVehicles = () => {
    navigate("/adminAddNewVehicle"); // Navigate to the add new driver page
  };
  return (
    <div className="container-fluid bg-light min-vh-100">
      <h1 className="h3 mb-4 text-black">Vehicles</h1>
      <Button style={{ backgroundColor: "#222" }} onClick={handleAddNewVehicles} className="mb-3">
              Add New Vehicle
            </Button>
      {error && <Alert variant="danger">{error}</Alert>}
      <Table striped bordered hover responsive variant="light" className="shadow-sm">
        <thead className="table-dark">
          <tr>
            <th>Vehicle Number</th>
            <th>Brand</th>
            <th>Model</th>
            <th>Year</th>
            <th>Vehicle Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(vehicles) && vehicles.length > 0 ? (
            vehicles.map((vehicle) => (
              <tr key={vehicle.id}>
                <td>{vehicle.vehicleNumber}</td>
                <td>{vehicle.brand}</td>
                <td>{vehicle.model}</td>
                <td>{vehicle.year}</td>
                <td>{vehicle.vehicleType}</td>
                <td>
                  <div className="d-flex justify-content-start">
                    <Button onClick={() => handleUpdate(vehicle.id)} variant="success" className="me-2">
                      Update
                    </Button>
                    <Button onClick={() => handleDelete(vehicle.id)} variant="danger">
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No vehicles available.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default Vehicles;