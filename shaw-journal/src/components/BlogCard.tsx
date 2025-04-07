import Link from "next/link";
import { useLikes } from "./hooks/useLikes";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useAuth } from "./context/AuthContext";
import { usePopup } from "./hooks/usePopup";
import Popup from "./Popup";
import { useState } from "react";
import { db } from "../firebase";
import { collection, updateDoc, doc } from "firebase/firestore";

export default function BlogCard({ id, title, article, author, upvotes, createdAt, comments, status }) {
  
  const [editArticle, setEditArticle] = useState(article); 
  const popup = usePopup();
  const { isLiked, likesCount, toggleLike } = useLikes(id);

  // handle edit submit
  const handleSubmit = async (e: React.FormEvent) => {
  	e.preventDefault();
	try{
		const blogRef = doc(db, "blogs", id)
		await updateDoc(blogRef, {
			article: editArticle,
		});
		popup.close();
		console.log("Edit article successful")
	} catch (error) {
		console.log("Edit article failed: ", error)
	}

  };

  // Convert Firestore Timestamp to JavaScript Date
  const { user, loadingUser } = useAuth();
  const formattedDate = createdAt?.seconds
    ? new Date(createdAt.seconds * 1000).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Unknown Date";

  if (loadingUser) return <p>Loading...</p>;

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 hover:shadow-xl transition space-y-3">
      {/* Title wrapped in link */}
      <Link href={`/blog/${id}`}>
        <h2 className="text-primary text-xl font-semibold hover:underline">{title}</h2>
      </Link>

      {/* Markdown preview */}
      <div className="text-gray-600 prose prose-sm max-w-none line-clamp-2 overflow-hidden">
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
  {article}
</ReactMarkdown>

      </div>

      {/* Blog Metadata */}
      <div className="mt-2 flex justify-between text-sm text-gray-500">
        <p>By <span className="font-semibold">{author}</span></p>
        <p>{formattedDate}</p>
      </div>

      {/* Likes & Comments */}
<div className="flex justify-between items-center text-gray-600 space-x-4">
  {status === "approved" && (
    <div className="flex items-center space-x-6">
      <button onClick={toggleLike} className="flex items-center space-x-2">
        <span className={isLiked ? "text-red-500" : "text-gray-500"}>❤️</span>
        <span>{likesCount} Likes</span>
      </button>

      <p>💬 {comments?.length || 0} Comments</p>
    </div>
  )}
	
{(status === "pending" || status === "rejected") && (user?.role === "Author" || user?.role === "Editor") && (
  <div>
    <p className="text-sm font-medium text-gray-500">Status: {status}</p>
  </div>
)}

{(status === "rejected" || status === "pending") && (user?.role === "Author") && (
  <div>
  	<button
		className="text-white bg-green-500 px-4 py-2 rounded-lg"
		onClick ={popup.open}
	>
		Edit Blog
	</button>

	<Popup isOpen={popup.isOpen} close={popup.close}>
		<form onSubmit ={handleSubmit} className="flex flex-col gap-4">
		<textarea
			value={editArticle}
			onChange={(e) => setEditArticle(e.target.value)}
		>
		</textarea>
		<button 
			type="submit"
			disabled={!editArticle.trim()}
			className="text-white bg-green-500 px-4 py-2 rounded-lg"
			>	
			Submit
		</button>
		</form>
	</Popup>
  </div>
)}

</div>
    </div>
  );
}

