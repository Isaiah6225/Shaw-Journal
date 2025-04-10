"use client";

import Container from "../../components/ui/Container";
import PrivateRoutes from "../../components/PrivateRoutes";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "../../firebase"; 
import { collection, addDoc, serverTimestamp, setDoc, doc } from "firebase/firestore";
import { useAuth } from "../../components/context/AuthContext";
import { useEffect } from "react"; // Import useEffect


export default function CreateBlog() {
  const [title, setTitle] = useState("");
  const [name, setName] = useState("");
  const [article, setArticle] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [image, setImage] = useState<any[]>(null);	

  const { user, isGuest, loadingUser } = useAuth(); // Get isGuest and loadingUser
  const router = useRouter();

  // Redirect guest users
  useEffect(() => {
    if (!loadingUser && isGuest) {
      router.push("/home"); // Redirect guests away
    }
  }, [isGuest, loadingUser, router]);

  // Function to handle blog submission
  const handleSubmit = async (e: React.FormEvent) => {
    // Double check user is not guest before submitting (though redirect should prevent this)
    if (isGuest || !user) {
      setMessage("Guests cannot create blogs.");
      return;
    }
    e.preventDefault();
    if (!title || !name || !article || !category) {
      setMessage("All fields are required.");
      return;
    }

    setLoading(true);
    try {
      const blogRef = await addDoc(collection(db, "blogs"), {
        title,
        name,
        article,
        category,
	status: "pending",
	createdAt: serverTimestamp(),
      });

      //save blog to specific current user - Ensure user exists and is not guest
      if (user && !isGuest) {
         await setDoc(doc(db, `users/${user.uid}/blogs`, blogRef.id), {});
      } else {
         throw new Error("User not authenticated or is a guest.");
      }
      setMessage("Blog created successfully!");
      router.push("/home");
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Render nothing or a loading indicator while checking auth/guest status
  if (loadingUser || isGuest) {
    return <p>Loading...</p>; // Or a more specific message/redirect handled by useEffect
  }

  // Render the form only if the user is logged in and not a guest
  return (
    <PrivateRoutes>
  <Container>
    <div className="max-w-7xl mx-auto p-6">
      {message && <p className="text-red-500 mb-4">{message}</p>}

      {/* Side-by-side layout */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Card on the left */}
       {/* Card on the left */}
<div className="md:w-1/3 flex flex-col space-y-6">
  {/* Tips Card */}
  <div className="border border-gray-300 bg-[#FAF9F6] shadow-lg rounded-lg p-4 hover:shadow-xl transition space-y-3">
    <h2 className="text-xl font-semibold">Tips for Writing</h2>
    <ul className="list-disc pl-5 text-sm text-gray-600">
      <li>Be clear and concise</li>
      <li>Engage your audience</li>
      <li>Use proper formatting</li>
      <li>Proofread before posting</li>
    </ul>
  </div>

  {/* Markdown Key Card */}
  <div className="border border-gray-300 bg-[#FAF9F6] shadow-lg rounded-lg p-4 hover:shadow-xl transition space-y-3">
    <h2 className="text-xl font-semibold">Markdown Key</h2>
    <ul className="list-disc pl-5 text-sm text-gray-600">
      <li># Heading</li>
      <li>**Bold text**</li>
      <li>*Italic text*</li>
      <li>`Inline code`</li>
    </ul>
  </div>
</div>

        {/* Form on the right */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 md:w-2/3"
        >
          <input type="file" />
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
          />
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
            <option value="Entertainment">Entertainment</option>
            <option value="Food">Food</option>
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
    </div>
  </Container>
</PrivateRoutes>
  );
}
