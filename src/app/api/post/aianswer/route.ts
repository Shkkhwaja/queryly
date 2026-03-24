import postModel from "@/models/postModel";
import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import { connectToDB } from "@/dbConnection/dbConnection";
import axios from "axios";

connectToDB();

export async function POST(request: NextRequest) {
  try {
    const { postId }: { postId: string } = await request.json();

    if (!postId || !Types.ObjectId.isValid(postId)) {
      return NextResponse.json({ error: "Invalid postId" }, { status: 400 });
    }

    const post = await postModel.findById(postId).select("question aiAnswer");

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // ✅ Avoid duplicate API calls (IMPORTANT)
    if (post.aiAnswer) {
      return NextResponse.json({ data: post.aiAnswer }, { status: 200 });
    }

    // 🔥 OpenRouter API Call
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo", // FREE model
        messages: [
          {
            role: "user",
            content: post.question,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const text =
      response.data.choices?.[0]?.message?.content || "No response";

    // Save answer
    post.aiAnswer = text;
    await post.save();

    return NextResponse.json({ data: text }, { status: 200 });

  } catch (error: any) {
    console.error("OpenRouter Error:", error.response?.data || error.message);

    return NextResponse.json( 
      { error: "Failed to generate AI answer" },
      { status: 500 }
    );
  }
}