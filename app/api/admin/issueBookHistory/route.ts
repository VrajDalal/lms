import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/app/utils/mongo";
import StudentsIssueBooksHistory from "@/lib/models/admin/studentsIssueBookHistory.model";
export async function GET() {
    await connect();

    try {
        const studentIssueBooksDetails = await StudentsIssueBooksHistory.find({}).lean();
        console.log(studentIssueBooksDetails);

        if (!studentIssueBooksDetails) {
            return NextResponse.json({ success: false, message: 'Student issue book history not retrieved' }, { status: 404 });
        }
        return NextResponse.json({ success: true, message: 'Student issue book history successfully retrieved', datas: studentIssueBooksDetails }, { status: 200 });
    } catch (error) {
        console.error('Error fetching student issue books:', error);
        return NextResponse.json({ success: false, message: 'Error retrieving student issue book history' }, { status: 500 }
        );
    }
}
