import { NextRequest, NextResponse } from "next/server";
import checkTokenExpired from "@/app/utils/tokenExpiry";
import nookies from "nookies"

export async function GET(req: NextRequest, res: NextResponse) {
    try {
        const cookies = nookies.get({ req })
        const adminToken = cookies.adminToken
        console.log(cookies);
        console.log(adminToken);
        if (!adminToken) {
            return NextResponse.json({ message: 'Token not found', tokenExpired: true }, { status: 401 });
        }

        const isTokenExpired = checkTokenExpired(adminToken)
        if (isTokenExpired) {
            return NextResponse.json({ message: 'Token not found', tokenExpired: true }, { status: 401 });
        }

        return NextResponse.json({ message: 'Token valid', tokenExpired: false }, { status: 200 });
    } catch (err) {
        
    }
}