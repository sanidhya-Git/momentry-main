import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import PackageCard from "./PackageCard";

afterEach(() => {
  cleanup();
});

const mockPkg = {
  _id: "6a228913bbe58071074cb68f",
  title: "Test Expedition to Leh",
  destination: "Ladakh",
  price: 9500,
  duration: 6,
  maxParticipants: 15,
  description: "A wonderful trip to Leh and surrounding monasteries.",
  image: "https://example.com/leh.jpg",
  highlights: ["Monastery Tour", "Passes", "Lake Camping"],
  isActive: true,
};

describe("PackageCard Component", () => {
  it("renders the package details correctly", () => {
    render(
        <PackageCard pkg={mockPkg} />
    );

    // Verify title is rendered
    expect(screen.getByText("Test Expedition to Leh")).toBeInTheDocument();

    // Verify destination is rendered
    expect(screen.getByText("Ladakh")).toBeInTheDocument();

    // Verify duration is rendered
    expect(screen.getByText("6 days")).toBeInTheDocument();

    // Verify description is rendered
    expect(
      screen.getByText("A wonderful trip to Leh and surrounding monasteries.")
    ).toBeInTheDocument();

    // Verify price formatting (9500 price shows as FROM ₹9K)
    expect(screen.getByText("FROM")).toBeInTheDocument();
    expect(screen.getByText("₹9K")).toBeInTheDocument();
  });

  it("calculates and displays the correct badge based on pkg._id", () => {
    // Last character of ID 'f' has char code 102. 102 % 2 = 0 -> "BEST SELLER"
    render(
        <PackageCard pkg={mockPkg} />
    );

    expect(screen.getByText("BEST SELLER")).toBeInTheDocument();
  });

  it("links to the correct package details page", () => {
    const { container } = render(
        <PackageCard pkg={mockPkg} />
    );

    // Verify the Link wrapping is set correctly to /packages/:id
    const linkElement = container.querySelector("a");
    expect(linkElement).toHaveAttribute("href", "/packages/6a228913bbe58071074cb68f");
  });
});
