import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
    const adminToken = req.cookies.get('adminToken')?.value;
    const studentToken = req.cookies.get('studentToken')?.value;

    const { pathname } = req.nextUrl;

    // If the path is /admin/login and the user has an admin token, redirect to admin dashboard
    if (pathname === '/admin/login') {
        if (adminToken) {
            return NextResponse.redirect(new URL('/admin/dashboard', req.url));
        }
        return NextResponse.next(); // Allow access to /admin/login without token
    }

    // Redirect to login page if admin path is accessed without token
    if (pathname.startsWith('/admin')) {
        if (!adminToken) {
            return NextResponse.redirect(new URL('/admin/login', req.url));
        }
    }

    // If the path is /student/login and the user has a student token, redirect to student dashboard
    if (pathname === '/student/login') {
        if (studentToken) {
            return NextResponse.redirect(new URL('/student/dashboard', req.url));
        }
        return NextResponse.next(); // Allow access to /student/login without token
    }

    // Redirect to login page if student path is accessed without token
    if (pathname.startsWith('/student')) {
        if (!studentToken) {
            return NextResponse.redirect(new URL('/student/login', req.url));
        }
    }

    // Root path handling for students
    if (pathname === '/') {
        if (studentToken) {
            return NextResponse.redirect(new URL('/student/dashboard', req.url));
        } else {
            return NextResponse.redirect(new URL('/student/login', req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/admin/:path*', '/student/:path*'],
};
