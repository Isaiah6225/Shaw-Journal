"use client";

import { useFetchBlogsSub } from "../../components/hooks/useFetchBlogsSub";
import BlogCardLargeHome from "../../components/BlogCardLargeHome";
import Container from "../../components/ui/Container";
import { useAuth } from "../../components/context/AuthContext"; 
import { useEffect } from "react"; 
import { useRouter } from "next/navigation";
import  Loading from "../../components/ui/LoadingBackground"; 

export default function EditPosts(){
    const { blogs: userBlogs, loading, error } = useFetchBlogsSub();
    const { role, loading: userLoading } = useAuth();
    const router = useRouter(); // Initialize router

      useEffect(() => {
	    if (!userLoading && role && role !== "Author") {
	      router.push("/unauthorized");
	    }
	  }, [role, router, userLoading]); // Run this effect whenever the role changes

	  if (!userLoading && role && role !== "Author") {
	    return null;
	  }




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



    return (
		<Container>           
	    {(userLoading || !role) && <Loading />} 


        		{/* Display Blogs */}
        		<div className="grid grid-cols-1 lg:grid-cols-3 gap-12 my-12">
					{renderBlogCards(userBlogs)}	
       			 </div>
		</Container>
    );
}
