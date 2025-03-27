"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../firebase"; // Ensure correct Firebase import
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
        router.replace("/"); // Redirect to login if not authenticated
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup listener when component unmounts
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth); // Firebase sign-out
      router.replace("/"); // Redirect to login after signing out
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Checking authentication...</p>;
  }

  if (!user) {
    return null; // Prevent unauthorized content from flashing
  }

  return (
    <div>
      {/* Logout Button */}
      <div className="flex justify-end p-4">
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>
      {children}
    </div>
  );
}

