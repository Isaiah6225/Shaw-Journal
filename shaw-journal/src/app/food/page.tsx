"use client";

import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import Link from "next/link";
import Container from "../../components/ui/Container";
import BlogCardHome from "../../components/BlogCardHome";
import { useFetchBlogs } from "../../components/hooks/useFetchBlogs";
import  useAOS  from "../../components/hooks/useAOS";
import { useAuth } from "../../components/context/AuthContext"; 
import Loading from "../../components/ui/Loading";

export default function FoodPage() {
  const { blogs: foodBlogs, loading: loadingFood, error } = useFetchBlogs({category: "Food", status:"approved"}); 
  const { role, loading: userLoading } = useAuth();

  
  useAOS();

  
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
      <Container>

        {error && <p className="text-red-500">{error}</p>}

        <div className="sticky top-0 z-10 bg-primary py-2">
        	<h1 className="text-3xl font-bold text-center text-black">Food Blog</h1>
        </div>

	{(userLoading || !role || loadingFood) ? (
      	<Loading />
	) : (
	<>
        {/* Display Blogs */}
        <div className="flex flex-col space-y-4" data-aos="fade-up" data-aos-duration="1200">
        {renderBlogCards(foodBlogs)}
        </div>
	</>
	)}
      </Container>
  );
}
