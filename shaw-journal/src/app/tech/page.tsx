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



export default function EntertainmentPage() {
  const { blogs: techBlogs, loading: loadingTech, error } = useFetchBlogs({category: "Tech", status:"approved"}); 
  const { role, loading: userLoading } =useAuth();

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

	<div className="space-y-6">
	    <h1 className="text-xl font-semibold uppercase tracking-wide border-b pb-2 text-center">
		     Technology 👨🏻‍💻 
	    </h1>

        
	{(userLoading || !role || loadingTech) ? (
      	<Loading />
	) : (
	<>
        {/* Display Blogs */}
        <div className="flex flex-col space-y-4" data-aos="fade-up" data-aos-duration="1200">
        {renderBlogCards(techBlogs)}
        </div>
	</>
	)}
	</div>
      </Container>
  );
}
