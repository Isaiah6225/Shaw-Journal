"use client";

import Link from "next/link";
import { useAuth } from "../../components/context/AuthContext";
import useAOS from "../../components/hooks/useAOS";
import { useRouter } from "next/navigation";
import { auth } from "../../firebase";

export default function UnauthorizedPage() {
	const { role, username} = useAuth();
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4" data-aos="fade-up" data-aos-duration="1000" >
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
        <p className="text-gray-700 mb-6">
          You do not have permission to view this page.
        </p>

        <div className="flex flex-col gap-4">
          <Link
            href="/home"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-xl transition duration-200"
          >
            Go to Home
          </Link>

          <button
            onClick={handleLogout}
            className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-xl transition duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

