"use client";

import { useFetchBlogs } from "../../components/hooks/useFetchBlogs";
import Container from "../../components/ui/Container";
import PrivateRoutes from "../../components/PrivateRoutes";
import BlogCard from "../../components/BlogCard";

export default function HomePage() {
  //fetch newest blogs from firestore
  const { blogs: generalBlogs } = useFetchBlogs({category: "General", status:"approved", limitCount: 1});

  const {
	blogs: entertainmentBlogs,
	loading,
	error
  } = useFetchBlogs({category: "Entertainment", status:"approved", limitCount: 1});

  const { blogs: technologyBlogs } = useFetchBlogs({category: "Tech", status:"approved", limitCount: 1});

  const { blogs: sportsBlogs } = useFetchBlogs({category: "Sports", status:"approved", limitCount: 1});

  return (
	<PrivateRoutes>
  		<Container>
    		{loading && <p>Loading...</p>}
    		{error && <p className="text-red-500">{error}</p>}

   		 {/* GENERAL AND TECH BLOGS */}
   		 <div className="mb-12">
     			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
			
        		{generalBlogs.map((blog) => (
          		<div key={blog.id} >
            			<BlogCard 
              				id={blog.id}
              				title={blog.title}
              				article={blog.article}
              				author={blog.name}
              				upvotes={blog.upvotes || 0}
              				createdAt={blog.createdAt}
              				comments={blog.comments || []}
            			/>
          		</div>
        		))}
			{technologyBlogs.map((blog ) => (
			<div key={blog.id}>
				<BlogCard
					id={blog.id}
					title={blog.title}
					article={blog.article}
					author={blog.name}
					upvotes={blog.upvotes || 0}
					createdAt={blog.createdAt}
					comments={blog.comments || []}
				/>
			</div>
			))}
		
      			</div>
    		</div>

    		{/* ENTERTAINMENT BLOGS */}
   		<div>
      			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
       	 		{entertainmentBlogs.map((blog) => (
          		<div key={blog.id}>
           			 <BlogCard 
              				id={blog.id}
              				title={blog.title}
              				article={blog.article}
              				author={blog.name}
              				upvotes={blog.upvotes || 0}
              				createdAt={blog.createdAt}
              				comments={blog.comments || []}
            			/>
          		</div>
        		))}

			{sportsBlogs.map((blog) => (
			<div key={blog.id}>
				<BlogCard
					id={blog.id}
					title={blog.title}
					article={blog.article}
					author={blog.name}
					upvotes={blog.upvotes || 0}
					createdAt={blog.createdAt}
					comments={blog.comments || []}
				/>
			</div>
			))}
      		</div>
   	 	</div>
  		</Container>
	</PrivateRoutes>

  );
}

