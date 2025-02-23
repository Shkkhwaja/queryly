import { NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { message } from "antd";

const client = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

export async function POST(req: Request) {
  try {
    const { credential } = await req.json();

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) return NextResponse.json({ error: "Invalid Google token" }, { status: 400 });

    const user = {
      name: payload.name,
      email: payload.email,
      picture: payload.picture,
      googleId: payload.sub,
    };

    // Generate JWT for session
    const token = jwt.sign(user, process.env.JWT_SECRET!, { expiresIn: "7d" });


    const response =  NextResponse.json({ success: true, message:"Login successful with Google" });


    response.cookies.set("token", token, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 7 * 60 * 60,
      });

return response;
    
  } catch (error) {
    console.error("Google Auth Error:", error);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}
