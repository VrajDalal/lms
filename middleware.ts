import { NextRequest, NextResponse } from "next/server"

export function middleware(req: NextRequest) {
    const adminToken = req.cookies.get('adminToken')?.value
    const url = req.nextUrl

    if (url.pathname === '/') {
        if (!adminToken) {
            return NextResponse.redirect(new URL('/admin/login', req.url))
        } else {
            return NextResponse.redirect(new URL('/admin/dashboard', req.url))
        }
    }

    if (url.pathname.startsWith('/admin/dashboard')) {
        if (!adminToken) {
            return NextResponse.redirect(new URL('/admin/login', req.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/','/admin/dashboard/:path*']
}