"use client";

import { useFetchBlogs } from "../../components/hooks/useFetchBlogs";
import Container from "../../components/ui/Container";
import PrivateRoutes from "../../components/PrivateRoutes";
import BlogCard from "../../components/BlogCard";

export default function HomePage() {
  // Fetch newest blogs from Firestore
  const { blogs: generalBlogs } = useFetchBlogs({ category: "General", status: "approved", limitCount: 1 });
  const { blogs: technologyBlogs } = useFetchBlogs({ category: "Tech", status: "approved", limitCount: 1 });
  const { blogs: foodBlogs } = useFetchBlogs({ category: "Food", status: "approved", limitCount: 1 });
  const { blogs: entertainmentBlogs, loading, error } = useFetchBlogs({ category: "Entertainment", status: "approved", limitCount: 1 });
  const { blogs: sportsBlogs } = useFetchBlogs({ category: "Sports", status: "approved", limitCount: 1 });

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
      />
    ));

  return (
    <PrivateRoutes>
      <Container>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 my-12">
          {/* LEFT: General + Tech */}
          <div className="space-y-6">
            {renderBlogCards(generalBlogs)}
            {renderBlogCards(technologyBlogs)}
          </div>

          {/* MIDDLE: Food */}
          <div className="space-y-6">
            {renderBlogCards(foodBlogs)}
          </div>

          {/* RIGHT: Entertainment + Sports */}
          <div className="space-y-6">
            {renderBlogCards(entertainmentBlogs)}
            {renderBlogCards(sportsBlogs)}
          </div>
        </div>
      </Container>
    </PrivateRoutes>
  );
}

