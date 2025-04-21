"use client";

import React from "react";
import Link from "next/link";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import  useAOS  from "../hooks/useAOS";


export default function Container({ children }: { children: React.ReactNode }) {
  const { role, username } = useAuth();
  const router = useRouter();

  useAOS();
        


	const handleLogout = async () => {
	  const user = auth.currentUser;
	  if (role === "Guest") {
	    try {
	      await user.delete();
	      console.log("Guest account deleted");
	    } catch (error) {
	      console.error("Failed to delete guest user:", error);
	    }
	  } else {
	    await auth.signOut();
	  }
	  
	  //Clear cookies
	  await fetch("/api/logout", { method: "POST" });

	  router.push("/");
	};



  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="w-full bg-[#800020] shadow-md py-4 px-6 fixed top-0 left-0 z-50 text-white" data-aos="fade-down" data-aos-duration="700">
	  <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
	    
	    {/* Left: Logo */}
	    <Link href="/home" className="text-3xl font-bold whitespace-nowrap">
	      Shaw News
	    </Link>

	    {/* Center: Nav */}
	    <nav className="hidden md:flex gap-x-6 flex-grow justify-center">
	      <Link href="/sports" className="text-lg font-bold">Sports</Link>
	      <Link href="/tech" className="text-lg font-bold">Technology</Link>
	      <Link href="/entertainment" className="text-lg font-bold">Entertainment</Link>
	      <Link href="/general" className="text-lg font-bold">General</Link>
	      <Link href="/food" className="text-lg font-bold">Food</Link>
	    </nav>

	    {/* Right: Actions */}
	    <div className="flex items-center gap-3 flex-wrap justify-end">
	      {role === "Author" && (
		<>
		  <Link href="/create-blog" className="bg-[#EFBF04] text-white px-4 py-2 rounded-lg whitespace-nowrap">
		    + Create Blog
		  </Link>
		  <Link href="/edit-posts" className="bg-[#EFBF04] text-white px-4 py-2 rounded-lg whitespace-nowrap">
		  	✏️ Check Blogs
		  </Link>
		</>
	      )}

	      {(role === "Author" || role === "Editor") && (
		<Link href="/liked-posts" className="bg-[#EFBF04] text-white px-4 py-2 rounded-lg whitespace-nowrap">
		  ❤️ Liked Blogs
		</Link>
	      )}

	      {role === "Editor" && (
		<Link href="/editor-panel" className="bg-[#EFBF04] text-white px-4 py-2 rounded-lg whitespace-nowrap">
		  📄 Editor Panel
		</Link>
	      )}

	      <div className="text-sm md:text-base font-medium bg-[#EFBF04] text-[#800020] px-3 py-1.5 rounded-lg shadow-md max-w-[10rem] ">
		👋 Hello, {username}
	      </div>

	      <button
		onClick={handleLogout}
		className="bg-red-500 text-white px-4 py-2 rounded-lg whitespace-nowrap cursor-pointer"
	      >
		Logout
	      </button>
	    </div>
	  </div>
	</header>


      {/* Main Content */}
      <main className="flex-grow pt-24 px-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#800020] text-white text-center py-4 mt-8">
        <p className="text-sm">&copy; {new Date().getFullYear()} Shaw News. All rights reserved.</p>
      </footer>
    </div>
  );
}

