import { connectToDB } from '@/dbConnection/dbConnection';
import userModel from '@/models/userModel';
import { NextResponse, NextRequest } from 'next/server';
import bcrypt from 'bcrypt';
import { sendEmail } from '@/helpers/mailer';
import jwt from 'jsonwebtoken';

connectToDB();

export async function POST(request: NextRequest) {
  function OTPGenerator() {
    return Math.floor(100000 + Math.random() * 900000);
  }

  try {
    const genotp = OTPGenerator(); // Generate OTP
    const reqBody = await request.json();
    const { name, email, password }: { name: string; email: string; password: string } = reqBody;


    // Check if the user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      otp: genotp,
    });

    const savedUser = await newUser.save();

    // Generate auth token for OTP verification
    const token = jwt.sign(
      { id: savedUser._id, email: savedUser.email },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    const response = NextResponse.json({
      message: 'User registered successfully. Please verify OTP.',
      success: true,
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
      },
    });

    // Set auth token in cookies
    response.cookies.set('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600, // 1 hour
    });

    // Send OTP email
    await sendEmail({
      name: savedUser.name,
      email: savedUser.email,
      genotp,
      userId: savedUser._id,
    });

    return response;
  } catch (err: any) {
    console.error('Error in user registration:', err);
    return NextResponse.json(
      { error: 'An internal server error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}
