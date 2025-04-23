import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs, doc, getDoc, query, where } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

export function useFetchBlogsSub({ status } = {}) {
  const { uid } = useAuth();   
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlogSub = async () => {
      try {
        // Get all blog IDs from the user's blogs subcollection
        const userBlogRef = collection(db, `users/${uid}/blogs`);
        const userBlogSnapshot = await getDocs(userBlogRef);

        // Map over the returned docs to get blog IDs
        const blogIds = userBlogSnapshot.docs.map((doc) => doc.id);

        if (blogIds.length === 0) {
          setError("No blogs found for this user.");
          return;
        }

        // Fetch the actual blog data from the blogs collection
        const blogPromises = blogIds.map(async (blogId) => {
          const blogRef = doc(db, "blogs", blogId);
          const blogSnap = await getDoc(blogRef);

          if (blogSnap.exists()) {
            const blogData = blogSnap.data();

            // Check if status matches (if status is provided)
            if (status && blogData.status !== status) {
              return null;
            }

            return { id: blogId, ...blogData };
          } else {
            console.error(`Blog with ID ${blogId} not found.`);
            return null;
          }
        });

        const fetchedBlogs = await Promise.all(blogPromises);

        // Filter out any null values in case a blog doesn't exist or doesn't match the status
        setBlogs(fetchedBlogs.filter(blog => blog !== null));

      } catch (err) {
        setError("Error fetching blogs: " + err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogSub();
  }, [uid, status]); // Re-run the effect when the user or status changes

  return { blogs, loading, error };
}

