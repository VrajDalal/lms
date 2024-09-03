import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/app/utils/mongo";
import AddStudentsList from "@/lib/models/admin/addStudents.model";

export async function GET(req: NextRequest, { params }: { params: { sid: string } }) {

    const { sid } = params

    if (!sid) {
        return NextResponse.json({ success: false, message: 'Invalid id or id not matched' }, { status: 400 })
    }

    await connect()

    try {
        const isPresentStudentSID = await AddStudentsList.findOne({ sid })

        if (!isPresentStudentSID) {
            return NextResponse.json({ success: false, message: 'Student id not available' }, { status: 404 })
        }

        return NextResponse.json({ success: true, message: 'Student id is valid', studentEmail: isPresentStudentSID.studentEmail }, { status: 200 })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, message: 'Invalid method', error: error }, { status: 500 })
    }
}