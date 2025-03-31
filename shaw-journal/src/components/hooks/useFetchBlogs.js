import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";

export function useFetchBlogs(category) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const q = query(
          collection(db, "blogs"),
          where("category", "==", category), // Dynamic category
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const blogsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setBlogs(blogsData);
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError("Failed to load blogs.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [category]); // Runs when category changes

  return { blogs, loading, error };
}

