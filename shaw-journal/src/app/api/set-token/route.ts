import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { token } = await request.json();
  
  // Set HttpOnly cookie
  const response = NextResponse.json({ message: 'Token set in cookie' });
  
  console.log("Received token(console log in set-token): ", token); 

  // Set the cookie in the response headers
  response.cookies.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Only secure cookies in production
    sameSite: 'strict',
    path: '/',
  });

  return response;
}

