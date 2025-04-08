"use client";

import Link from "next/link";
import Container from "../../components/ui/Container";
import PrivateRoutes from "../../components/PrivateRoutes";
import BlogCard from "../../components/BlogCard";
import { useFetchBlogs } from "../../components/hooks/useFetchBlogs";

export default function TechPage() {
  const { blogs: technologyBlogs, loading, error } = useFetchBlogs({category: "Tech", status:"approved"}); 

  const renderBlogCards = (blogs) =>
    blogs.map((blog) => (
      <BlogCard
        key={blog.id}
        id={blog.id}
        title={blog.title}
        article={blog.article}
        author={blog.name}
        upvotes={blog.upvotes || 0}
        createdAt={blog.createdAt}
        comments={blog.comments || []}
	status={blog.status}

      />
    ));

  return (
    <PrivateRoutes>
      <Container>
		
	{loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {/* Display Blogs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">	
		{renderBlogCards(technologyBlogs)}
        </div>

      </Container>
    </PrivateRoutes>
  );
}

