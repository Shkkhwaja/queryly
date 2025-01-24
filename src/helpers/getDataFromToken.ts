import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getDataFromToken = (request:NextRequest) => {
    try{
        const token = request.cookies.get("token")?.value || ""
        const decodedToken: any = jwt.verify(token,process.env.JWT_SECRET!)

        return decodedToken.id

    }catch(error:any){
        throw new Error(error.message)
    }
}