import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer"
import crypto from "crypto"
import jwt from "jsonwebtoken"

export async function POST(req: NextRequest, { params }: { params: { sid: string, studentEmail: string } }) {

    const { sid, studentEmail } = params

    if (!sid || !studentEmail) {
        return NextResponse.json({ success: false, message: 'Invalid sid or email id' }, { status: 400 });
    }

    try {
        const token = Array.from(crypto.randomBytes(6)).map(byte => byte % 10).join('')
        console.log(token);

        const transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        })

        const mailOption = {
            from: process.env.EMAIL_USER,
            to: studentEmail,
            subject: `Received OTP for authention from Book Issue Hub`,
            html: `<p>This is email from Book Issue Hub for authenticate you email address </p>
                        <p>one time password for authentication : <strong>${token},</strong>
                         and is valid for 5 minutes</p>
                <p>Best regards,</p>
                <p>Book issue hub</p>
            `
        }

        await transporter.sendMail(mailOption)

        const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY || ""
        const encryptedOtp = jwt.sign(token, SECRET_KEY)

        const response = NextResponse.json({ success: true, message: 'OTP sent successfully' }, { status: 200 })
        response.cookies.set('otp', encryptedOtp, { httpOnly: true, path: '/', maxAge: 60 * 5 })
        return response
    } catch (error) {
        console.error('Error sending OTP email:', error);
        return NextResponse.json({ success: false, message: 'Failed to sent OTP', error })
    }
}