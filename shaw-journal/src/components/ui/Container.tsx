import React from "react";
import Link from "next/link";

export default function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-3xl lg:max-w-[70%] mx-auto p-6">
      <div className="flex justify-center mb-6">
        <Link href="/home" className="text-3xl font-bold text-center">Shaw News</Link>
      </div>

      {children}
    </div>
  );
}


