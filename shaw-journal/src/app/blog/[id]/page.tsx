"use client";

import Container from "../../../components/ui/Container";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "../../../firebase";
import { doc, getDoc, updateDoc, arrayUnion, collection, addDoc, deleteDoc } from "firebase/firestore";
import { useLikes } from "../../../components/hooks/useLikes";
import { useAuth } from "../../../components/context/AuthContext";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useFetchComments } from "../../../components/hooks/useFetchComments";
import Image from "next/image";
import  useAOS  from "../../../components/hooks/useAOS";
import Popup from "../../../components/Popup";
import { usePopup } from "../../../components/hooks/usePopup";




export default function BlogPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState<any>(null);
  const [message, setMessage] = useState<string>("");
  const [newComment, setNewComment] = useState<string>("");
  const router = useRouter();
  const popup = usePopup();
const [editArticle, setEditArticle] = useState<string>("");
const [editTitle, setEditTitle] = useState<string>("");



  const [refreshComments, setRefreshComments] = useState(false);
  const { username, uid, loading: loadingUser, role } = useAuth(); 
  const { isLiked, likesCount, toggleLike } = useLikes(id);
  const { comments, loading: loadingComments } = useFetchComments(id as string, refreshComments);


 useAOS();

	interface Comment {
	  userName: string;
	  text: string;
	  timestamp: Date;
	};



  useEffect(() => {
    if(loadingUser) return;

    const blogId = typeof id === 'string' ? id : Array.isArray(id) ? id[0] : undefined;
    if (!blogId) {
      setMessage("Invalid blog ID.");
      return;
    }

    const fetchBlog = async () => {
      try {
        const docRef = doc(db, "blogs", blogId); 
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
                const blogData = docSnap.data();
		setBlog(blogData); 
		setEditTitle(blogData.title); 
		setEditArticle(blogData.article); 
        } else {
          setMessage("Blog not found.");
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
        setMessage("Error loading blog.");
      }
    };

    fetchBlog();
  }, [id, loadingUser]);

  const handleAddComment = async () => {
    const blogId = typeof id === 'string' ? id : Array.isArray(id) ? id[0] : undefined;
    if (!blogId || !newComment.trim()) return;

    try {
      const commentToAdd: Comment = {
        userName: "Unknown",
        text: newComment.trim(),
        timestamp: new Date(),
      };

      if (uid) {
          commentToAdd.userName = username || "Unknown User";
      } else {
	commentToAdd.userName = "Anonymous";
      }

      const blogRef = doc(db, "blogs", blogId); 
      const commentsRef = collection(blogRef, "comments");
      await addDoc(commentsRef, commentToAdd);

      setRefreshComments(true);

      setTimeout(() => {
        setRefreshComments(false);
      }, 1000);

      setNewComment("");



    } catch (error) {
      console.error("Error adding comment", error);
    }
  };

    //Handle submitting blogs
  const handleSubmitBlogs = async () => {
    const blogId = typeof id === 'string' ? id : Array.isArray(id) ? id[0] : undefined;
    if (!blogId) {
        setMessage("Invalid blog ID for approval.");
        return;
    }
    try {
      const approvedData = {
        status: "approved",
      };
      const blogRef = doc(db, "blogs", blogId);  
      await updateDoc(blogRef, approvedData);
      setMessage("Blog approved!");
      router.push("/home");
    } catch (error) {
      console.error("Error approving blog: ", error);
      setMessage("Error approving blog");
    }
  };
	
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const blogId = typeof id === 'string' ? id : Array.isArray(id) ? id[0] : undefined;
  if (!blogId) {
    setMessage("Invalid blog ID.");
    return;
  }

  try {
    const blogRef = doc(db, "blogs", blogId);
    await updateDoc(blogRef, {
      article: editArticle,
      title: editTitle,
      status: "pending",
    });
    popup.close(); 
    router.replace("/home"); 
  } catch (error) {
    console.log("Edit article failed: ", error);
  }
};


  
  //handle rejecting blogs
  const handleRejectBlogs = async () => {
    const blogId = typeof id === 'string' ? id : Array.isArray(id) ? id[0] : undefined;
     if (!blogId) {
        setMessage("Invalid blog ID for rejection.");
        return;
    }
    try {
      const rejectedData = {
        status: "rejected",
      };
      const blogRef = doc(db, "blogs", blogId); // Use validated blogId
      await updateDoc(blogRef, rejectedData);
      setMessage("Blog rejected!");
      router.push("/home");
    } catch (error) {
      console.error("Error rejecting blog: ", error);
      setMessage("Error rejecting blog");
    }
  };
//delete blogs 
const handleDelete = async () => {
    try {
      const blogId = typeof id === 'string' ? id : Array.isArray(id) ? id[0] : undefined;
if (!blogId) {
  setMessage("Invalid blog ID for deletion.");
  return;
}
const blogRef = doc(db, "blogs", blogId);

      await deleteDoc(blogRef);
      router.replace("/home");
    } catch (error) {
      console.log("Deleting blog went wrong: ", error);
    }
  };


