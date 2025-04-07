"use client";

import Container from "../../../components/ui/Container";
import PrivateRoutes from "../../../components/PrivateRoutes";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "../../../firebase";
import { doc, getDoc, updateDoc, arrayUnion, collection } from "firebase/firestore"; // Added collection
import { useLikes } from "../../../components/hooks/useLikes";
import { useAuth } from "../../../components/context/AuthContext";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function BlogPage({ status }) {
  const { id } = useParams();
  const [blog, setBlog] = useState<any>(null);
  const [message, setMessage] = useState<string>("");
  const [newComment, setNewComment] = useState<string>("");
  const router = useRouter();
  const { user, loadingUser, isGuest } = useAuth(); // Add isGuest
  const { isLiked, likesCount, toggleLike } = useLikes(id);

  if (loadingUser) return <p>Loading...</p>;

  useEffect(() => {
    // Ensure id is a string before proceeding
    const blogId = typeof id === 'string' ? id : Array.isArray(id) ? id[0] : undefined;
    if (!blogId) {
      setMessage("Invalid blog ID.");
      return;
    }

    const fetchBlog = async () => {
      try {
        const docRef = doc(db, "blogs", blogId); // Use validated blogId
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
  }, [id]); // Keep id in dependency array

  // Define the comment structure
  interface Comment {
    text: string;
    userName: string;
    userId: string;
    timestamp: Date; // Optional: Add a timestamp
  }

  const handleAddComment = async () => {
    const blogId = typeof id === 'string' ? id : Array.isArray(id) ? id[0] : undefined;
    if (!blogId || !blog || newComment.trim() === "" || !user) return; // Ensure user is logged in and blogId is valid

    try {
      // 1. Fetch user's name from 'users' collection
      const userRef = doc(db, "users", user.uid); // user.uid is already a string
      const userSnap = await getDoc(userRef);
      let userName = "Anonymous"; // Default name
      if (userSnap.exists()) {
        // Assuming the user document has a 'name' or 'displayName' field
        userName = userSnap.data().name || userSnap.data().displayName || "Unknown User";
      } else {
        console.warn("User document not found for UID:", user.uid);
      }

      // 2. Create the comment object
      const commentToAdd: Comment = {
        text: newComment.trim(),
        userName: userName,
        userId: user.uid,
        timestamp: new Date(), // Add current timestamp
      };

      // 3. Update Firestore document
      const blogRef = doc(db, "blogs", blogId); // Use validated blogId
      await updateDoc(blogRef, { comments: arrayUnion(commentToAdd) });

      // 4. Update local state
      setBlog((prev) => ({
        ...prev!,
        comments: [...(prev?.comments || []), commentToAdd], // Add the object
      }));
      setNewComment(""); // Clear the input field
    } catch (error) {
      console.error("Error adding comment:", error);
      // Optionally, set an error message for the user
    }
  };

  const handleSubmitBlogs = async () => {
    const blogId = typeof id === 'string' ? id : Array.isArray(id) ? id[0] : undefined;
    if (!blogId) {
        setMessage("Invalid blog ID for approval.");
        return;
    }
    try {
      const approvedData = {
        status: "approved",
      };
      const blogRef = doc(db, "blogs", blogId); // Use validated blogId
      await updateDoc(blogRef, approvedData);
      setMessage("Blog approved!");
      router.push("/home");
    } catch (error) {
      console.error("Error approving blog: ", error);
      setMessage("Error approving blog");
    }
  };

  const handleRejectBlogs = async () => {
    const blogId = typeof id === 'string' ? id : Array.isArray(id) ? id[0] : undefined;
     if (!blogId) {
        setMessage("Invalid blog ID for rejection.");
        return;
    }
    try {
      const rejectedData = {
        status: "rejected",
      };
      const blogRef = doc(db, "blogs", blogId); // Use validated blogId
      await updateDoc(blogRef, rejectedData);
      setMessage("Blog rejected!");
      router.push("/home");
    } catch (error) {
      console.error("Error rejecting blog: ", error);
      setMessage("Error rejecting blog");
    }
  };

  if (!blog) return <p className="text-center mt-10">{message || "Loading blog..."}</p>;

  return (
    <PrivateRoutes>
      <Container>
        <div className="max-w-3xl mx-auto p-6">
          <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>

          {blog.image && (
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-60 object-cover rounded-lg mb-4"
            />
          )}

          {/* Markdown-formatted article */}
          <div className="prose prose-lg max-w-none text-gray-700">

<ReactMarkdown
  remarkPlugins={[remarkGfm]}
  components={{
    a: ({ node, ...props }) => (
      <a
        {...props}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline"
      />
    ),
    h1: ({ node, ...props }) => (
      <h1 className="text-3xl font-bold text-primary" {...props} />
    ),
    h2: ({ node, ...props }) => (
      <h2 className="text-2xl font-semibold text-primary" {...props} />
    ),
    h3: ({ node, ...props }) => (
      <h3 className="text-xl font-bold text-primary" {...props} />
    ),
    h4: ({ node, ...props }) => (
      <h4 className="text-lg font-bold text-primary" {...props} />
    ),
    h5: ({ node, ...props }) => (
      <h5 className="text-md font-bold text-primary" {...props} />
    ),
    p: ({ node, ...props }) => (
      <p className="text-gray-700 leading-relaxed" {...props} />
    ),
    ul: ({ node, ...props }) => (
      <ul className="list-disc pl-5 text-gray-700" {...props} />
    ),
    ol: ({ node, ...props }) => (
      <ol className="list-decimal pl-5 text-gray-700" {...props} />
    ),
    li: ({ node, ...props }) => (
      <li className="text-gray-700" {...props} />
    ),
    blockquote: ({ node, ...props }) => (
      <blockquote className="border-l-4 pl-4 text-gray-500 italic" {...props} />
    ),
    code: ({ node, ...props }) => (
      <code className="bg-gray-200 p-1 rounded-md text-sm">{props.children}</code>
    ),
  }}
>
  {blog.article}
</ReactMarkdown>

	  </div>

          {/* Like/Unlike & Comments Count - Show only if NOT guest and Author */}
          {!isGuest && user?.role === "Author" && blog.status === "approved" && (

            <div className="flex justify-between mt-6 text-sm text-gray-500">
              {user && ( // Keep inner check for safety, though outer !isGuest covers it
                <button
                  onClick={toggleLike}
                  className={`px-4 py-2 rounded-lg ${
                    isLiked ? "bg-red-500 text-white" : "bg-gray-200 text-black"
                  }`}
                >
                  {isLiked ? "❤️ Liked" : "🤍 Like"} {likesCount}
                </button>
              )}
              <span>💬 {blog.comments?.length || 0} Comments</span>
            </div>
          )}

          {/* Comment Section - Show existing comments for guests, but hide input */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold">Comments</h2>
            <ul className="mt-4 space-y-4"> {/* Increased spacing */}
                {blog.comments?.length > 0 ? (
                  blog.comments.map((comment: Comment, index: number) => (
                    <li key={index} className="bg-gray-100 p-3 rounded-md border border-gray-200">
                      <p className="font-semibold text-gray-800">{comment.userName}</p>
                      <p className="text-gray-600">{comment.text}</p>
                      {/* Optional: Display timestamp */}
                      {/* <p className="text-xs text-gray-400 mt-1">{comment.timestamp?.toDate().toLocaleString()}</p> */}
                    </li>
                  ))
                ) : (
                  <p className="text-gray-500">No comments yet.</p>
                )}
              </ul>
              {/* Add Comment Input - Show only if NOT guest and Author */}
              {!isGuest && user?.role === "Author" && (
                <div className="mt-6 flex gap-2"> {/* Increased margin top */}
                  <input
                    type="text"
                    placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-grow p-2 border rounded-md"
                />
                <button
                  onClick={handleAddComment}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg"
                >
                    Add Comment
                  </button>
                </div>
              )}
            </div>
          {/* )} */} {/* Removed the outer conditional rendering based on role here, handled inside */}

          {/* Editor Actions - Show only if NOT guest and Editor */}
          {!isGuest && user?.role === "Editor" && (
            <div className="flex justify-between mt-6 text-sm">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-lg"
                onClick={handleSubmitBlogs}
              >
                Approve Blog
              </button>

              <button 
	      	className="bg-red-500 text-white px-4 py-2 rounded-lg"
		onClick={handleRejectBlogs}
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
