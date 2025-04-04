"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase"; 
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/home"); // Redirect to the home page after successful login
    } catch (error: any) {
      setError(error.message); // Display error message
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
          <button type="submit" className="w-full bg-indigo-600 text-white p-2 rounded">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

