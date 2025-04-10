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

export default function BlogCardHome({ id, title, article, author, createdAt}) {
  
  const router = useRouter();
  const [editArticle, setEditArticle] = useState(article); 
  const [editTitle, setEditTitle] = useState(title);
  const popup = usePopup();
  const { isLiked, likesCount, toggleLike } = useLikes(id);


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


    </div>
  );
}

