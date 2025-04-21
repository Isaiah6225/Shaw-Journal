
import { useEffect, useState } from "react";

export const useAuth = () => {
  const [user, setUser] = useState({
    role: null,
    uid: null,
    username: null,
    loading: true,
  });

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/verify-token", {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();

      setUser({
        role: data.role,
        uid: data.uid,
        username: data.username,
        loading: false,
      });
    };

    fetchUser();
  }, []);

  return user;
};


