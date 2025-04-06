import { connectToDB } from "@/dbConnection/dbConnection";
import postModel from "@/models/postModel";
import { NextResponse, NextRequest } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import mongoose from "mongoose";

connectToDB();

export async function GET(req: NextRequest, context: { params: { userId: string } }) {
  try {
    const { userId } = await context.params;

    if (!userId) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const requestingUserId = await getDataFromToken(req);

    if (!requestingUserId) {
      return NextResponse.json(
        { error: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }

    if (requestingUserId !== userId) {
      return NextResponse.json(
        { error: "Unauthorized: You can only access your own posts" },
        { status: 403 }
      );
    }

    const objectId = new mongoose.Types.ObjectId(userId);

    const posts = await postModel
      .find({ "author.user": objectId })
      .sort({ createdAt: -1 })
      .populate({
        path: "author.user",
        select: "-password -otp -isVerified",
        match: { _id: objectId },
      })
      .lean();

    const filteredPosts = posts.filter((post) => post.author.user !== null);

    return NextResponse.json(
      {
        success: true,
        message: "User posts retrieved successfully",
        data: filteredPosts,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching user posts:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch user posts",
      },
      { status: 500 }
    );
  }
}
