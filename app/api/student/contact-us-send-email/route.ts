import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer"

export async function POST(req: NextRequest) {
    const { sid, studentName, studentEmail, studentMessage } = await req.json()

    if (!studentEmail) {
        return NextResponse.json({ success: false, message: 'Email not available' }, { status: 409 })
    }

    try {
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
            from: studentEmail,
            to: process.env.EMAIL_USER,
            subject: `${studentName}-${sid} for query`,
            html: `
                <p>Dear Librarian,</p>
                <p>${studentMessage}</p>
            `
        }
        await transporter.sendMail(mailOption)

        return NextResponse.json({ success: true, message: 'Mail sent successfully to the librarian' }, { status: 200 })
    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json({ success: false, message: 'Failed to sent mail', error })
    }
}