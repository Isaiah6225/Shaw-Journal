import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  console.log("Token in middleware:", token);

  if (!token) {
    return NextResponse.redirect(new URL("/", req.url)); // Redirect to login
  }

  return NextResponse.next();
}


export const config = {
  matcher: [
    "/create-blog",
    "/home",
    "/edit-posts",
    "/entertainment",
    "/general",
    "/tech",
    "/editor-panel",
    "/blog/:path*",       
    "/sports",
    "/liked-posts",
    "/food",
    "/markdown-guide"
  ],
};





