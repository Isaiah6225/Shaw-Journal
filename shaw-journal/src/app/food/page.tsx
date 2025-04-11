"use client";

import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import Link from "next/link";
import Container from "../../components/ui/Container";
import PrivateRoutes from "../../components/PrivateRoutes";
import BlogCardHome from "../../components/BlogCardHome";
import { useFetchBlogs } from "../../components/hooks/useFetchBlogs";
import AOS from 'aos';
import 'aos/dist/aos.css';

AOS.init();

export default function FoodPage() {
  const { blogs: foodBlogs, loading: loadingFood, error } = useFetchBlogs({category: "Food", status:"approved"});  

  const isLoading = loadingFood;
  
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
        <h1 className="text-3xl font-bold text-center text-black">Food Blog</h1>
        </div>

        {/* Display Blogs */}
        <div className="flex flex-col space-y-4" data-aos="fade-up" data-aos-duration="1200">
        {renderBlogCards(foodBlogs)}
        </div>
	</>
	)}
      </Container>
    </PrivateRoutes>
  );
}
