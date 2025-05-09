"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, signInAnonymously } from "firebase/auth";
import { auth } from "../firebase";
import Link from "next/link";
import { useAuth } from "../components/context/AuthContext"; // Import useAuth

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

	const handleLogin = async (e: React.FormEvent) => {
	  e.preventDefault();
	  try {
	    const userCredential = await signInWithEmailAndPassword(auth, email, password);
	    const user = userCredential.user; // Get the user object after successful login

	    // Get the token after user is signed in
	    const token = await user.getIdToken(); 

	    if (token) {
	      // Send the token to the server to set it as an HttpOnly cookie
		await fetch('/api/set-token', {
		  method: 'POST',
		  headers: { 'Content-Type': 'application/json' },
		  body: JSON.stringify({ token }),
		  credentials: 'include', 
		});

	    }

	    router.push("/home"); 
	  } catch (error: any) {
	    if (error.code) {
	      setError("Incorrect username/password");
	    } else {
	      setError(error.message); // Display other error messages
	    }
	  }
	};




	const handleGuestLogin = async () => {
	  try {
	    const userCredential = await signInAnonymously(auth);
	    const uid = userCredential.user.uid;
	    const username = `Guest${Math.floor(1000 + Math.random() * 9000)}`;

	    // Call API to set custom claims
	    await fetch("/api/set-claim", {
	      method: "POST",
	      headers: { "Content-Type": "application/json" },
	      body: JSON.stringify({ uid, role: "Guest", username }),
	    });

	    // Force token refresh to get the new claims
	    await userCredential.user.getIdToken(true);

	    // Set token in cookie
	    const token = await userCredential.user.getIdToken();
	    await fetch("/api/set-token", {
	      method: "POST",
	      headers: { "Content-Type": "application/json" },
	      body: JSON.stringify({ token }),
	    });

	    router.push("/home");
	  } catch (error: any) {
	    console.error("Guest login failed:", error.message);
	    setError("Failed to sign in as guest");
	  }
	};




  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative">
      {/* Image as background */}
      <Image
        src="/images/shaw-background-login.jpg"
        alt="Shaw University Background"
        layout="fill" // Make the image cover the entire container
        objectFit="cover" // Ensure the image covers the container without stretching
        className="absolute inset-0 z-0 opacity-30" // Apply low opacity and ensure it stays in the background
      />

      {/* Login Form */}
      <div className="relative z-10 w-full max-w-sm bg-white bg-opacity-80 p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold mb-6 text-center">Login</h1>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleLogin} className="w-full">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 mb-4 border rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 mb-4 border rounded"
          />
          <button type="submit" className="w-full bg-[#800020] text-white p-2 rounded mb-4 cursor-pointer"> {/* Added margin-bottom */}
            Login
          </button>
        </form>
        {/* Guest Login Link */}
        <div className="text-center mt-4">
          <button
            onClick={handleGuestLogin}
            className="w-full bg-[#EFBF04] text-white p-2 rounded mb-4 cursor-pointer"
          >
            Login as Guest
          </button>
        </div>
      </div>
    </div>
  );
}
