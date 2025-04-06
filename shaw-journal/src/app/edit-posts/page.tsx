"use client";

import { useFetchBlogsSub } from "../../components/hooks/useFetchBlogsSub";
import BlogCard from "../../components/BlogCard";
import Container from "../../components/ui/Container";
import PrivateRoutes from "../../components/PrivateRoutes";

export default function EditPosts(){
    const { blogs, loading, error } = useFetchBlogsSub();
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
              					comments={blog.comments || []}
            				/>
          			))}
       			 </div>
		</Container>
	</PrivateRoutes>
    );
}

