import React from "react";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { vi } from "vitest";
import Header from "./Header";
import { useAuthStore } from "../store/useStore";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => "/",
  useParams: () => ({}),
  useSearchParams: () => new URLSearchParams(),
}));

describe("Header Component", () => {
  beforeEach(() => {
    // Reset Zustand store state before each test
    useAuthStore.setState({
      user: null,
      token: null,
      isAdmin: false,
    });
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders the brand logo and common links", () => {
    render(
        <Header />
    );

    expect(screen.getByText("MOMENTRY")).toBeInTheDocument();
    expect(screen.getByText("Travel Adventures")).toBeInTheDocument();
    expect(screen.getAllByText("Trips")[0]).toBeInTheDocument();
    expect(screen.getAllByText("About Us")[0]).toBeInTheDocument();
  });

  it("renders Login and Sign Up links when the user is not authenticated", () => {
    render(
        <Header />
    );

    expect(screen.getAllByText("Login")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Sign Up")[0]).toBeInTheDocument();
    expect(screen.queryByText("My Journeys")).not.toBeInTheDocument();
    expect(screen.queryByText("Admin Panel")).not.toBeInTheDocument();
  });

  it("renders user avatar and dropdown items when user is logged in", () => {
    // Set user state
    useAuthStore.setState({
      user: { name: "Ayush Soni", email: "ayush@example.com" },
      token: "mock-token",
      isAdmin: false,
    });

    render(
        <Header />
    );

    // Initial avatar with initials AS should be present
    const avatarButton = screen.getByText("AS");
    expect(avatarButton).toBeInTheDocument();

    // Click avatar button to open profile dropdown
    fireEvent.click(avatarButton);

    // Now, dropdown items should be visible
    expect(screen.getByText("Ayush Soni")).toBeInTheDocument();
    expect(screen.getAllByText("My Journeys")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Logout")[0]).toBeInTheDocument();
    
    // Links for anonymous users should not be visible
    expect(screen.queryByText("Login")).not.toBeInTheDocument();
    expect(screen.queryByText("Sign Up")).not.toBeInTheDocument();
    expect(screen.queryByText("Admin Panel")).not.toBeInTheDocument();
  });

  it("does not render an Admin Panel link even when the user is admin", () => {
    // Set admin user state — the main site has no admin UI
    useAuthStore.setState({
      user: { name: "Admin User", email: "admin@momentry.in" },
      token: "mock-token",
      isAdmin: true,
    });

    render(
        <Header />
    );

    const avatarButton = screen.getByText("AU");
    expect(avatarButton).toBeInTheDocument();

    // Click avatar button to open profile dropdown
    fireEvent.click(avatarButton);

    expect(screen.getByText("Admin User")).toBeInTheDocument();
    expect(screen.queryByText("Admin Panel")).not.toBeInTheDocument();
    expect(screen.getAllByText("My Journeys")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Logout")[0]).toBeInTheDocument();
  });
});
