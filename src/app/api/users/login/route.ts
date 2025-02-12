import { connectToDB } from "@/dbConnection/dbConnection";
import userModel from "@/models/userModel";
import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

connectToDB();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }
    

    const user: any = await userModel.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "Email Not exist" }, { status: 400 });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    if(!user.isVerified){
        return NextResponse.json(
            {error: "Email is not verifiy"},
            {status: 401}
        )
    }
    const tokenData = {
        id:user._id,
        name:user.name,
        email:user.email
    }

    // generate token
    const token = jwt.sign(tokenData, process.env.JWT_SECRET!, {
      expiresIn: "7h",
    });
    
    const response = NextResponse.json({
      message: "Login successful",
      success: true,
    });

    response.cookies.set("token", token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 60 * 60,
    });

    return response;
  } catch (error: any) {
    console.error("Error during login:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
