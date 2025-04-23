import { useState } from "react";
import { db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function EditBlogForm({ blog, close }) {
  const router = useRouter();
  const [editTitle, setEditTitle] = useState(blog.title);
  const [editArticle, setEditArticle] = useState(blog.article);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const blogRef = doc(db, "blogs", blog.id);
      await updateDoc(blogRef, {
        title: editTitle,
        article: editArticle,
        status: "pending",
      });
      close();
      router.replace("/home"); // trigger refresh
    } catch (error) {
      console.error("Error updating blog:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4">
      <h1 className="text-xl font-bold">Edit Blog</h1>

      <label className="text-md font-semibold">Title</label>
      <textarea
        value={editTitle}
        onChange={(e) => setEditTitle(e.target.value)}
        className="p-2 border rounded h-10"
      />

      <label className="text-md font-semibold">Article</label>
      <textarea
        value={editArticle}
        onChange={(e) => setEditArticle(e.target.value)}
        className="p-2 border rounded h-40"
      />

      <button
        type="submit"
        disabled={!editArticle.trim()}
        className="bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white px-4 py-2 rounded-lg transition duration-200"
      >
        Submit
      </button>
    </form>
  );
}

