
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./context/AuthContext";

export default function PrivateRoutes({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: string[];
}) {
/**
  const { user } = useAuth();
  const role = user?.role;
  const router = useRouter();

  useEffect(() => {
    if (user === null) {
      console.log("Current user: ", user);
      router.replace("/");
      return;
    }

    if (allowedRoles && (!role || !allowedRoles.includes(role))) {
      console.log("Current user role: ", role); 
      router.replace("/unauthorized");
    }
  }, [user, role, router, allowedRoles]);

  if (user === null || (allowedRoles && (!role || !allowedRoles.includes(role)))) {
    return <p>Loading...</p>;
  }

  return <>{children}</>;
  **/
}


