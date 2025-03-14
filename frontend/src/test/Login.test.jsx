import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AdminLogin from "../pages/AdminLogin"; 
import { vi } from 'vitest';
import { useAuth } from "../utils/AuthContext"; 
import '@testing-library/jest-dom';

// Mock useAuth
vi.mock("../utils/AuthContext", () => ({
  useAuth: () => ({
    setAuth: vi.fn(),
  }),
}));

// Mock fetch globally
global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  })
);

describe("AdminLogin Component", () => {
  beforeEach(() => {
    vi.clearAllMocks(); 
  });

  test("renders login form correctly", () => {
    render(
      <MemoryRouter>
        <AdminLogin />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: /admin login/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  test("allows user to type in input fields", () => {
    render(
      <MemoryRouter>
        <AdminLogin />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(emailInput, { target: { value: "Admin123@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "usepassowrd123" } });

    expect(emailInput.value).toBe("Admin123@example.com");
    expect(passwordInput.value).toBe("usepassowrd123");
  });

  test("shows an alert on failed login", async () => {
    vi.spyOn(window, "alert").mockImplementation(() => {});

    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        message: "Invalid credentials",
      }),
    });

    render(
      <MemoryRouter>
        <AdminLogin />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "wrong@example.com" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "wrongpassword" } });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Invalid credentials");
    });
  });

  test("disables login button when loading", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        username: "Admin123",
        nic: "123456789V",
        address: "123 Main St",
        phoneNumber: "0123456789",
        email: "Admin123@example.com",
        password: "usepassowrd123",
        userRole: "ADMIN",
        token: "fake-admin-token",
      }),
    });

    render(
      <MemoryRouter>
        <AdminLogin />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "Admin123@example.com" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "usepassowrd123" } });

    const submitButton = screen.getByRole("button", { name: /login/i });

    fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
  });
});