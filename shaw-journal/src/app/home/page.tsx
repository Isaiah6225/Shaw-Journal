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
  const { blogs: multipleGeneral } = useFetchBlogs({ category: "General", status: "approved", limitCount: 3 });
  const { blogs: multipleTechnology } = useFetchBlogs({ category: "General", status: "approved", limitCount: 3 });
  const { blogs: multipleFood } = useFetchBlogs({ category: "General", status: "approved", limitCount: 3 });
  const { blogs: multipleEntertainment } = useFetchBlogs({ category: "General", status: "approved", limitCount: 3 });
  const { blogs: multipleSports } = useFetchBlogs({ category: "General", status: "approved", limitCount: 3 });

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

	{/* */}
	<div className="grid grid-cols-1 lg:grid-cols-3 gap-12 my-12">
			
    <div className="space-y-6">
      <div>
      
    <h1 className="font-bold text-xl text-center">General</h1>
      {renderBlogCards(generalBlogs)}

      <h2 className="text-xl font-semibold">Multiple General</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {renderBlogCards(multipleGeneral)}
      </div>
      <div></div>
      <h1 className="font-bold text-xl text-center">General</h1>
      {renderBlogCards(generalBlogs)}
      </div>
    </div>
	</div>
      </Container>
    </PrivateRoutes>
  );
}

