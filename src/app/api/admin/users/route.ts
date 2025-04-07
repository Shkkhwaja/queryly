import { connectToDB } from "@/dbConnection/dbConnection";
import userModel from "@/models/userModel";
import { NextResponse } from "next/server";

connectToDB();

export async function GET() {
  try {
    const users = await userModel.find().select("-password -otp");
    return NextResponse.json({ success: true, users });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
