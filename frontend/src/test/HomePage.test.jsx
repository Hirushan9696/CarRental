import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import HomePage from "../pages/HomePage";
import { useAuth } from "../utils/AuthContext";
import "@testing-library/jest-dom";

// Mock useAuth
vi.mock("../utils/AuthContext", () => ({
  useAuth: () => ({
    auth: { role: "USER", userId: "123", token: "fake-token" },
  }),
}));

describe("HomePage Component", () => {
  test("renders hero section with image and text", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(screen.getByAltText("Taxi Service")).toBeInTheDocument();
    expect(screen.getByText(/mega city cabs - your reliable travel partner/i)).toBeInTheDocument();
  });

  test("renders call-to-action button", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    const bookRideButton = screen.getByRole("button", { name: /book a ride/i });
    expect(bookRideButton).toBeInTheDocument();
  });

  test("renders why choose section", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(screen.getByText(/why choose mega city cabs/i)).toBeInTheDocument();
  });

  test("renders service cards", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    const services = [
      "Airport Transfers",
      "City Rides",
      "Luxury Cabs",
      "Corporate Travel",
      "Outstation Rides",
      "24/7 Availability",
    ];

    services.forEach((service) => {
      expect(screen.getByText(service)).toBeInTheDocument();
    });
  });

  test("renders footer contact information", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(screen.getByText(/contact us: 123-456-7890/i)).toBeInTheDocument();
    expect(screen.getByText(/email: support@megacitycabs.com/i)).toBeInTheDocument();
  });
});
