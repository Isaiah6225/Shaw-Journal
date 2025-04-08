"use client";

import { useFetchBlogsSub } from "../../components/hooks/useFetchBlogsSub";
import BlogCard from "../../components/BlogCard";
import Container from "../../components/ui/Container";
import PrivateRoutes from "../../components/PrivateRoutes";
import { useAuth } from "../../components/context/AuthContext"; // Import useAuth
import { useEffect } from "react"; // Import useEffect
import { useRouter } from "next/navigation"; // Import useRouter

export default function EditPosts(){
    const { blogs, loading, error } = useFetchBlogsSub();
    const { isGuest, loadingUser } = useAuth(); // Get guest status and loading state
    const router = useRouter(); // Initialize router

    // Redirect guest users
    useEffect(() => {
        if (!loadingUser && isGuest) {
            router.push("/home"); // Redirect guests away
        }
    }, [isGuest, loadingUser, router]);

    // Render loading or nothing if checking auth/guest status
    if (loadingUser || isGuest) {
        return <p>Loading...</p>; // Or null, or a dedicated loading component
    }

    return (
	<PrivateRoutes>
		<Container>           
			{loading && <p>Loading...</p>}
        		{error && <p className="text-red-500">{error}</p>}

        		{/* Display Blogs */}
        		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-primary">
          			{blogs.map((blog) => (
	       				<BlogCard 
              					key={blog.id}
              					id={blog.id}
              					title={blog.title}
              					article={blog.article}
              					author={blog.name}
              					upvotes={blog.upvotes || 0}
              					createdAt={blog.createdAt}
						status={blog.status}
              					comments={blog.comments || []}
            				/>
          			))}
       			 </div>
		</Container>
	</PrivateRoutes>
    );
}
