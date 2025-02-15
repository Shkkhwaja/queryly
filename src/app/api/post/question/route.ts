import { connectToDB } from "@/dbConnection/dbConnection";
import postModel from "@/models/postModel";
import { NextResponse, NextRequest } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import userModel from "@/models/userModel";

connectToDB();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { question, semester }: { question: string; semester: string } = reqBody;

    // Get user ID from token
    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch user details
    const user = await userModel.findById(userId).select("name avatar");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create new post
    const newQuestion = new postModel({
      question,
      semester,
      author: {
        user: userId, 
        avatar: user.avatar,
      },
    });

    const savedQuestion = await newQuestion.save();

    return NextResponse.json(
      {
        message: "Question posted successfully",
        data: {
          id: savedQuestion._id,
          question: savedQuestion.question,
          semester: savedQuestion.semester,
          author: {
            name: user.name,
            avatar: user.avatar,
          },
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Internal server error:", error); // Log the error
    return NextResponse.json(
      { error: "An internal server error occurred." },
      { status: 500 }
    );
  }
}



// New GET method to fetch all questions
export async function GET(request: NextRequest) {
    try {
        const questions = await postModel.find().populate('author.user', 'name avatar').lean();
        return NextResponse.json(questions, { status: 200 });
    } catch (error: any) {
      console.error("Error fetching questions:", error);
      return NextResponse.json(
        { error: "An internal server error occurred." },
        { status: 500 }
      );
    }
  }