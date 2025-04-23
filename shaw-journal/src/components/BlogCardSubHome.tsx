import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useRouter } from "next/navigation";
import { useAuth } from "./context/AuthContext";
import { usePopup } from "./hooks/usePopup";
import Popup from "./Popup";
import { useState } from "react";
import { db } from "../firebase";
import { updateDoc, doc, deleteDoc } from "firebase/firestore";
type BlogCardHomeProps = {
  id: string;
  imageUrl: string;
  title: string;
  article: string;
  author: string;
  status: string;
  category: string;
  createdAt: string;  // Add createdAt if needed
};
export default function BlogCardSubHome({ id, imageUrl, title, article, author, status, category }: BlogCardHomeProps) {
  const router = useRouter();
  const { loading: loadingUser, uid, role  } = useAuth();




  return (
	<div className="mb-4 w-64 aspect-[1/1]">
	  <Link
	    href={`/blog/${id}`}
	    className="block h-full w-full rounded-md overflow-hidden bg-neutral-100 text-black group shadow-sm hover:shadow-md transition-shadow duration-300"
	  >
	    <div className="flex flex-col h-full">
	      {/* Top Section (Image - 50%) */}
	      {imageUrl && (
		<div className="w-full h-1/2 relative">
		  <Image
		    src={imageUrl}
		    alt="Blog image"
		    fill
		    sizes="(max-width: 768px) 100vw, 50vw"
		    quality={100}
		    className="object-cover"
		  />
		</div>
	      )}

	      {/* Bottom Section (Text - 50%) */}
	      <div className="h-1/2 p-4 flex flex-col justify-between bg-neutral-100">
		<div>
		  <span className="inline-block bg-black text-white text-xs font-semibold px-2 py-0.5 rounded mb-1">
		    {category}
		  </span>
		  <h2 className="text-base font-semibold mb-1 leading-snug group-hover:underline">
		    {title}
		  </h2>
		  <div className="text-gray-700 text-sm leading-snug line-clamp-2">
		    <ReactMarkdown
		      remarkPlugins={[remarkGfm]}
		      components={{
			p: ({ node, ...props }) => (
			  <p className="leading-snug" {...props} />
			),
		      }}
		    >
		      {article}
		    </ReactMarkdown>
		  </div>
		</div>
		<p className="text-xs text-gray-600 mt-2">By {author}</p>
	      </div>
	    </div>
	  </Link>
	</div>

  );
}



