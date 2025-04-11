"use client";

import { useFetchBlogsSub } from "../../components/hooks/useFetchBlogsSub";
import BlogCardLargeHome from "../../components/BlogCardLargeHome";
import Container from "../../components/ui/Container";
import PrivateRoutes from "../../components/PrivateRoutes";
import { useAuth } from "../../components/context/AuthContext"; 
import { useEffect } from "react"; 
import { useRouter } from "next/navigation";
 

export default function EditPosts(){
    const { blogs: userBlogs, loading, error } = useFetchBlogsSub();
    const { isGuest, loadingUser } = useAuth(); // Get guest status and loading state
    const router = useRouter(); // Initialize router

    // Redirect guest users
    useEffect(() => {
        if (!loadingUser && isGuest) {
            router.push("/home"); // Redirect guests away
        }
    }, [isGuest, loadingUser, router]);


    const renderBlogCards = (blogs) =>
    blogs.map((blog) => (
      <BlogCardLargeHome
        key={blog.id}
        id={blog.id}
        title={blog.title}
        article={blog.article}
        author={blog.name}
	imageUrl={blog.imageUrl}
	status={blog.status}
      />
    ));

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
        		<div className="grid grid-cols-1 lg:grid-cols-3 gap-12 my-12">
					{renderBlogCards(userBlogs)}
				
       			 </div>
		</Container>
	</PrivateRoutes>
    );
}
