import { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, doc, addDoc} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

export function useEditBlogs(blogId) {
	const { user } = useAuth(); 
	const [message, setMessage] = useState("");
	const [loading, setLoading] = useState(false);
		
	useEffect (() => {
		if (!blogId || !user) return; 

		const assignPosts = async () => {
			try { 
				await addDoc(collection(db, "editBlogs"),{
					userId,
					blogId
				});
			}
		}
	
	};
}
