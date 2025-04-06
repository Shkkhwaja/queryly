import { connectToDB } from "@/dbConnection/dbConnection";
import postModel from "@/models/postModel";
import { NextResponse, NextRequest } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import mongoose from "mongoose";

interface DeleteResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export async function DELETE(request: NextRequest): Promise<NextResponse<DeleteResponse>> {
  try {
    // Verify user authentication
    const userId = await getDataFromToken(request);

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Please login to delete posts" },
        { status: 401 }
      );
    }

    const { postId } = await request.json();

    if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
      return NextResponse.json(
        { success: false, error: "Invalid Post ID" },
        { status: 400 }
      );
    }

    // Find the post and verify ownership
    const post = await postModel.findOne({
      _id: postId,
      "author.user": new mongoose.Types.ObjectId(userId)
    });

    if (!post) {
      return NextResponse.json(
        { success: false, error: "Post not found or unauthorized" },
        { status: 404 }
      );
    }

    // Using transaction for atomic operation
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Delete the post
      await postModel.deleteOne({ _id: postId }).session(session);
      await session.commitTransaction();

      return NextResponse.json({
        success: true,
        message: "Post deleted successfully"
      });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error: any) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to delete post"
      },
      { status: 500 }
    );
  }
}