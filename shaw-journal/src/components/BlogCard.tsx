"use client";

import Image from "next/image";
import React, { useState } from "react";
import { getFormattedDateString } from "@/lib/utils";

import Link from "next/link";
import UpvoteBtn from "./interactions/UpvoteBtn";
import ThoughtBtn from "./interactions/ThoughtBtn";
import ProfileButton from "./ui/ProfileButton";

type props = {
  post: DBPost;
};

function BlogCard({ post }: props) {
  const [loading] = useState<boolean>(false);


  return !loading ? (
    <div className="border-b py-2 flex flex-col gap-2 h-50">
      {/* Top section */}
      <Link
        href={`/post/${post.slug}?postID=${post.id}`}
        className="flex basis-5/6 flex-col-reverse md:flex-row gap-4"
      >
        {/* Blog left content */}
        <div className="basis-3/4">
          {/* Meta section */}
          <div className="flex items-center gap-2 mb-1">
            <div>
              <ProfileButton sizing="w-6 h-6" />
            </div>
            <small className="font-semibold opacity-70">Matthew Carby</small>
          </div>
          {/* Blog title */}
          <h1 className="font-bold text-2xl line-clamp-2">{post?.title}</h1>
          {/* Snippet */}
          <div className="min-h-24 md:min-h-28 2xl:min-h-20 mb-4">
            <p className="font-light line-clamp-6 md:line-clamp-4 2xl:line-clamp-3">
              {post?.snippet}
            </p>
          </div>
          {/* Interactions */}
          <div className="flex space-x-4">
            {/* Upvotes */}
            <UpvoteBtn staleUpvoteCount={post?.upvoteCount??0} postId={post?.id} />
            {/* Thoughts */}
            <ThoughtBtn location={'home'} thoughtCount={post?.thoughtCount} />

            
            {/* Date published */}
            <div className="bg-slate-100/50 dark:bg-stone-900 p-2 rounded-full flex gap-2">
              <div className="flex space-x-1 items-center justify-center text-xs">
                <p>{getFormattedDateString(post?.datePublished as Date)}</p>
              </div>
            </div>
          </div>
        </div>
        {/* Blog right content */}
        <div className="basis-1/4 flex items-center md:justify-center">
          {post?.thumbnail !== "" && (
            <Image
              src={post?.thumbnail}
              alt="blog poster"
              width={200}
              height={200}
              className="h-40 w-40 object-cover rounded"
              quality={100}
              priority
            />
          )}
        </div>
      </Link>
    </div>
  ) : null;
}

export default BlogCard;
