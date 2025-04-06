"use client";

import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import Link from "next/link";
import Container from "../../components/ui/Container";
import PrivateRoutes from "../../components/PrivateRoutes";
import BlogCard from "../../components/BlogCard";
import { useFetchBlogs } from "../../components/hooks/useFetchBlogs";

export default function EditorPage() {
  const { blogs:allBlogs, loading, error } = useFetchBlogs({status: "pending"});   


  return (
    <PrivateRoutes>
      <Container>
	{loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}


        {/* Display Blogs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
	{allBlogs.map((blog) => (
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
          ))}
        </div>

      </Container>
    </PrivateRoutes>
  );
}
