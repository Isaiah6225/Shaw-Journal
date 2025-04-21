import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import admin from 'firebase-admin';

if (!admin.apps.length) {
	const privateKey = Buffer.from(
	  process.env.FIREBASE_PRIVATE_KEY_BASE64!,
	  'base64'
	).toString('utf8');
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
  });
}

export async function POST() {
  const cookieStore = await cookies(); 
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Token not found' }, { status: 401 });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);

    return NextResponse.json({ 
      role: decodedToken.role, 
      uid: decodedToken.uid,
      username: decodedToken.username || null,
    });

  } catch (err) {
    console.error('Error verifying token:', err);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
