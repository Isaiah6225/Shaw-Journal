import React from "react";
import Link from "next/link";

export default function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-3xl lg:max-w-[70%] mx-auto p-6">
      <div className="flex justify-center mb-6">
        <Link href="/home" className="text-3xl font-bold text-center">Shaw News</Link>
      </div>
      
      <div className="flex justify-center mb-6 space-x-6">
        <Link href="/sports" className="text-lg font-bold text-center">Sports</Link>
        <Link href="/tech" className="text-lg font-bold text-center">Technology</Link>
      </div>
	
	{/* Button to Create Blog */}
        <div className="mb-6 flex justify-center space-x-6">
          <Link href="/create-blog" className="bg-green-500 text-white px-4 py-2 rounded-lg">
            + Create Blog
          </Link>
	  <Link href="/liked-posts" className="bg-green-500 text-white px-4 py-2 rounded-lg">
            ❤️ Liked Posts
          </Link>
	  <Link href="/edit-posts" className="bg-green-500 text-white px-4 py-2 rounded-lg">
	    ✏️ Edit Posts
	  </Link>
        </div>
      {children}
    </div>
  );
}


