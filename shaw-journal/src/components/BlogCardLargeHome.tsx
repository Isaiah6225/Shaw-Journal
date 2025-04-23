import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useRouter } from "next/navigation";
import { useAuth } from "./context/AuthContext";
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
  category?: string;  // Make category optional
  createdAt?: string;  // Make createdAt optional
};

export default function BlogCardlargeHome({ id, imageUrl, title, article, author, status }: BlogCardHomeProps) {
  const router = useRouter();
  const { loading: loadingUser, uid, role  } = useAuth();



  const handleDelete = async () => {
    try {
      const blogRef = doc(db, "blogs", id);
      await deleteDoc(blogRef);
      router.replace("/home");
    } catch (error) {
      console.log("Deleting blog went wrong: ", error);
    }
  };


  return (
    <div className="mb-6"> {/* Overall wrapper */}
      <Link href={`/blog/${id}`}   className="block relative w-full h-128 rounded-lg hover:shadow-xl overflow-hidden shadow-lg">
          {imageUrl && (
            <Image
              src={imageUrl}
              alt="Blog image" 
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
	      quality={100}
              className="object-cover"
            />
          )}
          <div className="absolute inset-0 bg-opacity-50 flex flex-col justify-end p-4 z-10">
            <h2 className="text-white text-xl font-bold">{title}</h2>
            <div className="text-white prose prose-sm max-w-none line-clamp-2 overflow-hidden">
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
                    <p className="text-white leading-relaxed" {...props} />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul className="list-disc pl-5 text-white" {...props} />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol className="list-decimal pl-5 text-white" {...props} />
                  ),
                  li: ({ node, ...props }) => (
                    <li className="text-white" {...props} />
                  ),
                  blockquote: ({ node, ...props }) => (
                    <blockquote className="border-l-4 pl-4 text-white italic" {...props} />
                  ),
                  code: ({ node, ...props }) => (
                    <code className="bg-white p-1 rounded-md text-sm">{props.children}</code>
                  ),
                }}
              >
                {article}
              </ReactMarkdown>
            </div>
            <p className="flex justify-between items-center text-white space-x-4">By {author}</p>
          </div>
        
      </Link>

      {/* Editor and Author actions below  the card */}
      {(status === "pending" || status === "rejected") && (role === "Author" || role === "Editor") && (
        <div className="mt-2 flex items-center space-x-3">
          <div className="p-4 border rounded-lg bg-gray-50 mb-4">
            <p
              className={`text-sm font-semibold mb-2 ${
                status === "pending" ? "text-yellow-500" : "text-red-500"
              }`}
            >
              Status: {status.charAt(0).toUpperCase() + status.slice(1)}
            </p>

            <button
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-200"
              onClick={handleDelete}
            >
              Delete Blog
            </button>
          </div>

        </div>
      )}
    </div>
  );
}

