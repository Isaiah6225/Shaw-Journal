"use client";

 
import { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { useAuth } from "../../components/context/AuthContext";
import BlogCard from "../../components/BlogCard";
import Container from "../../components/ui/Container";
import PrivateRoutes from "../../components/PrivateRoutes";

export default function LikedPostsPage() {
  const { user } = useAuth();
  const [likedBlogs, setLikedBlogs] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchLikedBlogs = async () => {
      try {
        const likesQuery = query(collection(db, "likes"), where("userId", "==", user.uid));
        const likesSnapshot = await getDocs(likesQuery);
        const likedBlogIds = likesSnapshot.docs.map((doc) => doc.data().blogId);

        // Fetch blog details for each liked blog
        const blogPromises = likedBlogIds.map(async (blogId) => {
          const blogRef = doc(db, "blogs", blogId);
          const blogSnap = await getDoc(blogRef);
          return blogSnap.exists() ? { id: blogSnap.id, ...blogSnap.data() } : null;
        });

        const blogs = await Promise.all(blogPromises);
        setLikedBlogs(blogs.filter(Boolean)); // Remove null values
      } catch (error) {
        console.error("Error fetching liked blogs:", error);
      }
    };

    fetchLikedBlogs();
  }, [user]);

  return (
  <PrivateRoutes>
  <Container>
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Liked Posts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {likedBlogs.length > 0 ? (
          likedBlogs.map((blog) => <BlogCard key={blog.id} {...blog} />)
        ) : (
          <p>No liked posts yet.</p>
        )}
      </div>
    </div>
  </Container>
  </PrivateRoutes>
  );
}

