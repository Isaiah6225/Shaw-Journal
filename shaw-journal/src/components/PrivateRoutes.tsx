"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./context/AuthContext"; // Import useAuth hook

export default function PrivateRoutes({ children }: { children: React.ReactNode }) {
  const { user, isGuest, loadingUser } = useAuth(); // Use context hook
  const router = useRouter();

  useEffect(() => {
    // Redirect only if loading is finished, user is null, AND isGuest is false
    if (!loadingUser && !user && !isGuest) {
      router.replace("/"); // Redirect non-logged-in, non-guest users to login
    }
  }, [user, isGuest, loadingUser, router]); // Dependencies for the effect

  // Show loading indicator while context is resolving
  if (loadingUser) {
    return <p>Loading...</p>;
  }

  // If loading is done, but user is null and not a guest, render nothing (or redirect happens)
  if (!user && !isGuest) {
    return null; // Or return <p>Redirecting...</p>;
  }

  // If user exists OR isGuest is true, render the children
  return <>{children}</>; // Use fragment instead of div unless div is needed for styling
}
