import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import UpdateBooking from "../pages/UpdateBooking"; 
import { vi } from 'vitest'; 
import '@testing-library/jest-dom'; 
import userEvent from '@testing-library/user-event'; 
import axios from "axios";

// Mock axios globally
vi.mock("axios");

describe("UpdateBooking Component - Booking Data Update", () => {
  const mockLocationState = {
    role: "ADMIN",
    userId: "12345",
    token: "fake-token",
    bookingId: "booking-123",
  };

  beforeEach(() => {
    vi.clearAllMocks(); // Clear mocks before each test
  });

  test("submits updated booking data correctly", async () => {
    // Mock the response for fetching booking details
    axios.get.mockResolvedValueOnce({
      data: {
        phoneNumber: "0123456789",
        pickupLocation: "Colombo",
        destinationLocation: "Gampaha",
        vehicleType: "car",
        cost: 0,
      },
    });

    // Mock the response for updating booking
    axios.put.mockResolvedValueOnce({
      status: 200,
      data: { message: "Booking updated successfully!" },
    });

    render(
      <MemoryRouter initialEntries={[{ pathname: "/updatebooking", state: mockLocationState }]}>
        <Routes>
          <Route path="/updatebooking" element={<UpdateBooking />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for the booking details to be fetched and rendered
    await waitFor(() => {
      expect(screen.getByLabelText(/phone number/i)).toHaveValue("0123456789");
    });

    // Simulate selecting new pickup location
    await userEvent.selectOptions(screen.getByLabelText(/pickup location/i), "Galle");

    // Simulate selecting new destination location
    await userEvent.selectOptions(screen.getByLabelText(/destination location/i), "Kandy");

    // Simulate selecting vehicle type
    await userEvent.selectOptions(screen.getByLabelText(/vehicle type/i), "van");

    // Simulate form submission
    await userEvent.click(screen.getByRole("button", { name: /update booking/i }));

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        "http://localhost:9090/api/bookings/updateByBookingId",
        expect.objectContaining({
          bookingId: "booking-123",
          phoneNumber: "0123456789",
          pickupLocation: "Galle",
          destinationLocation: "Kandy",
          vehicle: "van",
        }),
        expect.objectContaining({
          headers: {
            Authorization: `Bearer ${mockLocationState.token}`,
          },
        })
      );
    });
  });
});