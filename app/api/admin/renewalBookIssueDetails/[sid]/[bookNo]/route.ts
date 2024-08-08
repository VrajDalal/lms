import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/app/utils/mongo";
import StudentsIssueBooks from "@/lib/models/admin/studentsIssueBook.model";
import StudentsIssueBooksHistory from "@/lib/models/admin/studentsIssueBookHistory.model";
import { format, parseISO, isValid } from "date-fns";

export async function PATCH(req: NextRequest, { params }: { params: { sid: number, bookNo: string } }) {

    const { sid, bookNo } = params;

    if (!sid || !bookNo) {
        return NextResponse.json({ success: false, message: 'Invalid sid or bookNo' }, { status: 409 });
    }

    try {
        const body = await req.json();

        const { bookIssueDate, returnDate } = body;

        if (!bookIssueDate || !returnDate) {
            return NextResponse.json({ success: false, message: 'Invalid fields' }, { status: 409 });
        }

        await connect();

        const existingDocumentInIssueBookTable = await StudentsIssueBooks.findOne({
            'IssueDetails.bookNo': bookNo
        });

        const existingDocumentInIssueBookHistoryTable = await StudentsIssueBooks.findOne({
            'IssueDetails.bookNo': bookNo
        });

        if (!existingDocumentInIssueBookTable && !existingDocumentInIssueBookHistoryTable) {
            return NextResponse.json({ success: false, message: 'Book details not found' }, { status: 404 });
        }

        const isPresentStudentBookIssueDetails = await StudentsIssueBooks.updateOne(
            { 'IssueDetails.bookNo': bookNo },
            {
                $set: {
                    'IssueDetails.$.bookIssueDate': format(bookIssueDate, "dd-MM-yyyy"),
                    'IssueDetails.$.returnDate': format(returnDate, "dd-MM-yyyy"),
                }
            }
        );

        const isPresentStudentBookIssueHistoryDetails = await StudentsIssueBooksHistory.updateOne(
            { 'IssueDetails.bookNo': bookNo },
            {
                $set: {
                    'IssueDetails.$.bookIssueDate': format(bookIssueDate, "dd-MM-yyyy"),
                    'IssueDetails.$.returnDate': format(returnDate, "dd-MM-yyyy"),
                }
            }
        );

        if (isPresentStudentBookIssueDetails.modifiedCount === 1 && isPresentStudentBookIssueHistoryDetails.modifiedCount === 1) {
            return NextResponse.json({ success: true, message: 'Book renewed successfully' }, { status: 200 });
        } else {
            return NextResponse.json({ success: false, message: 'Book not found or no changes detected' }, { status: 404 });
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}
