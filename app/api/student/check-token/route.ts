import { NextRequest, NextResponse } from "next/server";
import checkTokenExpired from "@/app/utils/tokenExpiry";

export async function GET(req: NextRequest) {
    try {
        const cookies = req.cookies.get('studentToken')?.value
        const studentToken = cookies?.toString()

        if (!studentToken) {
            return NextResponse.json({ message: 'Token not found', tokenExpired: true }, { status: 401 });
        }

        const isTokenExpired = checkTokenExpired(studentToken)
        if (isTokenExpired) {
            return NextResponse.json({ message: 'Token not found', tokenExpired: true }, { status: 401 });
        }

        return NextResponse.json({ message: 'Token valid', tokenExpired: false }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ message: 'Method not work' }, { status: 500 });

    }
}