
import { NextResponse, NextRequest } from "next/server";




export async function GET(request:NextRequest){
   const response = NextResponse.json(
    {message:"Logout Successfully"},
    {status:200}
   )

   response.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(0),
  });

  return response
}