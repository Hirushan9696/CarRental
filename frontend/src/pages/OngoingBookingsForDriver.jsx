import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Alert, Card, ListGroup, Button, Container, Row, Col, Spinner } from 'react-bootstrap';
import { useLocation } from "react-router-dom";

const OngoingBookingsForDriver = () => {
    const location = useLocation();
    const { token, userId } = location.state || {};

    const [driver, setDriver] = useState(null);
    const [user, setUser] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isstatusChanged,setIsStatusChanged] = useState(false)

    useEffect(() => {
        const fetchDriverDetails = async () => {
            try {
                const response = await axios.post(`http://localhost:8080/api/user/getDriver`, { id: userId }, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setDriver(response.data);
            } catch (error) {
                setError("Failed to fetch driver details.");
            } finally {
                setLoading(false);
            }
        };

        if (userId) fetchDriverDetails();
    }, [userId, token]);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.post(`http://localhost:8080/api/user/getUser`, { id: userId }, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(response.data);
            } catch (error) {
                setError("Failed to fetch user details.");
            }
        };

        if (userId) fetchUserDetails();
    }, [userId, token]);

    useEffect(() => {
        const fetchDriverBookings = async () => {
            if (driver) {
                try {
                    const response = await axios.post(`http://localhost:9090/api/bookings/driver`, { assignedDriverId: driver.username }, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setBookings(response.data.filter(booking => booking.status === 'ongoing'));
                } catch (error) {
                    setError("Failed to fetch driver bookings.");
                }
            }
        };

        fetchDriverBookings();
    }, [driver, token,isstatusChanged]);

    const handleEnd = async (bookingId) => {
        try {
            const response = await axios.put(`http://localhost:9090/api/bookings/updateStatus/${bookingId}`, {
                status: "completed" 
            }, {
                headers: {
                    Authorization: `Bearer ${token}`, 
                },
            });
    
            if (response.status === 200) {
                setBookings((prevBookings) =>
                    prevBookings.map((booking) =>
                        booking.bookingId === bookingId ? { ...booking, status: "ongoing" } : booking
                    )
                );
                setIsStatusChanged(true)
                console.log("Booking status updated to ongoing:", response.data);
            }
        } catch (error) {
            console.error("Error updating booking status:", error);
            setError("Failed to update booking status.");
        }
    };


    if (loading) return (
        <Container className="text-center mt-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2">Loading...</p>
        </Container>
    );

    if (error) return <Alert variant="danger" className="text-center mt-3">{error}</Alert>;

    return (
        <Container className="mt-5">
            <h1 className="h3 mb-4 text-center text-dark fw-bold">Ongoing Booking Orders</h1>

            {bookings.length > 0 ? (
                <ListGroup>
                    {bookings.map((booking) => (
                        <ListGroup.Item key={booking.id} className="mb-3">
                            <Card className="shadow-lg">
                                <Card.Body>
                                    <Card.Title className="text-success fw-bold">Ongoing Booking Order</Card.Title>
                                    <Row className="border-bottom pb-2">
                                        <Col md={6}>
                                            <h5 className="fw-bold">User Details</h5>
                                            <p><strong>User ID:</strong> {user?.id}</p>
                                            <p><strong>Username:</strong> {user?.username}</p>
                                            <p><strong>Email:</strong> {user?.email}</p>
                                            <p><strong>Phone Number:</strong> {user?.phoneNumber}</p>
                                        </Col>
                                        <Col md={6}>
                                            <h5 className="fw-bold">Booking Details</h5>
                                            <p><strong>Booking ID:</strong> {booking.bookingId}</p>
                                            <p><strong>Pickup Location:</strong> {booking.pickupLocation}</p>
                                            <p><strong>Destination Location:</strong> {booking.destinationLocation}</p>
                                            <p><strong>Status:</strong> <span className="badge bg-warning text-dark">{booking.status}</span></p>
                                            <p><strong>Cost:</strong> <span className="text-primary">${booking.cost.toFixed(2)}</span></p>
                                            <p><strong>Booking Date:</strong> {new Date(booking.bookingDate).toLocaleString()}</p>
                                            <p><strong>Distance:</strong> {booking.distance.toFixed(2)} km</p>
                                            <p><strong>Vehicle:</strong> {booking.vehicle} ({booking.vehicleNumber})</p>
                                        </Col>
                                    </Row>
                                    <div className="mt-3 text-center">
                                        <Button variant="danger" size="lg" className="rounded-pill px-4 ms-2" onClick={() => handleEnd(booking.bookingId)}>
                                             End
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            ) : (
                <p className="text-center text-muted">No bookings assigned to this driver.</p>
            )}
        </Container>
    );
};



export default OngoingBookingsForDriver