//delete comments
const handleDeleteComment = async (commentId: string) => {
  const blogId = typeof id === 'string' ? id : Array.isArray(id) ? id[0] : undefined;
  if (!blogId || !commentId) return;

  try {
    const commentRef = doc(db, "blogs", blogId, "comments", commentId);
    await deleteDoc(commentRef);
    setRefreshComments(true);
    setTimeout(() => setRefreshComments(false), 1000);
  } catch (error) {
    console.error("Failed to delete comment:", error);
  }
};


  const totalComments = comments.length; 



  if (!blog) return <p className="text-center mt-10">{message || "Loading blog..."}</p>;

  return (
    
      <Container>
        
      {blog.imageUrl && (
    <div className="mx-auto relative w-[725px] h-[425px] mb-3 rounded-lg overflow-hidden shadow-md">
    <Image
      src={blog.imageUrl}
      alt="Blog cover"
      fill
      className="object-cover"
      sizes="(max-width: 768px) 100vw, 500px"
      priority 
    />
    </div>
    )}

        <div className="max-w-3xl mx-auto p-6">
          <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
          {/* Render Markdown content */}
          <div className="prose prose-lg max-w-none text-gray-700">
	  	<div className="flex flex-col space-y-6">
			<ReactMarkdown
			  remarkPlugins={[remarkGfm]}
			  components={{
			    a: ({ node, ...props }) => (
			      <a
				{...props}
				target="_blank"
				rel="noopener noreferrer"
				className="text-blue-600 underline"
			      />
			    ),
			    h1: ({ node, ...props }) => (
			      <h1 className="text-3xl font-bold text-primary" {...props} />
			    ),
			    h2: ({ node, ...props }) => (
			      <h2 className="text-2xl font-semibold text-primary" {...props} />
			    ),
			    h3: ({ node, ...props }) => (
			      <h3 className="text-xl font-bold text-primary" {...props} />
			    ),
			    h4: ({ node, ...props }) => (
			      <h4 className="text-lg font-bold text-primary" {...props} />
			    ),
			    h5: ({ node, ...props }) => (
			      <h5 className="text-md font-bold text-primary" {...props} />
			    ),
			    p: ({ node, ...props }) => (
			      <p className="text-gray-700 leading-relaxed" {...props} />
			    ),
			    ul: ({ node, ...props }) => (
			      <ul className="list-disc pl-5 text-gray-700" {...props} />
			    ),
			    ol: ({ node, ...props }) => (
			      <ol className="list-decimal pl-5 text-gray-700" {...props} />
			    ),
			    li: ({ node, ...props }) => (
			      <li className="text-gray-700" {...props} />
			    ),
			    blockquote: ({ node, ...props }) => (
			      <blockquote className="border-l-4 pl-4 text-gray-500 italic" {...props} />
			    ),
			    code: ({ node, ...props }) => (
			      <code className="bg-gray-200 p-1 rounded-md text-sm">{props.children}</code>
			    ),
			  }}
			>
			  {blog.article}
		</ReactMarkdown>

		</div>
		<div>
			By: {blog.name}
		</div>


          </div>

          {/* Like/Unlike & Comments */}
          <div className="flex justify-between mt-6 text-sm text-gray-500">
            <button
              onClick={toggleLike}
              className={`px-4 py-2 rounded-lg ${
                isLiked ? "bg-red-500 text-white cursor-pointer" : "bg-gray-200 text-black cursor-pointer"
              }`}
            >
              {isLiked ? "❤️ Liked" : "🤍 Like"} {likesCount}
            </button>
            <span>💬 {loadingComments ? "Loading comments..." : ` (${comments.length})`} Comments</span>
          </div>

          {/* Comment Section */}
	<div className="mt-6">
	  <h2 className="text-xl font-semibold">
	   Comments 
	  </h2>
	  <ul className="mt-4 space-y-4">
		{comments.length > 0 ? (
		  comments.map((comment: any, index: number) => (
		    <li key={comment.id} className="relative bg-gray-100 p-3 rounded-md border border-gray-200">
		      <p className="font-semibold text-gray-800">{comment.userName}</p>
		      <p className="text-gray-600">{comment.text}</p>

		      {role === "Editor" && (
			<button
			  onClick={() => handleDeleteComment(comment.id)}
			  className="absolute top-2 right-2 text-red-500 hover:text-red-700 cursor-pointer"
			>
			  Delete 🗑️
			</button>
		      )}
		    </li>
		  ))
		) : (
		  <p className="text-gray-500">No comments yet.</p>
		)}

	  </ul>

	  {/* Add Comment Input */}
	  {blog.status === "approved" && (
	    <div className="mt-6 flex gap-2">
	      <input
		type="text"
		placeholder="Add a comment..."
		value={newComment}
		onChange={(e) => setNewComment(e.target.value)}
		className="flex-grow p-2 border rounded-md"
	      />
	      <button
		onClick={handleAddComment}
		className="bg-green-500 text-white px-4 py-2 rounded-lg cursor-pointer"
	      >
		Add Comment
	      </button>
	    </div>
	  )}
	</div>

	 {/* Editor Actions*/}
	 {(role ==="Editor" && blog.status !== "pending" && blog.status !== "rejected") && (
	    <div className="flex justify-between mt-6 text-sm">
            <button
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-200"
              onClick={handleDelete}
            >
              Delete Blog
            </button>
          </div>
	 )}

			
	  {/* Editor Actions*/}
          {(role === "Editor" && blog.status !== "approved") && (
            <div className="flex justify-between mt-6 text-sm">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-lg cursor-pointer"
                onClick={handleSubmitBlogs}
              >
                Approve Blog
              </button>

              <button 
	      	className="bg-red-500 text-white px-4 py-2 rounded-lg cursor-pointer"
		onClick={handleRejectBlogs}
		>
                Reject Blog
              </button>

	      <button
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-200"
              onClick={handleDelete}
            >
              Delete Blog
            </button>

            </div>
          )}

	  {/* Author Actions */}
	  {(role === "Author" && blog.status !== "approved") && (
	  	<div className="flex justify-between mt-6 text-sm">
			<button
			className="bg-green-500 text-white px-4 py-2 rounded-lg cursor-pointer"
			onClick={popup.open}
		      >
				Edit Blogs	
		      </button>
			<Popup isOpen={popup.isOpen} close={popup.close}>
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
			</Popup>

		</div>
	   )}
        </div>
      </Container>
  );
}

