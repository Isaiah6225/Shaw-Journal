import Link from "next/link";
import { useLikes } from "./hooks/useLikes";

export default function BlogCard({ id, title, article, author, upvotes, createdAt, comments }) {
  const { isLiked, likesCount, toggleLike } = useLikes(id);

  // Convert Firestore Timestamp to JavaScript Date
  const formattedDate = createdAt?.seconds
    ? new Date(createdAt.seconds * 1000).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Unknown Date";

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 hover:shadow-xl transition">
      <Link href={`/blog/${id}`} className="block">
        <h2 className="text-gray-800 text-xl font-semibold mt-2">{title}</h2>
        <p className="text-gray-600 mt-2 line-clamp-2">{article}</p>
      </Link>

      {/* Blog Metadata */}
      <div className="mt-4 flex justify-between text-sm text-gray-500">
        <p>By <span className="font-semibold">{author}</span></p>
        <p>{formattedDate}</p> {/* Display formatted date */}
      </div>

      {/* Likes & Comments */}
      <div className="mt-3 flex justify-between items-center text-gray-600">
        <button onClick={toggleLike} className="flex items-center space-x-2">
          <span className={isLiked ? "text-red-500" : "text-gray-500"}>❤️</span>
          <span>{likesCount} Likes</span>
        </button>
        <p>💬 {comments?.length || 0} Comments</p>
      </div>
    </div>
  );
}

