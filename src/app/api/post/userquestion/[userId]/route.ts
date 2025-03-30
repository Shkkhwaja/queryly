// /app/api/posts/user/[userId]/route.ts
import { connectToDB } from "@/dbConnection/dbConnection";
import postModel from "@/models/postModel";
import { NextResponse, NextRequest } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import mongoose from 'mongoose';

connectToDB();

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    // Verify the requesting user matches the userId in params
    const requestingUserId = await getDataFromToken(request);
    
    if (!requestingUserId) {
      return NextResponse.json(
        { error: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }

    if (requestingUserId !== params.userId) {
      return NextResponse.json(
        { error: "Unauthorized: You can only access your own posts" },
        { status: 403 }
      );
    }

    // Find posts where author.user exactly matches the userId
    const posts = await postModel.find({ 
      "author.user": new mongoose.Types.ObjectId(params.userId) 
    })
    .sort({ createdAt: -1 })
    .populate({
      path: "author.user",
      select: "-password -otp -isVerified",
      match: { _id: new mongoose.Types.ObjectId(params.userId) } // Double verification
    })
    .lean(); // Convert to plain JavaScript objects

    // Filter out any null populated users (just in case)
    const filteredPosts = posts.filter(post => post.author.user !== null);

    return NextResponse.json(
      {
        success: true,
        message: "User posts retrieved successfully",
        data: filteredPosts
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Error fetching user posts:", error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message || "Failed to fetch user posts" 
      },
      { status: 500 }
    );
  }
}