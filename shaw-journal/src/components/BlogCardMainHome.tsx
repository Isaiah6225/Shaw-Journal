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
  createdAt: string;  
};

export default function BlogCardMainHome({ id, imageUrl, title, article, author, status, createdAt }: BlogCardHomeProps) {
  const router = useRouter();

  const { loading: loadingUser, uid, role  } = useAuth();




  return (
	<div className="mb-10 w-full max-w-6xl mx-auto">
	  <Link
	    href={`/blog/${id}`}
	    className="block rounded-lg overflow-hidden bg-neutral-100 text-black group shadow-md hover:shadow-lg transition-shadow duration-300"
	  >
	    <div className="flex flex-col md:flex-row">
	      {/* Left Section */}
	      <div className="md:w-2/3 p-6 flex flex-col justify-center">
		<p className="text-gray-600 text-sm mb-1">By {author}</p>
		<h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4 group-hover:underline transition-all duration-200">
		  {title}
		</h1>

		<div className="text-gray-700 text-base leading-relaxed line-clamp-3">
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

	      {/* Right Image Section */}
	      {imageUrl && (
		<div className="md:w-1/3 relative h-64 md:h-auto">
		  <Image
		    src={imageUrl}
		    alt="Main blog image"
		    fill
		    sizes="(max-width: 768px) 100vw, 33vw"
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



