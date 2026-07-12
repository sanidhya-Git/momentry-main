import create from "zustand";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

// localStorage is unavailable during SSR/prerender — fall back safely.
const fromStorage = (key, fallback = null) => {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
};

const rawFromStorage = (key, fallback = null) => {
  if (typeof window === "undefined") return fallback;
  return window.localStorage.getItem(key) ?? fallback;
};

export const useAuthStore = create((set) => ({
  // Start logged-out on both server and first client render, then hydrate()
  // from localStorage after mount — avoids SSR hydration mismatches.
  user: null,
  token: null,
  isAdmin: false,
  hydrated: false,

  hydrate: () =>
    set({
      user: fromStorage("user"),
      token: rawFromStorage("token"),
      isAdmin: fromStorage("isAdmin") || false,
      hydrated: true,
    }),

  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      const { user, token, isAdmin } = response.data;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      localStorage.setItem("isAdmin", isAdmin);
      set({ user, token, isAdmin });
      return { success: true, user };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Login failed",
      };
    }
  },

  signup: async (name, email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/signup`, {
        name,
        email,
        password,
      });
      const { user, token } = response.data;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      set({ user, token, isAdmin: false });
      return { success: true, user };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Signup failed",
      };
    }
  },

  googleLogin: async (credentialResponse) => {
    try {
      const response = await axios.post(`${API_URL}/auth/google`, {
        token: credentialResponse.credential,
      });
      const { user, token } = response.data;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      localStorage.setItem("isAdmin", user.isAdmin);
      set({ user, token, isAdmin: user.isAdmin });
      return { success: true, user };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Google login failed",
      };
    }
  },

  logout: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    set({ user: null, token: null, isAdmin: false });
  },

  updateProfile: async (profileData) => {
    try {
      const response = await axios.put(`${API_URL}/users/profile`, profileData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const updatedUser = response.data;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      set({ user: updatedUser });
      return { success: true, user: updatedUser };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Update failed' };
    }
  },
}));

export const usePackageStore = create((set, get) => ({
  packages: [],
  filteredPackages: [],
  selectedPackage: null,
  loading: false,

  fetchPackages: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(`${API_URL}/packages`);
      set({
        packages: response.data,
        filteredPackages: response.data,
        loading: false,
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch packages:", error);
      set({ loading: false });
    }
  },

  filterPackages: (filters) => {
    const { packages } = get();
    let filtered = packages;

    if (filters.search) {
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          p.destination.toLowerCase().includes(filters.search.toLowerCase()),
      );
    }

    if (filters.minPrice) {
      filtered = filtered.filter((p) => p.price >= filters.minPrice);
    }

    if (filters.maxPrice) {
      filtered = filtered.filter((p) => p.price <= filters.maxPrice);
    }

    if (filters.duration) {
      filtered = filtered.filter((p) => p.duration === filters.duration);
    }

    if (filters.destination) {
      filtered = filtered.filter((p) => p.destination === filters.destination);
    }

    set({ filteredPackages: filtered });
  },

  setSelectedPackage: (packageData) => {
    set({ selectedPackage: packageData });
  },

  addPackage: async (packageData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${API_URL}/packages`, packageData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { packages } = get();
      set({ packages: [...packages, response.data] });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },

  updatePackage: async (packageId, packageData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_URL}/packages/${packageId}`,
        packageData,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const { packages } = get();
      const updatedPackages = packages.map((p) =>
        p._id === packageId ? response.data : p,
      );
      set({ packages: updatedPackages });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },

  deletePackage: async (packageId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/packages/${packageId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { packages } = get();
      set({ packages: packages.filter((p) => p._id !== packageId) });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },
}));

export const useBookingStore = create((set) => ({
  bookings: [],
  currentBooking: null,

  createBooking: async (packageId, quantity) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/bookings`,
        { packageId, quantity },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      set({ currentBooking: response.data });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },

  fetchBookings: async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ bookings: response.data });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    }
  },

  wishlist: [],

  hydrateWishlist: () => set({ wishlist: fromStorage('wishlist') || [] }),

  toggleWishlist: (packageId) => {
    set((state) => {
      const wishlist = state.wishlist || [];
      const newWishlist = wishlist.includes(packageId)
        ? wishlist.filter(id => id !== packageId)
        : [...wishlist, packageId];
      localStorage.setItem('wishlist', JSON.stringify(newWishlist));
      return { wishlist: newWishlist };
    });
  },
}));
