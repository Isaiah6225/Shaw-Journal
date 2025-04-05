import { useEffect, useState } from "react";
import { db } from "../../firebase";
import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
  limit
} from "firebase/firestore";

export function useFetchBlogs({
  category,
  status = "approved",
  limitCount
} = {} ) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        let q;

        if (category) {
          q = query(
            collection(db, "blogs"),
            where("category", "==", category),
            where("status", "==", status),
            orderBy("createdAt", "desc"),
            limit(limitCount)
          );
        } else {
          q = query(
            collection(db, "blogs"),
            where("status", "==", status),
            orderBy("createdAt", "desc"),
            limit(limitCount)
          );
        }

        const querySnapshot = await getDocs(q);
        const blogsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
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
  }, [category, status, limitCount]);

  return { blogs, loading, error };
}

