import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { connectToDB } from "@/dbConnection/dbConnection";
import postModel from "@/models/postModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import mongoose, { Types } from "mongoose";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    await connectToDB();

    const { userId } = params; 

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { error: "Invalid user ID format" },
        { status: 400 }
      );
    }

    const requestingUserId = await getDataFromToken(req);

    if (!requestingUserId) {
      return NextResponse.json(
        { error: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }

    if (requestingUserId.toString() !== userId) {
      return NextResponse.json(
        { error: "Unauthorized: You can only access your own posts" },
        { status: 403 }
      );
    }

    const objectId = new Types.ObjectId(userId);

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
  } catch (error: unknown) {
    console.error("Error fetching user posts:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        success: false,
        error: errorMessage || "Failed to fetch user posts",
      },
      { status: 500 }
    );
  }
}