import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectToDB } from "@/dbConnection/dbConnection";
import userModel from "@/models/userModel";

export async function POST(request: Request) {
  try {
    await connectToDB();
    const reqBody = await request.json();
    const { name, email, password, avatar }: { name: string; email: string; password: string; avatar?: string } = reqBody;

    let user = await userModel.findOne({ email });

    if (!user) {
      user = new userModel({
        name,
        email,
        password,
        avatar, 
        isVerified: true,
      });

      await user.save();
    }

    const tokenData = {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    };

    // Generate token
    const token = jwt.sign(tokenData, process.env.JWT_SECRET!, {
      expiresIn: "7h",
    });

    const response = NextResponse.json({
      message: "Login successful",
      success: true,
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 7 * 60 * 60,
    });
    return response;
  } catch (error: any) {
    console.error("Google Auth Error:", error);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}
