import { NextResponse } from "next/server";
import admin from "firebase-admin";

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

export async function POST(request: Request) {
  const { uid, role, username } = await request.json();

  try {
    await admin.auth().setCustomUserClaims(uid, { role, username });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error setting custom claims:", error);
    return NextResponse.json({ error: "Failed to set claims" }, { status: 500 });
  }
}

