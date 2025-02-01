import { connectToDB } from "@/dbConnection/dbConnection";
import userModel from "@/models/userModel";
import { NextResponse, NextRequest } from "next/server";
import { sendEmail } from "@/helpers/mailer";
import jwt from "jsonwebtoken";


connectToDB();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { cloudinaryAvatar } = reqBody;

    const getToken = request.cookies.get("token")?.value;

    if (!getToken) {
      return NextResponse.json(
        { message: "Token is required", success: false },
        { status: 400 }
      );
    }

    // Verify and decode the token
    let decoded;
    try {
      decoded = jwt.verify(getToken, process.env.JWT_SECRET!);
    } catch (error) {
      return NextResponse.json(
        { message: "Invalid or expired token", success: false },
        { status: 403 }
      );
    }

    const { id } = decoded as { id: string };

    const user = await userModel.findById(id);
    if (!user) {
      return NextResponse.json(
        { message: "User not found", success: false },
        { status: 404 }
      );
    }

    // Update and save the avatar
    user.avatar = cloudinaryAvatar;
    await user.save();

    return NextResponse.json(
      { message: "Avatar updated successfully", success: true },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error while updating avatar", success: false, error: error.message },
      { status: 500 }
    );
  }
}
