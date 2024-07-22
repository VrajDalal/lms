import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/app/utils/mongo";
import AddStudentsList from "@/lib/models/admin/addStudents.model";

export async function POST(req: NextRequest) {

    const body = await req.json()
    const { sid } = body

    if (!sid) {
        return NextResponse.json({ success: false, message: 'Invalid id or id not matched' }, { status: 409 })
    }

    await connect()

    try {
        const isPresentStudentId = await AddStudentsList.findOne({ sid })
        if (!isPresentStudentId) {
            return NextResponse.json({ success: false, message: 'Sid not found' }, { status: 404 })
        }
        return NextResponse.json({ success: true, message: 'Sid found successfully',isPresentStudentId }, { status: 200 })
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}