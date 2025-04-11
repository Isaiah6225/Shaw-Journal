import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

export function useFetchComments(blogId: string | undefined, refreshComments: boolean) {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!blogId) {
      setError("No blog ID provided.");
      setLoading(false);
      return;
    }

    const fetchComments = async () => {
      setLoading(true);
      try {
        const commentsRef = collection(db, "blogs", blogId, "comments");
        const q = query(commentsRef, orderBy("timestamp", "desc")); // latest comments first
        const snapshot = await getDocs(q);

        const fetchedComments = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setComments(fetchedComments);
      } catch (err) {
        console.error("Error fetching comments:", err);
        setError("Failed to load comments.");
      } finally {
        setLoading(false);
      }
    };
    if(refreshComments){
	fetchComments();
    } else {
    fetchComments();
    }
  }, [blogId, refreshComments]);

  return { comments, loading, error };
}

