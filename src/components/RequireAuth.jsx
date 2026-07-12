"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/useStore";

// Client-side route guard — replaces the old react-router ProtectedRoute.
// Waits for the auth store to hydrate from localStorage before deciding.
export default function RequireAuth({ children }) {
  const { token, hydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (hydrated && !token) {
      router.replace("/login");
    }
  }, [hydrated, token, router]);

  if (!token) return null;
  return children;
}
