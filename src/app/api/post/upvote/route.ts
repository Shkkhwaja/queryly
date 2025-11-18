import { connectToDB } from "@/dbConnection/dbConnection";
import postModel from "@/models/postModel";
import { NextResponse, NextRequest } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import mongoose from "mongoose";

connectToDB();

export async function POST(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Please login to upvote" },
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

    const objectUserId = new mongoose.Types.ObjectId(userId);

    // ---------- RETRY MECHANISM ----------
    let attempts = 0;
    const maxAttempts = 5;

    while (attempts < maxAttempts) {
      try {
        // Fetch post only to check if user already liked
        const post = await postModel.findById(postId).select("upvotes");

        if (!post) {
          return NextResponse.json(
            { success: false, error: "Post not found" },
            { status: 404 }
          );
        }

        const isUpvoted = post.upvotes.includes(objectUserId);

        const updateQuery = isUpvoted
          ? { $pull: { upvotes: objectUserId }, $inc: { upvotesCount: -1 } }
          : { $addToSet: { upvotes: objectUserId }, $inc: { upvotesCount: 1 } };

        const updatedPost = await postModel.findByIdAndUpdate(
          postId,
          updateQuery,
          { new: true }
        );

        return NextResponse.json({
          success: true,
          message: isUpvoted ? "Upvote removed" : "Upvote added",
          data: {
            upvotesCount: updatedPost.upvotesCount,
            isUpvoted: !isUpvoted,
          }
        });
      } catch (err: any) {
        // If write conflict happens → retry
        if (err.code === 112 || err.codeName === "WriteConflict") {
          attempts++;
          await new Promise(res => setTimeout(res, 50)); // wait then retry
          continue;
        }

        throw err;
      }
    }

    return NextResponse.json(
      { success: false, error: "Retry limit exceeded. Try again." },
      { status: 500 }
    );
  } catch (error: any) {
    console.error("Upvote Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process upvote" },
      { status: 500 }
    );
  }
}
