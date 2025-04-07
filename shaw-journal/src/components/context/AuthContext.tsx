"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "../../firebase"; // Ensure correct Firebase import
import { doc, getDoc } from "firebase/firestore";

// Define a type for the guest user object
interface GuestUser {
  uid: string;
  role: "Guest"; // Explicitly set role for guest
  isGuestUser: true;
}

// Define a type for an authenticated user with a role
// We intersect the Firebase User type with our custom role property
type AuthenticatedUser = User & { role?: string }; // Role might not exist if Firestore fetch fails or user has no role set

// Combined user type
type AppUser = AuthenticatedUser | GuestUser;

// Define the context type
interface AuthContextType {
  user: AppUser | null; // Use the combined type
  isGuest: boolean;
  loadingUser: boolean;
  loginAsGuest: () => void;
  logoutGuest: () => void; // Optional: Add a way to explicitly log out guest
}

// Create Context with a default value matching the type
const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null); // Use the combined type
  const [isGuest, setIsGuest] = useState(false); // Track guest status
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      // If a real user logs in or is already logged in
      if (currentUser) {
        setIsGuest(false); // Ensure guest mode is off
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.data();
        // Explicitly cast currentUser to AuthenticatedUser and add role
        const authenticatedUser: AuthenticatedUser = {
          ...currentUser,
          role: userData?.role // Add role if exists, otherwise it's undefined
        };
        setUser(authenticatedUser);
      } else {
        // If no real user is logged in, check if we are in guest mode
        if (!isGuest) {
          setUser(null); // Only set user to null if not in guest mode
        }
      }
      setLoadingUser(false);
    });

    return () => unsubscribe();
  }, [isGuest]); // Add isGuest dependency

  // Function to log in as guest
  const loginAsGuest = () => {
    // Create the guest user object matching the GuestUser interface
    const guestUser: GuestUser = { uid: "guest", role: "Guest", isGuestUser: true };
    setUser(guestUser);
    setIsGuest(true);
    setLoadingUser(false); // Ensure loading is false
  };

  // Function to log out guest (optional, might be handled by regular login/logout)
  const logoutGuest = () => {
    setUser(null);
    setIsGuest(false);
  };

  // Context value
  const value = {
    user,
    isGuest,
    loadingUser,
    loginAsGuest,
    logoutGuest,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loadingUser && children}
    </AuthContext.Provider>
  );
}

// Custom Hook for Authentication - Ensure it returns the correct type
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
