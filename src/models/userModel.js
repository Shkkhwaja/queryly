import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    otp: { type: Number },
    isVerified: { type: Boolean, default: false },
    token: {type:String}
}, { timestamps: true });

const userModel = mongoose.models.users || mongoose.model('users', userSchema);

export default userModel;
