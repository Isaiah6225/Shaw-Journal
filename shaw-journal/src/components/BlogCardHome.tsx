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

interface BlogCardHomeProps {
  id: string;
  title: string;
  article: string;
  author: string;
  createdAt: any; // Add createdAt here
  imageUrl: string;
  status: string;
}

export default function BlogCardHome({ id, title, article, author, createdAt, status, imageUrl}: BlogCardHomeProps) {
  
  const router = useRouter();
  const popup = usePopup();
  const { isLiked, likesCount, toggleLike } = useLikes(id);
  const { loading: loadingUser, uid } = useAuth();	



  // Convert Firestore Timestamp to JavaScript Date
  const formattedDate = createdAt?.seconds
    ? new Date(createdAt.seconds * 1000).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Unknown Date";


  return (
<div className="mb-6">
  <Link
    href={`/blog/${id}`}
    className="flex gap-4 rounded-lg hover:shadow-xl overflow-hidden shadow-lg bg-white"
  >
    {imageUrl && (
      <div className="relative w-48 h-32 flex-shrink-0">
        <Image
          src={imageUrl}
          alt="Blog image"
          fill
          className="object-cover rounded-l-lg"
        />
      </div>
    )}

    <div className="p-4 flex flex-col justify-between">
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>

      <div className="text-gray-700 prose prose-sm max-w-none line-clamp-2 overflow-hidden">
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
              <p className="leading-relaxed" {...props} />
            ),
            ul: ({ node, ...props }) => (
              <ul className="list-disc pl-5" {...props} />
            ),
            ol: ({ node, ...props }) => (
              <ol className="list-decimal pl-5" {...props} />
            ),
            li: ({ node, ...props }) => (
              <li {...props} />
            ),
            blockquote: ({ node, ...props }) => (
              <blockquote className="border-l-4 pl-4 italic" {...props} />
            ),
            code: ({ node, ...props }) => (
              <code className="bg-gray-200 p-1 rounded-md text-sm">{props.children}</code>
            ),
          }}
        >
          {article}
        </ReactMarkdown>
      </div>

      <p className="text-sm text-gray-600 mt-2">By {author}</p>
    </div>
  </Link>
</div>

 );
}

