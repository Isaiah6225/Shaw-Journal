"use client";

import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import Link from "next/link";
import Container from "../../components/ui/Container";
import PrivateRoutes from "../../components/PrivateRoutes"; // Import authentication wrapper

export default function HomePage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const blogsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBlogs(blogsData);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setMessage("Failed to load blogs.");
      }
    };

    fetchBlogs();
  }, []);

  return (
    <PrivateRoutes> 
      <Container>        
        {/* Button to Create Blog */}
        <div className="mb-6 flex justify-center">
          <Link href="/create-blog" className="bg-green-500 text-white px-4 py-2 rounded-lg">
            + Create Blog
          </Link>
        </div>

        {/* Display Blogs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <Link key={blog.id} href={`/blog/${blog.id}`} className="block">
              <div className="bg-white shadow-lg rounded-lg p-4 hover:shadow-xl transition">
                <h2 className="text-xl font-semibold mt-4">{blog.title}</h2>
                <p className="text-gray-600 mt-2 line-clamp-2">{blog.article}</p>
                <p className="text-sm text-gray-500 mt-2">By {blog.name}</p>
              </div>
            </Link>
          ))}
        </div>

        {message && <p className="text-red-500 text-center mt-4">{message}</p>}
      </Container>
    </PrivateRoutes>
  );
}

