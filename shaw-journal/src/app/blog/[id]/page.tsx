"use client";

import Container from "../../../components/ui/Container";
import PrivateRoutes from "../../../components/PrivateRoutes";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "../../../firebase";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { useLikes } from "../../../components/hooks/useLikes";
import { useAuth } from "../../../components/context/AuthContext";


export default function BlogPage() {
  const { id } = useParams(); 
  const [blog, setBlog] = useState<any>(null);
  const [message, setMessage] = useState<string>("");
  const [newComment, setNewComment] = useState<string>("");
  const router = useRouter();
  const { user, loadingUser } = useAuth();
  const { isLiked, likesCount, toggleLike } = useLikes(id);

  if (loadingUser) return <p> Loading...</p>;

  useEffect(() => {
    if (!id) return;

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
  }, [id]);

  // Function to handle adding comments
  const handleAddComment = async () => {
    if (!blog || newComment.trim() === "") return;
    try {
      const blogRef = doc(db, "blogs", id);
      await updateDoc(blogRef, { comments: arrayUnion(newComment) });
      setBlog((prev) => ({...prev!, comments: [...(prev?.comments || []), newComment], // Ensure comments is always an array
}));

      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleSubmitBlogs = async () => {
	try {
		const approvedData = {
			status: "approved"
		};
		const blogRef = doc(db, "blogs", id);
		await updateDoc(blogRef, approvedData);
		setMessage("Blog approved!");
		router.push("/home");
	} catch (error){
		console.error("Error approving blog: ", error);
		setMessage("Error approving blog");
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

          {/* Like/Unlike & Comments Section */}
	  {user?.role === "Author" && (
          <div className="flex justify-between mt-6 text-sm text-gray-500">
	  {user && (
            <button
              onClick={toggleLike}
              className={`px-4 py-2 rounded-lg ${isLiked ? "bg-red-500 text-white" : "bg-gray-200 text-black"}`}
            >
              {isLiked ? "❤️ Liked" : "🤍 Like"} {likesCount}
            </button>
	    )}
            <span>💬 {blog.comments?.length || 0} Comments</span>
          </div>
	  )}

          {/* Comment Section */}
	  {user?.role === "Author" && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold">Comments</h2>
            <ul className="mt-4 space-y-2">
              {blog.comments?.map((comment: string, index: number) => (
                <li key={index} className="bg-gray-500 p-2 rounded-md">{comment}</li>
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
	  )}
	  {user?.role ==="Editor" && (
	  <div className="flex justify-between mt-6 text-sm">
			<button
				className="
				bg-green-500 
				text-white
				px-4 
				py-2 
				rounded-lg
				"
				onClick={handleSubmitBlogs}
			>
			Approve Blog
			</button>

			<button
				className="
				bg-red-500 
				text-white
				px-4 
				py-2 
				rounded-lg
				"
			>
			Reject Blog 
			</button>
	  </div>
	  )}
        </div>
      </Container>
    </PrivateRoutes>
  );
}

