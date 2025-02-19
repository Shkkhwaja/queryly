import postModel from "@/models/postModel";
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Types } from 'mongoose';
import { connectToDB } from "@/dbConnection/dbConnection";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export async function POST(request: NextRequest) {
  try {
    await connectToDB();
    const reqBody = await request.json();
    const { postId }: { postId: string } = reqBody;



    // Validate postId as a valid ObjectId
    if (!postId || !Types.ObjectId.isValid(postId)) {
      return NextResponse.json(
        { error: "Invalid or missing postId" },
        { status: 400 }
      );
    }

    const post = await postModel.findById(postId).select("question");
    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    const result = await model.generateContent(post.question);
    const text = result.response.text();
    post.aiAnswer = text
    await post.save()

    return NextResponse.json({ data:text }, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error"},
      { status: 500 }
    );
  }
}
