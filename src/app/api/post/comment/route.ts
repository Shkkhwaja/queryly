import { NextResponse, NextRequest } from "next/server";
import userModel from "@/models/userModel";
import { connectToDB } from "@/dbConnection/dbConnection";
import postModel from "@/models/postModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";

connectToDB()

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { text, postId,avatar,name }: { text: string; postId: string; avatar: string; name: string; } = reqBody; 

    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await userModel.findById(userId).select("name avatar");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find the post by ID and add the comment
    const post = await postModel.findById(postId);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    post.comments.push({
      user: post,
      text,
      avatar,
      name
    });


      const savedPost = await post.save();

      return NextResponse.json(
        {
          message: "Comment added successfully",
          data: {
            id: savedPost._id,
            comments: savedPost.comments,
             
          },
        },
        { status: 201 }
      );
    } catch (error: any) {
    console.log("Server Error", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 502 }
    );
  }
}
