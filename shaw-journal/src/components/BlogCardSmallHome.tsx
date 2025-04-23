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
  createdAt: string;  // Add this line
};
export default function BlogCardSmallHome({ id, imageUrl, title, article, author, status, category }: BlogCardHomeProps) {
  const router = useRouter();

  const { loading: loadingUser, uid, role  } = useAuth();




  return (
    <div className="mb-6">
	  <Link
	    href={`/blog/${id}`}
	    className="block w-full rounded-lg overflow-hidden bg-neutral-100 text-black group shadow-md hover:shadow-lg transition-shadow duration-300"
	  >
	    <div className="flex flex-col md:flex-row h-72">
	      {/* Left Section (Text) */}
	      <div className="md:w-1/2 p-6 flex flex-col justify-center bg-neutral-100">
		<div>
		  <span className="inline-block bg-black text-white text-xs font-semibold px-2 py-1 rounded mb-2">
		    {category}
		  </span>
		  <h2 className="text-2xl md:text-3xl font-semibold mb-3 group-hover:underline">
		    {title}
		  </h2>
		  <div className="text-gray-700 text-sm md:text-base leading-relaxed line-clamp-3">
		    <ReactMarkdown
		      remarkPlugins={[remarkGfm]}
		      components={{
			p: ({ node, ...props }) => (
			  <p className="leading-relaxed" {...props} />
			),
		      }}
		    >
		      {article}
		    </ReactMarkdown>
		  </div>
		</div>
		<p className="text-sm text-gray-600 mt-4">By {author}</p>
	      </div>

	      {/* Right Section (Image) */}
	      {imageUrl && (
		<div className="md:w-1/2 relative h-48 md:h-auto">
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
	    </div>
	  </Link>
	</div>
  );
}


