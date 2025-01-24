import { connectToDB } from "@/dbConnection/dbConnection";
import userModel from "@/models/userModel";
import { NextResponse, NextRequest } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";

connectToDB()


export async function POST(request:NextRequest){
    //extract data from token
    const userId = await getDataFromToken(request)

    const user = await userModel.findOne({_id: userId}).select("-password -otp -isVerified")

    // check if there is no user
    return NextResponse.json(
        {message: "user found",
            data:user
        }
    )
} 