import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

export function useFetchBlogsSub() {
  const { user } = useAuth();   
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlogSub = async () => {
      try {
        if (!user) {
          setError("No user found.");
          return;
        }
	
	console.log("Current user: ", user.uid);

        //Get all blog IDs from the user's blogs subcollection
        const userBlogRef = collection(db, `users/${user.uid}/blogs`);
        const userBlogSnapshot = await getDocs(userBlogRef);
	
        
        //Map over the returned docs to get blog IDs
        const blogIds = userBlogSnapshot.docs.map((doc) => doc.id);

	

        if (blogIds.length === 0) {
          setError("No blogs found for this user.");
          return;
        }

        //Fetch the actual blog data from the blogs collection
        const blogPromises = blogIds.map(async (blogId) => {
          const blogRef = doc(db, "blogs", blogId);
          const blogSnap = await getDoc(blogRef);

          if (blogSnap.exists()) {
            return { id: blogId, ...blogSnap.data() };
          } else {
            console.error(`Blog with ID ${blogId} not found.`);
            return null;
          }
        });

        const fetchedBlogs = await Promise.all(blogPromises);

        // Filter out any null values in case a blog doesn't exist
        setBlogs(fetchedBlogs.filter(blog => blog !== null));

      } catch (err) {
        setError("Error fetching blogs: " + err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogSub();
  }, [user]); // Re-run the effect when the user changes

  return { blogs, loading, error };
}

