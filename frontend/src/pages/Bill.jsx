import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Card, Alert } from 'react-bootstrap';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Bill = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { bookingId, token } = location.state || {};

    const [booking, setBooking] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const response = await axios.get(`http://localhost:9090/api/bookings/booking/${bookingId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setBooking(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching booking:", error.response ? error.response.data : error.message);
                setError("Failed to fetch booking details.");
                setLoading(false);
            }
        };

        if (token && bookingId) {
            fetchBooking();
        } else {
            alert("No token or booking ID available.");
            navigate('/login');
        }
    }, [token, bookingId]);

    const generatePDF = () => {
        const input = document.getElementById('invoice');
        html2canvas(input).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            const imgWidth = 190; // Width of the image in PDF
            const pageHeight = pdf.internal.pageSize.height;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;

            let position = 0;

            pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save('invoice.pdf');
        });
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
        <div className="container">
            <h1 className="h3 mb-4 text-black">Invoice Bill</h1>
            <div id="invoice">
                <Card>
                    <Card.Body>
                        <h2>Booking Details</h2>
                        <p><strong>Booking ID:</strong> {booking.id}</p>
                        <p><strong>Pickup Location:</strong> {booking.pickupLocation}</p>
                        <p><strong>Destination Location:</strong> {booking.destinationLocation}</p>
                        <p><strong>Status:</strong> {booking.status}</p>
                        <p><strong>Booking Date:</strong> {new Date(booking.bookingDate).toLocaleString()}</p>
                        <p><strong>Cost:</strong> ${booking.cost.toFixed(2)}</p>
                        <p><strong>Vehicle Type:</strong> {booking.vehicleType}</p>
                        <p><strong>Vehicle Number:</strong> {booking.vehicleNumber}</p>
                        <p><strong>Driver Name:</strong> {booking.assignedDriverId}</p>
                    </Card.Body>
                </Card>
            </div>
            <Button variant="dark" onClick={generatePDF} className="mt-3">
                Download Invoice as PDF
            </Button>
        </div>
    );
};

export default Bill;