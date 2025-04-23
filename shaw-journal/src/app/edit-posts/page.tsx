"use client";

import { useFetchBlogsSub } from "../../components/hooks/useFetchBlogsSub";
import BlogCardLargeHome from "../../components/BlogCardLargeHome";
import Container from "../../components/ui/Container";
import { useAuth } from "../../components/context/AuthContext"; 
import { useEffect } from "react"; 
import { useRouter } from "next/navigation";
import  Loading from "../../components/ui/LoadingBackground";


export default function EditPosts(){
    const { blogs: approvedBlogs,  } = useFetchBlogsSub({ status: "approved"});
    const { blogs: pendingBlogs,   } = useFetchBlogsSub({ status: "pending"});
    const { blogs: rejectedBlogs, loading, error } = useFetchBlogsSub({ status: "rejected"});

    const { role, loading: userLoading } = useAuth();
    const router = useRouter(); 

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

	  {/* Right Main Content - Side-by-side blog grids */}
	  <div className="md:w-2/3 lg:w-3/4 flex flex-col gap-12">
	    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
	      
	      {/* Approved Blogs */}
	      <div className="space-y-6" data-aos="fade-right" data-aos-duration="1200">
		<h2 className="text-xl font-semibold uppercase tracking-wide border-b pb-2">
		  Approved Blogs 
		</h2>
		{renderBlogCards(approvedBlogs)}
	      </div>

	      {/* Pending Blogs */}
	      <div className="space-y-6 z-40" data-aos="fade-up" data-aos-duration="1200">
		<h2 className="text-xl font-semibold uppercase tracking-wide border-b pb-2">
		  Pending Blogs 
		</h2>
		{renderBlogCards(pendingBlogs)}
	      </div>

	      {/* Rejected Blogs */}
	      <div className="space-y-6" data-aos="fade-left" data-aos-duration="1200">
		<h2 className="text-xl font-semibold uppercase tracking-wide border-b pb-2">
		  Rejected Blogs 
		</h2>
		{renderBlogCards(rejectedBlogs)}
	      </div>

	    </div>


	  </div>	
	</Container>

    );
}
