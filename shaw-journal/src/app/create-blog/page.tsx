"use client";

import Container from "../../components/ui/Container";
import PrivateRoutes from "../../components/PrivateRoutes";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "../../firebase"; // Adjust based on your setup
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function CreateBlog() {
  const [title, setTitle] = useState("");
  const [name, setName] = useState("");
  const [article, setArticle] = useState("");
  const [category, setCategory] = useState(""); // New state for category
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  // Function to handle blog submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !name || !article || !category) {
      setMessage("All fields are required.");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "blogs"), {
        title,
        name,
        article,
        category, // Save category to Firestore
        createdAt: serverTimestamp(),
      });
      setMessage("Blog created successfully!");
      router.push("/home"); // Redirect to home after submission
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PrivateRoutes>
      <Container>
        <div className="max-w-2xl mx-auto p-6">
          <h1 className="text-2xl font-bold mb-10">Create a Blog</h1>
          {message && <p className="text-red-500 mb-4">{message}</p>}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Author"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="p-2 border rounded"
            />
            <textarea
              placeholder="Write your article here..."
              value={article}
              onChange={(e) => setArticle(e.target.value)}
              required
              className="p-2 border rounded h-40"
            ></textarea>

            {/* Category Dropdown */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="p-2 border rounded"
            >
              <option value="" disabled>Select Category</option>
              <option value="Sports">Sports</option>
              <option value="General">General</option>
              <option value="Tech">Tech</option>
            </select>

            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 text-white p-2 rounded"
            >
              {loading ? "Submitting..." : "Create Blog"}
            </button>
          </form>
        </div>
      </Container>
    </PrivateRoutes>
  );
}

