import nodemailer from 'nodemailer';

export const sendOTPEmail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail', 
        auth: {
            user: process.env.EMAIL_USER, 
            pass: process.env.EMAIL_PASS, 
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER, 
        to: email, 
        subject: 'Your Email Verification OTP', 
        text: `Your OTP is expire in 10 minutes.`, 
    };

    await transporter.sendMail(mailOptions);
};
