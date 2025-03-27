"use client";

import Container from "../../../components/ui/Container";
import PrivateRoutes from "../../../components/PrivateRoutes";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "../../../firebase"; // Ensure correct Firebase import
import { doc, getDoc, updateDoc, arrayUnion, increment } from "firebase/firestore";

export default function BlogPage() {
  const { id } = useParams(); // Use useParams() to get dynamic route id
  const [blog, setBlog] = useState<any>(null);
  const [message, setMessage] = useState<string>("");
  const [newComment, setNewComment] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    if (!id) return; // Ensure id exists before making Firestore query

    const fetchBlog = async () => {
      try {
        const docRef = doc(db, "blogs", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setBlog(docSnap.data());
        } else {
          setMessage("Blog not found.");
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
        setMessage("Error loading blog.");
      }
    };

    fetchBlog();
  }, [id]); // Watch for changes in id

  // Function to handle upvotes
  const handleUpvote = async () => {
    if (!blog) return;
    try {
      const blogRef = doc(db, "blogs", id);
      await updateDoc(blogRef, { upvotes: increment(1) });
      setBlog((prev: any) => ({ ...prev, upvotes: prev.upvotes + 1 }));
    } catch (error) {
      console.error("Error upvoting:", error);
    }
  };

  // Function to handle adding comments
  const handleAddComment = async () => {
    if (!blog || newComment.trim() === "") return;
    try {
      const blogRef = doc(db, "blogs", id);
      await updateDoc(blogRef, { comments: arrayUnion(newComment) });
      setBlog((prev: any) => ({ ...prev, comments: [...prev.comments, newComment] }));
      setNewComment(""); // Clear input after submission
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  if (!blog) return <p className="text-center mt-10">{message || "Loading blog..."}</p>;

  return (
  <PrivateRoutes>
  <Container>
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
      {blog.image && <img src={blog.image} alt={blog.title} className="w-full h-60 object-cover rounded-lg mb-4" />}
      <p className="text-gray-700">{blog.article}</p>

      {/* Upvote Section */}
      <div className="flex justify-between mt-6 text-sm text-gray-500">
        <button onClick={handleUpvote} className="bg-indigo-500 text-white px-4 py-2 rounded-lg">
          👍 {blog.upvotes} Upvotes
        </button>
        <span>💬 {blog.comments?.length || 0} Comments</span>
      </div>

      {/* Comment Section */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Comments</h2>
        <ul className="mt-4 space-y-2">
          {blog.comments?.map((comment: string, index: number) => (
            <li key={index} className="bg-gray-100 p-2 rounded-md">{comment}</li>
          ))}
        </ul>
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-grow p-2 border rounded-md"
          />
          <button onClick={handleAddComment} className="bg-green-500 text-white px-4 py-2 rounded-lg">
            Add Comment
          </button>
        </div>
      </div>
    </div>
    </Container>
    </PrivateRoutes>
  );
}

