"use client";

import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import Link from "next/link";
import Container from "../../components/ui/Container";
import PrivateRoutes from "../../components/PrivateRoutes";
import BlogCardLargeHome from "../../components/BlogCardLargeHome";
import { useFetchBlogs } from "../../components/hooks/useFetchBlogs";
import AOS from 'aos';
import 'aos/dist/aos.css';

AOS.init();

export default function EditorPage() {
  const { blogs: pendingBlogs, loading, error } = useFetchBlogs({status: "pending"});

  const { blogs: rejectedBlogs } = useFetchBlogs({status: "rejected"}); 

  


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


  return (
    <PrivateRoutes>
      <Container>
	{loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}


        {/* Display Blogs */}
	<div className="grid grid-cols-1 lg:grid-cols-3 gap-12 my-12">
          {/* LEFT: Pending blogs*/}
          <div className="space-y-6" data-aos="fade-right" data-aos-duration="1200">
            <h1 className="font-semibold text-xl text-center">Pending Blogs</h1>
            {renderBlogCards(pendingBlogs)}
          </div>

          {/* RIGHT: Rejected blogs*/}
          <div className="space-y-6" data-aos="fade-left" data-aos-duration="1200">
	    <h1 className="font-semibold text-xl">Rejected Blogs</h1>

            {renderBlogCards(rejectedBlogs)}
          </div>
        </div>
      </Container>
    </PrivateRoutes>
  );
}
