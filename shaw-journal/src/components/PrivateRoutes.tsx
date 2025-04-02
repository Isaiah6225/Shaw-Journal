"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../firebase"; // ✅ Ensure correct import
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function PrivateRoutes({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.replace("/"); // Redirect if not authenticated
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup listener
  }, [router]);



  if (loading) {
    return <p>Loading...</p>; // ✅ Show loading state instead of blank screen
  }

  if (!user) {
    return null; // Prevent unauthorized content flash
  }

  return (
    <div>
      {children}
    </div>
  );
}

