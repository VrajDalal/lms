import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer"

export async function POST(req: NextRequest) {

    const { studentEmail, studentName, bookDetails } = await req.json()

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
            from: process.env.EMAIL_USER,
            to: studentEmail,
            subject: `Book Return Confirmation From Library`,
            html: `
                <p>Dear ${studentName},</p>
                <p>We are pleased to inform you that you have return issued a book from our library. Here are the details:</p>
                <p>${bookDetails}</p>
                <p>Thank you for using our library services.</p>
                <p>Best regards,</p>
                <p>Book issue hub</p>
            `
        }

        await transporter.sendMail(mailOption)

        return NextResponse.json({ success: true, message: 'Mail sent successfully to the student regarding the return book' }, { status: 200 })
    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json({ success: false, message: 'Failed to sent mail', error })
    }
}