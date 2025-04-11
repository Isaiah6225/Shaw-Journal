"use client";

import Container from "../../../components/ui/Container";
import PrivateRoutes from "../../../components/PrivateRoutes";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "../../../firebase";
import { doc, getDoc, updateDoc, arrayUnion, collection, addDoc } from "firebase/firestore";
import { useLikes } from "../../../components/hooks/useLikes";
import { useAuth } from "../../../components/context/AuthContext";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useFetchComments } from "../../../components/hooks/useFetchComments";

export default function BlogPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState<any>(null);
  const [message, setMessage] = useState<string>("");
  const [newComment, setNewComment] = useState<string>("");
  const router = useRouter();
  const [refreshComments, setRefreshComments] = useState(false);
  const { user, loadingUser, isGuest } = useAuth(); 
  const { isLiked, likesCount, toggleLike } = useLikes(id);
  const { comments, loading: loadingComments } = useFetchComments(id as string, refreshComments);

  useEffect(() => {
    if(loadingUser) return;

    const blogId = typeof id === 'string' ? id : Array.isArray(id) ? id[0] : undefined;
    if (!blogId) {
      setMessage("Invalid blog ID.");
      return;
    }

    const fetchBlog = async () => {
      try {
        const docRef = doc(db, "blogs", blogId); 
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
  }, [id, loadingUser]);

  const handleAddComment = async () => {
    const blogId = typeof id === 'string' ? id : Array.isArray(id) ? id[0] : undefined;
    if (!blogId || !newComment.trim()) return;

    try {
      const commentToAdd: Comment = {
        userName: "Unknown",
        text: newComment.trim(),
        timestamp: new Date(),
      };

      if (user) {
        const userRef = doc(db, "users", user.uid); 
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          commentToAdd.userName = userSnap.data().name || "Unknown User";
        } else {
          commentToAdd.userName = "Anonymous";
        }
      } else {
        const guestName = localStorage.getItem("guestName");
        commentToAdd.userName = guestName || "Guest";
      }

      const blogRef = doc(db, "blogs", blogId); 
      const commentsRef = collection(blogRef, "comments");
      await addDoc(commentsRef, commentToAdd);

      setRefreshComments(true);

      setTimeout(() => {
        setRefreshComments(false);
      }, 1000);

      setNewComment("");



    } catch (error) {
      console.error("Error adding comment", error);
    }
  };

    //Handle submitting blogs
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
      const blogRef = doc(db, "blogs", blogId);  
      await updateDoc(blogRef, approvedData);
      setMessage("Blog approved!");
      router.push("/home");
    } catch (error) {
      console.error("Error approving blog: ", error);
      setMessage("Error approving blog");
    }
  };
  
  //handle rejecting blogs
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
          {/* Render Markdown content */}
          <div className="prose prose-lg max-w-none text-gray-700">
	  	<div className="flex flex-col space-y-6">
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
          </div>

          {/* Like/Unlike & Comments */}
          <div className="flex justify-between mt-6 text-sm text-gray-500">
            <button
              onClick={toggleLike}
              className={`px-4 py-2 rounded-lg ${
                isLiked ? "bg-red-500 text-white" : "bg-gray-200 text-black"
              }`}
            >
              {isLiked ? "❤️ Liked" : "🤍 Like"} {likesCount}
            </button>
            <span>💬 {blog.comments?.length || 0} Comments</span>
          </div>

          {/* Comment Section */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold">Comments</h2>
            <ul className="mt-4 space-y-4">
              {comments.length > 0 ? (
                comments.map((comment: Comment, index: number) => (
                  <li key={index} className="bg-gray-100 p-3 rounded-md border border-gray-200">
                    <p className="font-semibold text-gray-800">{comment.userName}</p>
                    <p className="text-gray-600">{comment.text}</p>
                  </li>
                ))
              ) : (
                <p className="text-gray-500">No comments yet.</p>
              )}
            </ul>

            {/* Add Comment Input */}
            {blog.status === "approved" && (
              <div className="mt-6 flex gap-2">
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
			
	  {/* Editor Actions*/}
          {(user?.role === "Editor" && blog.status !== "approved") && (
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

