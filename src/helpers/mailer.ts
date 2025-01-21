import userModel from '@/models/userModel';
import nodemailer from 'nodemailer'
import bcryptjs from 'bcryptjs'


export const sendEmail = async({email,genotp ,userId}:any) => {
    try {

        const hashedToken = await bcryptjs.hash(userId.toString(),10)
        if (genotp) {
          await userModel.findByIdAndUpdate(userId, {
            verifyToken: hashedToken,
            verifyTokenExpire: Date.now() + 3600000,
          });
        } else if (genotp === 'RESET') {
          await userModel.findByIdAndUpdate(userId, {
            forgotPassword: hashedToken,
            forgotPasswordTokenExpire: Date.now() + 3600000,
          });
        }




      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'parveen703955@gmail.com', // Your email
            pass: 'khwaja98', // Your app password
        },
    });

    // Email options
    const mailOptions = {
        from: 'parveen703955@gmail.com', // sender address
        to: email, // list of receivers
        subject: "Your OTP Code", // Subject line                                                 // ERROR ON NODEMAILER
        text: `Your OTP is: ${genotp}`, // plain text body
        html: `<b>Your OTP is: <h2>${genotp}</h2></b>`, // html body
    };

    // Send the email
    const mailResponse = await transporter.sendMail(mailOptions);
    return mailResponse;
} catch (error: any) {
    console.error('Error sending email: ', error);
}
}