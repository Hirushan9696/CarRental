import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Alert,Button  } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';

const CustomerCompletedBookings = () => {
    const location = useLocation();
    const { userId,token } = location.state || {}; // Destructure token from location stateuth
    const [completedBookings, setCompletedBookings] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Check if token is available
    useEffect(() => {
        if (!token) {
            console.log("No token available.");
            alert("Please login to the System");
            navigate('/login');
        }
    }, [token, navigate]);

    // Fetch completed bookings
    useEffect(() => {
        const fetchCompletedBookings = async () => {
            try {
                const response = await axios.get(`http://localhost:9090/api/bookings/user/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                console.log("Bookings response:", response); // Log the entire response

                if (Array.isArray(response.data)) {
                    // Filter for completed bookings
                    const filteredBookings = response.data.filter(booking => 
                        booking.status === 'completed'
                    );
                    setCompletedBookings(filteredBookings);
                } else {
                    console.error("Expected an array, but got:", typeof response.data);
                    setError("Unexpected response format. Please try again.");
                }
            } catch (error) {
                console.error("Error fetching bookings:", error);
                setError("Error fetching bookings: " + (error.response?.data?.message || error.message));
            }
        };

        if (token) {
            fetchCompletedBookings();
        }
    }, [userId, token]);

    const handleBillClick = (bookingId) => {
        navigate('/bill', { state: { bookingId, token } });
    };

    return (
        <div className="container">
            <h1 className="h3 mb-4 text-black">Completed Bookings</h1>
            {error && <Alert variant="danger">{error}</Alert>}
            <Table striped bordered hover responsive variant="light" className="shadow-sm">
                <thead className="table-dark">
                    <tr>
                        <th>Booking ID</th>
                        <th>Pickup Location</th>
                        <th>Destination Location</th>
                        <th>Status</th>
                        <th>Booking Date</th>
                        <th>Cost</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {completedBookings.length > 0 ? (
                        completedBookings.map((booking) => (
                            <tr key={booking.id}>
                                <td>{booking.bookingId}</td>
                                <td>{booking.pickupLocation}</td>
                                <td>{booking.destinationLocation}</td>
                                <td>{booking.status}</td>
                                <td>{new Date(booking.bookingDate).toLocaleString()}</td>
                                <td>${booking.cost.toFixed(2)}</td>
                                <td>
                                    <Button 
                                        variant="primary" 
                                        onClick={() => handleBillClick(booking.bookingId)}
                                    >
                                        Bill
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6">No completed bookings available.</td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>
    );
};

export default CustomerCompletedBookings;