import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/app/utils/mongo";
import AddStudentsList from "@/lib/models/admin/addStudents.model";
import StudentsIssueBooks from "@/lib/models/admin/studentsIssueBook.model";

export async function GET(req: NextRequest, { params }: { params: { sid: string } }) {

    const { sid } = params

    if (!sid) {
        return NextResponse.json({ success: false, message: 'Invalid id or id not matched' }, { status: 409 })
    }

    await connect()

    try {
        const isPresentStudentId = await AddStudentsList.findOne({ sid })

        if (!isPresentStudentId) {
            return NextResponse.json({ success: false, message: 'Sid not found' }, { status: 404 })
        } else {
            const isPresentStudentBookIssueDetails = await StudentsIssueBooks.findOne({ sid })
            console.log(isPresentStudentBookIssueDetails);
            if (isPresentStudentBookIssueDetails) {
                const bookIssueDetails = []
                for (const bookIssue of isPresentStudentBookIssueDetails.IssueDetails) {
                    console.log(bookIssue);
                    bookIssueDetails.push(bookIssue)
                }
                return NextResponse.json({ success: true, message: 'Sid found successfully', isPresentStudentId, bookIssueDetails }, { status: 200 })
            } else {
                return NextResponse.json({ success: true, message: 'Student book issue details not available', isPresentStudentId, bookIssueDetails: null }, { status: 200 })
            }

        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}