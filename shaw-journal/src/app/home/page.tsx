"use client";

import { useFetchBlogs } from "../../components/hooks/useFetchBlogs";
import Container from "../../components/ui/Container";
import PrivateRoutes from "../../components/PrivateRoutes";
import BlogCardLargeHome from "../../components/BlogCardLargeHome";
import BlogCardHome from "../../components/BlogCardHome";
import AOS from 'aos';
import 'aos/dist/aos.css';

AOS.init();

export default function HomePage() {
  // Fetch newest blogs from Firestore
  const { blogs: generalBlogs, loading: loadingGeneral} = useFetchBlogs({ category: "General", status: "approved", limitCount: 1 });
  const { blogs: technologyBlogs ,loading: loadingTechnology} = useFetchBlogs({ category: "Tech", status: "approved", limitCount: 1 });
  const { blogs: foodBlogs , loading: loadingFood} = useFetchBlogs({ category: "Food", status: "approved", limitCount: 1 });
  const { blogs: entertainmentBlogs, loading: loadingEntertainment, error } = useFetchBlogs({ category: "Entertainment", status: "approved", limitCount: 1 });
  const { blogs: sportsBlogs, loading: loadingSports} = useFetchBlogs({ category: "Sports", status: "approved", limitCount: 1 });

  //Multiple blogs
  const { blogs: multipleGeneral, loading: loadingMultipleGeneral} = useFetchBlogs({ category: "General", status: "approved", limitCount: 3 });
  const { blogs: multipleTechnology, loading: loadingMultipleTechnology } = useFetchBlogs({ category: "Tech", status: "approved", limitCount: 3 });
  const { blogs: multipleFood ,loading: loadingMultipleFood} = useFetchBlogs({ category: "Food", status: "approved", limitCount: 3 });
  const { blogs: multipleEntertainment, loading: loadingMultipleEntertainment} = useFetchBlogs({ category: "Entertainment", status: "approved", limitCount: 3 });
  const { blogs: multipleSports, loading: loadingMultipleSports} = useFetchBlogs({ category: "Sports", status: "approved", limitCount: 3 });

  const isLoading = loadingGeneral || loadingTechnology || loadingFood || loadingEntertainment || loadingSports || loadingMultipleGeneral || loadingMultipleTechnology || loadingMultipleFood || loadingMultipleEntertainment || loadingMultipleSports;


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

   const renderSmallBlogCards = (blogs) => 
   	blogs.map((blog) => (
		<BlogCardHome
			key={blog.id}
			id={blog.id}
			title={blog.title}
			article={blog.article}
			author={blog.name}
			createdAt={blog.createdAt}
			imageUrl={blog.imageUrl}
		/>
	));

  return (
    <PrivateRoutes>
      <Container>
      {isLoading ? (
        <div className="text-center my-20 text-xl font-semibold">Loading blogs...</div>
	) : ( 
	  <>
        {error && <p className="text-red-500">{error}</p>}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 my-12" >
          {/* LEFT: General + Tech */}
          <div className="space-y-6" data-aos="fade-up" data-aos-duration="1000">
            {renderBlogCards(generalBlogs)}
            {renderBlogCards(technologyBlogs)}
          </div>

          {/* MIDDLE: Food */}
          <div className="space-y-6"data-aos="fade-down" data-aos-duration="1000">
            {renderBlogCards(foodBlogs)}
          </div>

          {/* RIGHT: Entertainment + Sports */}
          <div className="space-y-6" data-aos="fade-up" data-aos-duration="1000">
            {renderBlogCards(entertainmentBlogs)}
            {renderBlogCards(sportsBlogs)}
          </div>
        </div>

        {/* Latest blogs sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 my-12">
          {/* General */}
	  <div className="space-y-6" data-aos="fade-right" data-aos-duration="1000">
          <div className="space-y-6 border-2 p-6 rounded-lg border-gray-400">
            <h1 className="font-bold text-2xl text-center mb-4">General</h1>
            {renderBlogCards(generalBlogs)}
            <h2 className="text-lg font-semibold text-center mt-6">Latest General Blogs</h2>
            <div className="flex flex-col space-y-4">
              {renderSmallBlogCards(multipleGeneral)}
            </div>
          </div>

          {/* Technology */}
          <div className="space-y-6 border-2 p-6 rounded-lg border-gray-400" data-aos="fade-right" data-aos-duration="1000">
            <h1 className="font-bold text-2xl text-center mb-4">Technology</h1>
            {renderBlogCards(technologyBlogs)}
            <h2 className="text-lg font-semibold text-center mt-6">Latest Tech Blogs</h2>
            <div className="flex flex-col space-y-4">
              {renderSmallBlogCards(multipleTechnology)}
            </div>
          </div>
	  </div>
	  
          {/* Food */}
	  <div className="space-y-6" data-aos="fade-down" data-aos-duration="1200">
          <div className="space-y-6 border-2 p-6 rounded-lg border-gray-400">
            <h1 className="font-bold text-2xl text-center mb-4">Food</h1>
            {renderBlogCards(foodBlogs)}
            <h2 className="text-lg font-semibold text-center mt-6">Latest Food Blogs</h2>
            <div className="flex flex-col space-y-4">
              {renderSmallBlogCards(multipleFood)}
            </div>
          </div>
	  </div>

          {/* Entertainment */}
	  <div className="space-y-6" data-aos="fade-left" data-aos-duration="1000">
          <div className="space-y-6 border-2 p-6 rounded-lg border-gray-400">
            <h1 className="font-bold text-2xl text-center mb-4">Entertainment</h1>
            {renderBlogCards(entertainmentBlogs)}
            <h2 className="text-lg font-semibold text-center mt-6">Latest Entertainment Blogs</h2>
            <div className="flex flex-col space-y-4">
              {renderSmallBlogCards(multipleEntertainment)}
            </div>
          </div>

          {/* Sports */}
          <div className="space-y-6 border-2 p-6 rounded-lg border-gray-400" data-aos="fade-left" data-aos-duration="1000">
            <h1 className="font-bold text-2xl text-center mb-4">Sports</h1>
            {renderBlogCards(sportsBlogs)}
            <h2 className="text-lg font-semibold text-center mt-6">Latest Sports Blogs</h2>
            <div className="flex flex-col space-y-4">
              {renderSmallBlogCards(multipleSports)}
            </div>
          </div>
	  </div>
        </div>
	</>
	)}
      </Container>
    </PrivateRoutes>
  );
}

