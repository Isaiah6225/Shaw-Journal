"use client";

import { useEffect } from "react";
import { useFetchBlogs } from "../../components/hooks/useFetchBlogs";
import Container from "../../components/ui/Container";
import BlogCardLargeHome from "../../components/BlogCardLargeHome";
import BlogCardSmallHome from "../../components/BlogCardSmallHome";
import BlogCardMainHome from "../../components/BlogCardMainHome";
import BlogCardSubHome from "../../components/BlogCardSubHome";
import BlogCardHome from "../../components/BlogCardHome";
import  useAOS  from "../../components/hooks/useAOS";
import { useAuth } from "../../components/context/AuthContext";
import Loading from "../../components/ui/Loading";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";





export default function HomePage() {
  const { role, loading: userLoading } = useAuth();
 

  // Fetch newest blogs from Firestore
  const { blogs: generalBlogs, loading: loadingGeneral} = useFetchBlogs({ category: "General", status: "approved", limitCount: 1 });
  const { blogs: technologyBlogs ,loading: loadingTechnology} = useFetchBlogs({ category: "Tech", status: "approved", limitCount: 1 });
  const { blogs: foodBlogs , loading: loadingFood} = useFetchBlogs({ category: "Food", status: "approved", limitCount: 1 });
  const { blogs: entertainmentBlogs, loading: loadingEntertainment, error } = useFetchBlogs({ category: "Entertainment", status: "approved", limitCount: 1 });
  const { blogs: sportsBlogs, loading: loadingSports} = useFetchBlogs({ category: "Sports", status: "approved", limitCount: 1 });

  //Multiple blogs
  const { blogs: multipleGeneral, loading: loadingMultipleGeneral} = useFetchBlogs({ category: "General", status: "approved", limitCount: 3, skipFirst: true});
  const { blogs: multipleTech, loading: loadingMultipleTechnology } = useFetchBlogs({ category: "Tech", status: "approved", limitCount: 3 , skipFirst: true});
  const { blogs: multipleFood ,loading: loadingMultipleFood} = useFetchBlogs({ category: "Food", status: "approved", limitCount: 3 , skipFirst: true});
  const { blogs: multipleEntertainment, loading: loadingMultipleEntertainment} = useFetchBlogs({ category: "Entertainment", status: "approved", limitCount: 3 , skipFirst: true});
  const { blogs: multipleSports, loading: loadingMultipleSports} = useFetchBlogs({ category: "Sports", status: "approved", limitCount: 3 , skipFirst: true});

  useAOS();


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
			status={blog.status}
		/>
	));

  
   const renderMainBlogCards = (blogs) => 
   	blogs.map((blog) => (
		<BlogCardSmallHome
			key={blog.id}
			id={blog.id}
			title={blog.title}
			article={blog.article}
			author={blog.name}
			category={blog.category}
			createdAt={blog.createdAt}
			imageUrl={blog.imageUrl}
			status={blog.status}
		/>
	));


     const renderSubBlogCards = (blogs) => 
   	blogs.map((blog) => (
		<BlogCardSubHome
			key={blog.id}
			id={blog.id}
			title={blog.title}
			article={blog.article}
			author={blog.name}
			createdAt={blog.createdAt}
			imageUrl={blog.imageUrl}
			status={blog.status}
			category={blog.category}
		/>
	));

  return (
      <Container>

        {error && <p className="text-red-500">{error}</p>}

	{(userLoading || !role || isLoading) ? (
      	<Loading />
	) : ( 
	  <>

		<div className="flex flex-col gap-12 my-12">
		<div 
			className="w-full min-h-[75vh] bg-gray-100 text-black flex flex-col justify-center items-center text-center px-4 py-10 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"  data-aos="fade-up" 
			data-aos-duration="1000">
		  <h1 className="text-6xl md:text-7xl font-bold mb-6">Welcome to Shaw News</h1>
		  <p className="text-2xl md:text-3xl mb-10">
		    Insights, stories, and updates from our student community
		  </p>

		  {/* Carousel */}
		  <div className="w-full max-w-6xl px-4">
		    <Swiper
		      modules={[Autoplay]}
		      autoplay={{ delay: 4000 }}
		      loop={true}
		      slidesPerView={1} // Show one "group" of cards
		      onSlideChangeTransitionStart={(swiper) => {
			swiper.slides.forEach((slide) => {
			  slide.classList.remove("fade-in");
			});
		      }}
		      onSlideChangeTransitionEnd={(swiper) => {
			swiper.slides[swiper.activeIndex].classList.add("fade-in");
		      }}
		    >
		      {[
			...renderSubBlogCards(generalBlogs),
			...renderSubBlogCards(technologyBlogs),
			...renderSubBlogCards(foodBlogs),
			...renderSubBlogCards(entertainmentBlogs),
			...renderSubBlogCards(sportsBlogs),
		      ]
			.reduce((acc, curr, index) => {
			  const chunkIndex = Math.floor(index / 3);
			  if (!acc[chunkIndex]) acc[chunkIndex] = [];
			  acc[chunkIndex].push(curr);
			  return acc;
			}, [])
			.map((group, index) => (
			  <SwiperSlide key={index}>
			    <div className="flex justify-center gap-6 opacity-0 transition-opacity duration-700 fade-in">
			      {group.map((card, i) => (
				<div key={i} className="w-full max-w-sm">
				  {card}
				</div>
			      ))}
			    </div>
			  </SwiperSlide>
			))}
		    </Swiper>
		  </div>
		</div>


		  {/*Recent blogs section */}
		   
		<div className="flex flex-col items-center px-4 py-8" data-aos="fade-up" data-aos-duration="1000">
		      <h1 className="text-3xl font-bold mb-8">Recent Blogs</h1>

		      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
			{/* Left side: renderBlogs */}
			<div className="md:col-span-2">
			  {renderBlogCards(generalBlogs)}
			</div>

			{/* Right side: stacked small blog cards */}
			<div className="flex flex-col space-y-4">
			  {renderSmallBlogCards(technologyBlogs)}
			  {renderSmallBlogCards(sportsBlogs)}
			  {renderSmallBlogCards(entertainmentBlogs)}
			  {renderSmallBlogCards(foodBlogs)}
			</div>
		      </div>
		    </div>



		{/* More Top Stories Section */}
		<hr className="border-t border-gray-300 my-12" />

		<h2 className="text-xl font-semibold uppercase tracking-wide border-b pb-2">
		  More Top Stories
		</h2>

		<div
		  className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6"
		  data-aos="fade-up"
		  data-aos-duration="1000"
		>
		  {/* Left Column: General & Tech */}
		  <div className="space-y-6">
		    <h2 className="text-xl font-semibold uppercase tracking-wide border-b pb-2">
		      General
		    </h2>
		    {renderSmallBlogCards(multipleGeneral)}

		    <div className="space-y-6">
		      <h2 className="text-xl font-semibold uppercase tracking-wide border-b pb-2">
			Tech
		      </h2>
		      {renderSmallBlogCards(multipleTech)}
		    </div>
		  </div>

		  {/* Right Column: Entertainment & Sports */}
		  <div className="space-y-6">
		    <h2 className="text-xl font-semibold uppercase tracking-wide border-b pb-2">
		      Entertainment
		    </h2>
		    {renderSmallBlogCards(multipleEntertainment)}

		    <div className="space-y-6">
		      <h2 className="text-xl font-semibold uppercase tracking-wide border-b pb-2">
			Sports
		      </h2>
		      {renderSmallBlogCards(multipleSports)}
		    </div>
		  </div>
		</div>

		{/* Centered Food Section Below */}
		<div className="mt-12 flex justify-center" data-aos="fade-up" data-aos-duration="1000">
		  <div className="space-y-6 w-full max-w-xl">
		    <h2 className="text-xl text-center font-semibold uppercase tracking-wide border-b pb-2">
		      Food
		    </h2>
		    {renderSmallBlogCards(multipleFood)}
		  </div>
		</div>

		</div>



        	</>
	)}
      </Container>
  );
}

