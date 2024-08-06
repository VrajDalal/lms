import { NextRequest, NextResponse } from "next/server"
import checkTokenExpired from "./app/utils/tokenExpiry"

export function middleware(req: NextRequest) {
    const adminToken = req.cookies.get('adminToken')?.value
    const url = req.nextUrl.pathname

    if (url.startsWith('/admin/dashboard')) {
        if (!adminToken) {
            return NextResponse.redirect(new URL('/admin/login', req.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/dashboard/:path*']
}