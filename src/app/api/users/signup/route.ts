import {connectToDB} from '@/dbConnection/dbConnection'
import userModel from '@/models/userModel'
import { NextResponse, NextRequest } from 'next/server'
import bcryptjs from "bcryptjs"
import {sendEmail} from '@/helpers/mailer'

connectToDB()

export async function POST(request: NextRequest){

    function OTPGenerator(){
        return Math.floor(100000 + Math.random() * 900000);
    }
    try{

                // Generate OTP
                const genotp = OTPGenerator();



        const reqBody = await request.json()
        const { name, email, password }: any = reqBody;
        // validation 
        console.log(reqBody);

        const user = await userModel.findOne({email})
        if(user){
            return NextResponse.json({error: "user Already Exist"}, {status: 400})
        }

        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password, salt)
        
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
            otp:genotp,
        })

        const savedUser = await newUser.save()
        console.log(savedUser);


        // send Verification Email With OTP



        await sendEmail({email,genotp,userId: savedUser._id})
        return NextResponse.json({
            message:"User registered Successfully",
            success: true,
            savedUser
        })
        
        

    }catch(err: any){
        return NextResponse.json({error: err.message},{status:500})
    }
}