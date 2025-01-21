import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Please enter your name'],
    },
    email:{
        type:String,
        required:[true,'Please enter your email'],
        unique:true
    },
    password:{
        type:String,
        required:[true,'Please enter your password']
    },
    otp:{
        type:Number,
        default:0
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    forgotPassword:String,
    forgotPasswordTokenExpire:Date,
    verifyToken:String,
    verifyTokenExpire:Date,

})

const userModel = mongoose.model('users',userSchema);

export default userModel;