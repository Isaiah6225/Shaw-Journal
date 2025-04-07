"use client";

import Container from "../../../components/ui/Container";
import PrivateRoutes from "../../../components/PrivateRoutes";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "../../../firebase";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
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
  const { user, loadingUser } = useAuth();
  const { isLiked, likesCount, toggleLike } = useLikes(id);

  if (loadingUser) return <p>Loading...</p>;

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

  const handleAddComment = async () => {
    if (!blog || newComment.trim() === "") return;
    try {
      const blogRef = doc(db, "blogs", id);
      await updateDoc(blogRef, { comments: arrayUnion(newComment) });
      setBlog((prev) => ({
        ...prev!,
        comments: [...(prev?.comments || []), newComment],
      }));
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleSubmitBlogs = async () => {
    try {
      const approvedData = {
        status: "approved",
      };
      const blogRef = doc(db, "blogs", id);
      await updateDoc(blogRef, approvedData);
      setMessage("Blog approved!");
      router.push("/home");
    } catch (error) {
      console.error("Error approving blog: ", error);
      setMessage("Error approving blog");
    }
  };

  const handleRejectBlogs = async () => {
    try {
      const rejectedData = {
        status: "rejected",
      };
      const blogRef = doc(db, "blogs", id);
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

          {/* Like/Unlike & Comments Section */}
          {(["Author, Editor"].includes(user?.role) === "Author" && status === "approved") && (
            <div className="flex justify-between mt-6 text-sm text-gray-500">
              {user && (
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

          {/* Comment Section */}
          {user?.role === "Author" && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold">Comments</h2>
              <ul className="mt-4 space-y-2">
                {blog.comments?.map((comment: string, index: number) => (
                  <li key={index} className="bg-gray-500 p-2 rounded-md text-white">
                    {comment}
                  </li>
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
                <button
                  onClick={handleAddComment}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg"
                >
                  Add Comment
                </button>
              </div>
            </div>
          )}

          {/* Editor Actions */}
          {user?.role === "Editor" && (
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

