"use client";

import { useFetchBlogs } from "../../components/hooks/useFetchBlogs";
import Container from "../../components/ui/Container";
import PrivateRoutes from "../../components/PrivateRoutes";
import BlogCard from "../../components/BlogCard";

export default function HomePage() {
  const { blogs, loading, error } = useFetchBlogs("General");   
  return (
    <PrivateRoutes>
      <Container>

	{loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {/* Display Blogs */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 p-6 justify-items-center bg-primary">
  {blogs.map((blog) => (
    <div key={blog.id} className="w-full max-w-sm"> {/* Limits max width for consistent sizing */}
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

      </Container>
    </PrivateRoutes>
  );
}
