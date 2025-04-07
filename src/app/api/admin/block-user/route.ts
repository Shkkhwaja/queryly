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

    const user = await userModel.findById(id);

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    // Toggle block status
    const newStatus = user.status === "blocked" ? "active" : "blocked";
    user.status = newStatus;
    await user.save();

    return NextResponse.json({ success: true, status: newStatus, message: `User ${newStatus} successfully` });

  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
