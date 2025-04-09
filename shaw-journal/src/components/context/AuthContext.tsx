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
  displayName: string;
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
  logoutGuest: () => void; }

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null); 
  const [isGuest, setIsGuest] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {

        setIsGuest(false); // Ensure guest mode is off
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.data();

        const authenticatedUser: AuthenticatedUser = {
          ...currentUser,
          role: userData?.role // Add role if exists, otherwise it's undefined
        };
        setUser(authenticatedUser);
      } else {
        if (!isGuest) {
          setUser(null);         }
      }
      setLoadingUser(false);
    });

    return () => unsubscribe();
  }, [isGuest]); // Add isGuest dependency


  //function to generate name of guest user
  const generateRandomGuestName = () =>{
  	 const adjectives = ["Swift", "Brave", "Sneaky", "Clever", "Lucky"];
  	const animals = ["Fox", "Tiger", "Bear", "Eagle", "Shark"];
  	const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  	const animal = animals[Math.floor(Math.random() * animals.length)];
  	return `${adj}${animal}${Math.floor(100 + Math.random() * 900)}`;
  };

  // Function to log in as guest
  const loginAsGuest = () => {
    let guestName = localStorage.getItem("guestName");

    
    if (!guestName) {
    	guestName = generateRandomGuestName();
    	localStorage.setItem("guestName", guestName);
    }
  

    const guestUser: GuestUser = { 
    	uid: "guest", 
	role: "Guest", 
	isGuestUser: true,
	displayName: guestName,
    };

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
