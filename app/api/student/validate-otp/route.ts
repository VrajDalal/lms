import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"

export async function POST(req: NextRequest) {

    const { otp } = await req.json()

    if (!otp) {
        return NextResponse.json({ success: false, message: 'OTP is required' }, { status: 400 });
    }

    try {
        const encryptedOtp = req.cookies.get('otp')?.value
        if (!encryptedOtp) {
            return NextResponse.json({ success: false, message: 'OTP not found' }, { status: 404 });
        }

        const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY || ""
        const decodedOtp = jwt.verify(encryptedOtp, SECRET_KEY) as string

        if (decodedOtp === otp) {
            return NextResponse.json({ success: true, message: 'OTP validated successfully' }, { status: 200 });
        } else {
            return NextResponse.json({ success: false, message: 'Invalid OTP' }, { status: 400 });
        }
    } catch (error) {
        console.error('Error validating OTP:', error);
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}