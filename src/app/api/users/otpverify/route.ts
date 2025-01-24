import { connectToDB } from '@/dbConnection/dbConnection';
import userModel from '@/models/userModel';
import { NextResponse, NextRequest } from 'next/server';
import jwt from "jsonwebtoken";



// Connect to the database
connectToDB();

export async function PATCH(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { otp } = reqBody;

        // Validate request data
        if (!otp) {
            return NextResponse.json({ error: "OTP is required" }, { status: 400 });
        }

        // Find the user by OTP
        const user = await userModel.findOne({ otp });
        if (!user) {
            return NextResponse.json({ error: "Invalid OTP or OTP expired" }, { status: 404 });
        }


        // Update user's verification status
        user.isVerified = true;
        user.otp = 0; // Clear the OTP after verification
        await user.save();

        // Set token in a cookie
        const response = NextResponse.json({
            message: "OTP verified successfully. User is now verified.",
            success: true,
        });


        return response;

    } catch (err: any) {
        console.error("Error during OTP verification:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
