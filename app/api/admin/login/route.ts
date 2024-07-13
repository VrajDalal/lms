import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/app/utils/mongo";
import Admin from "@/lib/models/admin/admin.model";
import jwt from "jsonwebtoken"
import brcypt from "bcrypt"

export async function POST(req: NextRequest) {

    const body = await req.json()
    const { username, password } = body

    if (!username || !password) {
        return NextResponse.json({ success: false, message: 'Invalid fields' }, { status: 400 })
    }

    await connect()

    try {
        const isAdminPresent = await Admin.findOne({ username })

        if (!isAdminPresent) {
            return NextResponse.json({ succes: false, message: 'Admin not available' }, { status: 409 })
        }

        const isPasswordMatch = await brcypt.compare(password, isAdminPresent.password)
        if (!isPasswordMatch) {
            return NextResponse.json({ success: false, message: 'Invalid credential' }, { status: 409 })
        }

        const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY || ""
        const token = jwt.sign({ id: isAdminPresent._id.toString() }, SECRET_KEY, { expiresIn: '20s' })

        const response = NextResponse.json({ success: true, message: 'Admin login successfully' }, { status: 200 })
        response.cookies.set('adminToken', token, { maxAge: 20, path: '/', sameSite: 'strict' })

        return response
    } catch (error) {
        console.log('Error: ', error);
        return NextResponse.json({ success: false, error }, { status: 500 })
    }

}