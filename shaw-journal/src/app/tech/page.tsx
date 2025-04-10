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

        <div className="sticky top-0 z-10 bg-primary py-2">
        <h1 className="text-3xl font-bold text-center text-black">Technology Blog</h1>
        </div>

        {/* Display Blogs */}
        <div className="flex flex-col space-y-10 max-w-3xl mx-auto p-6 bg-primary">
        {renderBlogCards(technologyBlogs)}
        </div>

      </Container>
    </PrivateRoutes>
  );
}

