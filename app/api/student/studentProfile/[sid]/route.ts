import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/app/utils/mongo";
import AddStudentsList from "@/lib/models/admin/addStudents.model";

export async function GET(req: NextRequest, { params }: { params: { sid: string } }) {
    const { sid } = params

    if (!sid) {
        return NextResponse.json({ success: false, message: 'Invalid id or id not matched' }, { status: 400 })
    }

    await connect();

    try {
        const studentDetails = await AddStudentsList.findOne({ sid })
        console.log(studentDetails);

        if (!studentDetails) {
            return NextResponse.json({ success: false, message: 'Student details not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, message: 'Student details retrived successfully', datas: studentDetails }, { status: 200 });
    } catch (error) {
        console.error('Error fetching student issue books:', error);
        return NextResponse.json({ success: false, message: 'Error retrieving student issue book history' }, { status: 500 });
    }
}
