import { connectToDB } from "@/dbConnection/dbConnection";
import postModel from "@/models/postModel";
import userModel from "@/models/userModel";
import { NextResponse } from "next/server";

connectToDB();

export async function GET() {
  try {
    const posts = await postModel.find();

    const populatedPosts = await Promise.all(
      posts.map(async (post) => {
        const user = await userModel.findById(post.author.user).select("name");
        return {
          _id: post._id,
          question: post.question,
          aiAnswer: post.aiAnswer,
          createdAt: post.createdAt,
          upvotes: post.upvotes,
          upvotesCount: post.upvotesCount,
          semester: post.semester,
          author: {
            _id: user?._id || null,
            name: user?.name || "Unknown",
          },
        };
      })
    );

    return NextResponse.json({ success: true, posts: populatedPosts });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
