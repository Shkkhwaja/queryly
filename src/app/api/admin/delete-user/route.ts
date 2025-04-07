import { connectToDB } from "@/dbConnection/dbConnection";
import userModel from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await connectToDB();

  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 });
    }

    await userModel.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "User deleted successfully" });

  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
