import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/app/utils/mongo";
import StudentsIssueBooks from "@/lib/models/admin/studentsIssueBook.model";

export async function DELETE(req: NextRequest, { params }: { params: { sid: number, bookNo: string } }) {

    const { sid, bookNo } = params

    if (!sid || !bookNo) {
        return NextResponse.json({ success: false, message: 'Invaild sid or bookNo' }, { status: 409 })
    }

    await connect()

    try {
        const isPresentStudentBookIssueDetails = await StudentsIssueBooks.findOne({ sid })

        if (!isPresentStudentBookIssueDetails) {
            return NextResponse.json({ success: false, message: 'Student book issue not found' }, { status: 404 });
        }

        const issueToDelete = isPresentStudentBookIssueDetails.IssueDetails.find((issue: any) => issue.bookNo === bookNo)

        if (!issueToDelete) {
            return NextResponse.json({ success: false, message: 'Book not found in student book issue details' }, { status: 404 });
        }

        const updatedIssueDetails = isPresentStudentBookIssueDetails.IssueDetails.filter((issue: any) => issue.bookNo !== bookNo)

        if (updatedIssueDetails.length === isPresentStudentBookIssueDetails.IssueDetails.length) {
            return NextResponse.json({ success: false, message: 'Book not found in student issue details' }, { status: 404 });
        }

        if (updatedIssueDetails.length === 0) {
            await StudentsIssueBooks.deleteOne({ sid });
            return NextResponse.json({ success: true, message: 'All book issues deleted, student data also deleted' }, { status: 200 });
        } else {
            isPresentStudentBookIssueDetails.IssueDetails = updatedIssueDetails;
            await isPresentStudentBookIssueDetails.save();

            return NextResponse.json({ success: true, message: 'Book issue deleted successfully', deletedBookName: issueToDelete.bookName }, { status: 200 });
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}