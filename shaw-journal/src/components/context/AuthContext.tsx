"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "../../firebase"; // Ensure correct Firebase import
import { doc, getDoc } from "firebase/firestore";

// Create Context
const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
    if (currentUser) {
      const userRef = doc(db, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setUser({ ...currentUser, role: userSnap.data().role });
      } else {
        setUser(currentUser);
      }
    } else {
      setUser(null);
    }
  });

  return () => unsubscribe();
}, []);


  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom Hook for Authentication
export function useAuth() {
  return useContext(AuthContext);
}

