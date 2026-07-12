"use client";

import { useEffect } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import {
  useAuthStore,
  usePackageStore,
  useBookingStore,
} from "../store/useStore";

export default function Providers({ children }) {
  const hydrateAuth = useAuthStore((s) => s.hydrate);
  const hydrateWishlist = useBookingStore((s) => s.hydrateWishlist);
  const fetchPackages = usePackageStore((s) => s.fetchPackages);

  useEffect(() => {
    hydrateAuth();
    hydrateWishlist();
    fetchPackages();
  }, []);

  return (
    <GoogleOAuthProvider
      clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}
    >
      {children}
    </GoogleOAuthProvider>
  );
}
