import React from "react";
import Link from "next/link";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";


export default function Container({ children }: { children: React.ReactNode }) {
  const { user, loadingUser } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/"); // Redirect to login
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (loadingUser) return <p>Loading...</p>;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="w-full bg-white shadow-md py-4 px-6 fixed top-0 left-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/home" className="text-3xl font-bold">
            Shaw News
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex gap-x-6">
            <Link href="/sports" className="text-lg font-bold">Sports</Link>
            <Link href="/tech" className="text-lg font-bold">Technology</Link>		
	    <Link href="/entertainment" className="text-lg font-bold">Entertainment</Link>
            <Link href="/general" className="text-lg font-bold">General</Link>
	    <Link href="/food" className="text-lg font-bold">Food</Link>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-x-4">
            {user?.role === "Author" && (
              <div className="flex gap-x-4">
                <Link href="/create-blog" className="bg-green-500 text-white px-4 py-2 rounded-lg">
                  + Create Blog
                </Link>  
               	<Link href="/edit-posts" className="bg-green-500 text-white px-4 py-2 rounded-lg">
              		✏️ Check Blogs
            	</Link> 
              </div>
            )}
            
            
	    <Link href="/liked-posts" className="bg-green-500 text-white px-4 py-2 rounded-lg">
                  ❤️ Liked Blogs
            </Link>

	    {user?.role === "Editor" && (
	    <Link href="/editor-panel" className="bg-green-500 text-white px-4 py-2 rounded-lg">
		📄Editor Panel
	    </Link>
	    )}
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Content Wrapper */}
      <div className="max-w-2xl lg:max-w-[90%] mx-auto p-6 mt-20">
        {children}
      </div>
    </div>
  );
}

