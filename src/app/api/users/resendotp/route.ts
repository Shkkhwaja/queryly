import { connectToDB } from "@/dbConnection/dbConnection";
import userModel from "@/models/userModel";
import { NextResponse, NextRequest } from "next/server";
import { sendEmail } from "@/helpers/mailer";
import jwt from "jsonwebtoken";

connectToDB();



export async function PATCH(request: NextRequest) {
    function generateOTP(): number {
        return Math.floor(100000 + Math.random() * 900000);
      }

  try {
    // Get the authentication token from the cookies
    const token = request.cookies.get("authToken")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Authentication token is required", success: false },
        { status: 401 }
      );
    }

    // Verify and decode the token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (error) {
      return NextResponse.json(
        { message: "Invalid or expired token", success: false },
        { status: 403 }
      );
    }

    // Extract user information from decoded token
    const { id } :any = decoded;

    // Find user in the database
    const user = await userModel.findById(id);

    if (!user) {
      return NextResponse.json(
        { message: "User not found", success: false },
        { status: 404 }
      );
    }

    // If the user is already verified
    if (user.isVerified) {
      return NextResponse.json(
        { message: "User is already verified. Please log in.", success: false },
        { status: 400 }
      );
    }

    // Generate and save a new OTP
    const newOtp = generateOTP();
    user.otp = newOtp;
    await user.save();

    // Send email with the new OTP
    await sendEmail({
      name: user.name,
      email: user.email,
      genotp: newOtp,
    });

    return NextResponse.json({
      message: "OTP sent successfully to your email address.",
      success: true,
    });
  } catch (error) {
    console.error("Error resending OTP:", error);
    return NextResponse.json(
      { message: "An error occurred. Please try again later.", success: false },
      { status: 500 }
    );
  }
}
