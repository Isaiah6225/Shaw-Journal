import { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, doc, setDoc, deleteDoc, getDoc, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "../context/AuthContext"; 

export function useLikes(blogId) {
  const { uid } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    if (!blogId || !uid) return;
    const checkLikeStatus = async () => {
      try {
        const likeRef = doc(db, "likes", `${uid}_${blogId}`);
        const likeSnap = await getDoc(likeRef);
        setIsLiked(likeSnap.exists());

        // Get total like count
        const likesQuery = query(collection(db, "likes"), where("blogId", "==", blogId));
        const likesSnapshot = await getDocs(likesQuery);
        setLikesCount(likesSnapshot.size);
      } catch (error) {
        console.error("Error checking like status:", error);
      }
    };

    checkLikeStatus();
  }, [blogId, uid]);

  const toggleLike = async () => {
    if (!uid) {
      alert("You need to be logged in to like a post.");
      return;
    }

    const likeRef = doc(db, "likes", `${uid}_${blogId}`);

    try {
      if (isLiked) {
        await deleteDoc(likeRef);
        setIsLiked(false);
        setLikesCount((prev) => prev - 1);
      } else {
        await setDoc(likeRef, { userId: uid, blogId });
        setIsLiked(true);
        setLikesCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  return { isLiked, likesCount, toggleLike };
}

