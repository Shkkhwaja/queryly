import { connectToDB } from "@/dbConnection/dbConnection";
import postModel from "@/models/postModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await connectToDB();

  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ success: false, message: "Post ID is required" }, { status: 400 });
    }

    const deletedPost = await postModel.findByIdAndDelete(id);

    if (!deletedPost) {
      return NextResponse.json({ success: false, message: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Post deleted successfully" });

  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
