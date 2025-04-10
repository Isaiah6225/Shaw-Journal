import Link from "next/link";
import { useLikes } from "./hooks/useLikes";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useAuth } from "./context/AuthContext";
import { usePopup } from "./hooks/usePopup";
import Popup from "./Popup";
import { useState } from "react";
import { db } from "../firebase";
import { collection, updateDoc, doc, deleteDoc} from "firebase/firestore";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function BlogCard({ id, title, article, author, upvotes, createdAt, comments, status, imageUrl}) {
  
  const router = useRouter();
  const [editArticle, setEditArticle] = useState(article); 
  const [editTitle, setEditTitle] = useState(title);
  const popup = usePopup();
  const { isLiked, likesCount, toggleLike } = useLikes(id);
  
  // handle edit submit
  const handleSubmit = async (e: React.FormEvent) => {
  	e.preventDefault();
	try{
		const blogRef = doc(db, "blogs", id)
		await updateDoc(blogRef, {
			article: editArticle,
			title: editTitle,
			status: "pending",
		});
		popup.close();
		router.replace("/home")
		console.log("Edit article successful")
	} catch (error) {
		console.log("Edit article failed: ", error)
	}

  };

  const handleDelete = async () =>{
  	try{
		const blogRef = doc(db, "blogs", id);
		await deleteDoc(blogRef);
		router.replace("/home");
	} catch (error) {
 		console.log("Deleting blog went wrong: ", error);
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
    <div className="bg-[#FAF9F6] shadow-lg rounded-lg p-4 hover:shadow-xl transition space-y-3">
      {/* Title wrapped in link */}
      <Link href={`/blog/${id}`}>
        <h2 className="text-primary text-xl font-semibold hover:underline">{title}</h2>
      </Link>
      <div>
	{imageUrl && (
	  <Image 
	    src={imageUrl}
	    alt="Blog image"
	    width={500}
	    height={300}
	    className="rounded-md"
	  />
	)}
      </div>

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
	{(status !== "pending" &&  status !== "rejected") && (user?.role === "Author" || user?.role === "Editor") && (

	    <div className="flex items-center space-x-3">
	      <button onClick={toggleLike} className="flex items-center space-x-2">
		<span className={isLiked ? "text-red-500" : "text-gray-500"}>❤️</span>
		<span>{likesCount} Likes</span>
	      </button>

	      <p>💬 {comments?.length || 0} Comments</p>
	    </div>
	)}  
		


	</div>
    </div>
  );
}

