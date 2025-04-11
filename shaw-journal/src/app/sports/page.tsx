"use client";

import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import Link from "next/link";
import Container from "../../components/ui/Container";
import PrivateRoutes from "../../components/PrivateRoutes";
import BlogCardHome from "../../components/BlogCardHome";
import { useFetchBlogs } from "../../components/hooks/useFetchBlogs";
import   useAOS  from "../../components/hooks/useAOS";

export default function EntertainmentPage() {
  const { blogs: sportsBlogs, loading: loadingSports, error } = useFetchBlogs({category: "Sports", status:"approved"}); 

  useAOS();

  
  const isLoading = loadingSports;
  
  const renderBlogCards = (blogs) =>
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

  return (
    <PrivateRoutes>
      <Container>
      {isLoading ? (
      	<div className="text-center my-20 text-xl font-semibold">Loading blogs...</div>
	) : (
	<>
        {error && <p className="text-red-500">{error}</p>}

        <div className="sticky top-0 z-10 bg-primary py-2">
        <h1 className="text-3xl font-bold text-center text-black">Sports Blogs</h1>
        </div>

        {/* Display Blogs */}
        <div className="flex flex-col space-y-4" data-aos="fade-up" data-aos-duration="1200">
        {renderBlogCards(sportsBlogs)}
        </div>
	</>
	)}
      </Container>
    </PrivateRoutes>
  );
}

