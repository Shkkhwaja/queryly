import { connectToDB } from "@/dbConnection/dbConnection";
import postModel from "@/models/postModel";
import { NextResponse, NextRequest } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import mongoose from "mongoose";

connectToDB();

interface UpvoteRequest {
  postId: string;
}

interface UpvoteResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: {
    upvotesCount: number;
    isUpvoted: boolean;
  };
}

export async function POST(request: NextRequest): Promise<NextResponse<UpvoteResponse>> {
  try {
    const userId = await getDataFromToken(request);

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Please login to upvote" },
        { status: 401 }
      );
    }

    const { postId } = await request.json() as UpvoteRequest;

    if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
      return NextResponse.json(
        { success: false, error: "Invalid Post ID" },
        { status: 400 }
      );
    }

    const post = await postModel.findById(postId);
    if (!post) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      );
    }

    const objectUserId = new mongoose.Types.ObjectId(userId);
    const isUpvoted = post.upvotes.includes(objectUserId);

    // Using transaction for atomic updates
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const updatedPost = await postModel.findByIdAndUpdate(
        postId,
        isUpvoted
          ? {
              $pull: { upvotes: objectUserId },
              $inc: { upvotesCount: -1 }
            }
          : {
              $addToSet: { upvotes: objectUserId },
              $inc: { upvotesCount: 1 }
            },
        { new: true, session }
      );

      await session.commitTransaction();

      return NextResponse.json({
        success: true,
        message: isUpvoted ? "Upvote removed" : "Upvote added",
        data: {
          upvotesCount: updatedPost.upvotesCount,
          isUpvoted: !isUpvoted
        }
      });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error: any) {
    console.error("Error handling upvote:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to process upvote"
      },
      { status: 500 }
    );
  }
}