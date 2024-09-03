import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/app/utils/mongo";
import AddStudentsList from "@/lib/models/admin/addStudents.model";
import jwt from "jsonwebtoken"

export async function POST(req: NextRequest) {

    const { sid, studentSIDOtp } = await req.json()

    if (!sid || !studentSIDOtp) {
        return NextResponse.json({ success: false, message: 'Invalid request' }, { status: 400 });
    }

    const encryptedOtp = req.cookies.get('otp')?.value;

    if (!encryptedOtp) {
        return NextResponse.json({ success: false, message: 'OTP not found' }, { status: 400 });
    }

    const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY || ""
    const decodedOtp = jwt.verify(encryptedOtp, SECRET_KEY) as string

    if (decodedOtp !== studentSIDOtp) {
        return NextResponse.json({ success: false, message: 'Invalid OTP' }, { status: 400 });
    }

    await connect();

    try {

        const isPresentStudenSID = await AddStudentsList.findOne({ sid })

        if (!isPresentStudenSID) {
            return NextResponse.json({ success: false, message: 'Student not found' }, { status: 404 });
        }

        const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY || ""

        const tokenPayload = {
            id: isPresentStudenSID._id.toString(),
            sid: isPresentStudenSID.sid,
            studentName: isPresentStudenSID.studentName
        }
        const token = jwt.sign(tokenPayload, SECRET_KEY, { expiresIn: '1h' })

        const response = NextResponse.json({ success: true, message: 'Student login successfully' }, { status: 200 })
        response.cookies.set('studentToken', token, { maxAge: 3600, path: '/', sameSite: 'strict' })

        return response
    } catch (error) {
        console.error('Error during login:', error);
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }

}