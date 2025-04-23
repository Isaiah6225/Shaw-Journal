import { useEffect, useState } from "react";
import { db } from "../../firebase";
import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
  limit,
  startAfter
} from "firebase/firestore";

type FetchBlogsOptions = {
  category?: string;
  status?: string;
  limitCount?: number;
  skipFirst?: boolean;
};

type BlogData = {
  title: string;
  article: string;
  author: string;
  status: string;
  category: string;
  createdAt: string;
  imageUrl: string;
  // Add other fields as needed
}

export function useFetchBlogs({
  category,
  status,
  limitCount,
  skipFirst = false
}: FetchBlogsOptions = {}) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        let baseQuery;

        if (category) {
          baseQuery = query(
            collection(db, "blogs"),
            where("category", "==", category),
            where("status", "==", status),
            orderBy("createdAt", "desc")
          );
        } else {
          baseQuery = query(
            collection(db, "blogs"),
            where("status", "==", status),
            orderBy("createdAt", "desc")
          );
        }

        if (skipFirst) {
          // Step 1: Fetch the first blog to skip
          const firstSnap = await getDocs(query(baseQuery, limit(1)));
          if (!firstSnap.empty) {
            const firstDoc = firstSnap.docs[0];
            const queryAfter = query(
              baseQuery,
              startAfter(firstDoc),
              ...(limitCount ? [limit(limitCount)] : [])
            );
            const querySnapshot = await getDocs(queryAfter);
            setBlogs(querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...(doc.data() as BlogData)
            })));
          } else {
            setBlogs([]); // no blog to skip
          }
        } else {
          const fullQuery = limitCount ? query(baseQuery, limit(limitCount)) : baseQuery;
          const querySnapshot = await getDocs(fullQuery);
          setBlogs(querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as BlogData)
          })));
        }
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError("Failed to load blogs.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [category, status, limitCount, skipFirst]);

  return { blogs, loading, error };
}


