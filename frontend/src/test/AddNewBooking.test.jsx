import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import AddNewBooking from "../pages/AddNewBooking"; // Adjust the path as necessary
import { vi } from 'vitest'; // Use vitest's mocking library
import '@testing-library/jest-dom'; // Import jest-dom for additional matchers
import userEvent from '@testing-library/user-event'; // Import user-event for better interaction simulation

// Mock fetch globally
global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  })
);

describe("AddNewBooking Component - Booking Data Submission", () => {
  const mockLocationState = {
    role: "ADMIN",
    userId: "12345",
    token: "fake-token",
  };

  beforeEach(() => {
    vi.clearAllMocks(); // Clear mocks before each test
  });

  test("submits booking data correctly", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        message: "Booking added successfully!",
      }),
    });

    render(
      <MemoryRouter initialEntries={[{ pathname: "/newbooking", state: mockLocationState }]}>
        <Routes>
          <Route path="/newbooking" element={<AddNewBooking />} />
        </Routes>
      </MemoryRouter>
    );

    // Simulate filling out the form
    await userEvent.type(screen.getByLabelText(/phone number/i), "0123456789");

    // Simulate selecting pickup location
    await userEvent.selectOptions(screen.getByLabelText(/pickup location/i), "Colombo");

    // Simulate selecting destination location
    await userEvent.selectOptions(screen.getByLabelText(/destination location/i), "Gampaha");

    // Simulate selecting booking date
    await userEvent.type(screen.getByLabelText(/booking date/i), '2023-10-10T10:00'); // Adjust format as needed

    // Simulate selecting vehicle
    await userEvent.selectOptions(screen.getByLabelText(/vehicle/i), "car");

    // Simulate form submission
    await userEvent.click(screen.getByRole("button", { name: /submit booking/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith("http://localhost:9090/api/bookings/add", expect.any(Object));
    });
  });
});