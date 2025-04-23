"use client";

import { useEffect } from "react";
import { db } from "../../firebase";
import { useFetchBlogs } from "../../components/hooks/useFetchBlogs";
import Container from "../../components/ui/Container";
import BlogCardLargeHome from "../../components/BlogCardLargeHome";
import  useAOS  from "../../components/hooks/useAOS";
import Loading from "../../components/ui/LoadingBackground";
import { useAuth } from "../../components/context/AuthContext"; 
import { useRouter } from "next/navigation";

export default function EditorPage() {
  const { blogs: pendingBlogs, loading, error } = useFetchBlogs({ status: "pending" });
  const { blogs: rejectedBlogs } = useFetchBlogs({ status: "rejected" });
  const {role, loading: userLoading } = useAuth();
  const router = useRouter();

  useAOS();

  useEffect(() => {
    if (!userLoading && role && role !== "Editor") {
      router.push("/unauthorized");
    }
  }, [role, router, userLoading]); // Run this effect whenever the role changes

  // Show nothing if role is known and not authorized
  if (!userLoading && role && role !== "Editor") {
    return null;
  }

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
      <Container>
        {(userLoading || !role) && <Loading />} 
	
        {error && <p className="text-red-500">{error}</p>}

	<div className="flex flex-col md:flex-row gap-10 md:gap-16 px-4 md:px-8 py-8">
	  {/* Left Sidebar - Cards */}
	  <div className="md:w-1/3 lg:w-1/4 flex flex-col gap-8">
	    {/* Tips Card */}
		<div className="border border-gray-300 bg-[#FAF9F6] shadow-md rounded-xl p-5 hover:shadow-xl transition">
		  <h2 className="text-lg font-semibold mb-2">Tips for Editing</h2>
		  <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
<li>Engage with audience: For a successful blog ensure author&apos;s start with an interesting hook and keep readers hooked with compelling content.</li>
<li>Be mindful of tone: Ensure the author&apos;s writing in a tone appropriate for your target audience (formal, casual, etc.).</li>

		    <li>Use proper formatting: Break up long blocks of text with headings, lists, and short paragraphs.</li>
		    <li>Proofread before posting: Check for spelling, grammar, and punctuation errors, and ensure the article flows well.</li>
		    <li>Stay on topic: Ensure each paragraph contributes to the main message of the article.</li>
		    <li>Use visuals: Ensure that the images uploaded are related to the content of th article</li>
		    <li>Provide sources and references: If the author is using data or quotes, ensure they properly credit the sources.</li>
		    <li>Be mindful of tone: Ensure the author writes in a tone appropriate for your target audience (formal, casual, etc.).</li>
		  </ul>
		</div>
	  </div>

	  {/* Right Main Content - Side-by-side blog grids */}
	  <div className="md:w-2/3 lg:w-3/4 flex flex-col gap-12">
	    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
	      {/* Pending Blogs */}
	      <div className="space-y-6" data-aos="fade-right" data-aos-duration="1200">
		    <h2 className="text-xl font-semibold uppercase tracking-wide border-b pb-2">
		     	Pending Blogs 
		    </h2>
		{renderBlogCards(pendingBlogs)}
	      </div>

	      {/* Rejected Blogs */}
	      <div className="space-y-6" data-aos="fade-left" data-aos-duration="1200">
		    <h2 className="text-xl font-semibold uppercase tracking-wide border-b pb-2">
		     	Rejected Blogs 
		    </h2>
		{renderBlogCards(rejectedBlogs)}
	      </div>
	    </div>
	  </div>
	</div>

      </Container>
  );
}

