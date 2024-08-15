import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/app/utils/mongo";
import StudentsIssueBooks from "@/lib/models/admin/studentsIssueBook.model";
import StudentsIssueBooksHistory from "@/lib/models/admin/studentsIssueBookHistory.model";
import { format, parse, addDays, isValid } from "date-fns";

export async function PATCH(req: NextRequest, { params }: { params: { sid: number, bookNo: string } }) {
    const { sid, bookNo } = params;

    if (!sid || !bookNo) {
        return NextResponse.json({ success: false, message: 'Invalid sid or bookNo' }, { status: 409 });
    }

    try {
        const body = await req.json();
        const { returnDate } = body;

        if (!returnDate) {
            return NextResponse.json({ success: false, message: 'Invalid fields' }, { status: 409 });
        }

        await connect();

        const existingDocumentInIssueBookTable = await StudentsIssueBooks.findOne({
            'IssueDetails.bookNo': bookNo
        });

        const existingDocumentInIssueBookHistoryTable = await StudentsIssueBooksHistory.findOne({
            'IssueDetails.bookNo': bookNo
        });

        if (!existingDocumentInIssueBookTable && !existingDocumentInIssueBookHistoryTable) {
            return NextResponse.json({ success: false, message: 'Book details not found' }, { status: 404 });
        }

        // Get the current date for the book issue date
        const currentDate = new Date();
        const formattedCurrentDate = format(currentDate, "dd-MM-yyyy");

        // Parse the incoming return date
        const parsedReturnDate = parse(returnDate, "dd-MM-yyyy", new Date());

        // Validate the return date
        if (!isValid(parsedReturnDate)) {
            console.error('Invalid date format', { returnDate });
            return NextResponse.json({ success: false, message: 'Invalid date format' }, { status: 400 });
        }

        // Add 7 days to the parsed return date
        const updatedReturnDate = addDays(parsedReturnDate, 7);
        const formattedReturnDate = format(updatedReturnDate, "dd-MM-yyyy");

        // Update the database with the new book issue date and return date
        const updatedStudentBookIssueDetails = await StudentsIssueBooks.updateOne(
            { 'IssueDetails.bookNo': bookNo },
            {
                $set: {
                    'IssueDetails.$.bookIssueDate': formattedCurrentDate,
                    'IssueDetails.$.returnDate': formattedReturnDate,
                }
            }
        );

        const updatedStudentBookIssueHistoryDetails = await StudentsIssueBooksHistory.updateOne(
            { 'IssueDetails.bookNo': bookNo },
            {
                $set: {
                    'IssueDetails.$.bookIssueDate': formattedCurrentDate,
                    'IssueDetails.$.returnDate': formattedReturnDate,
                }
            }
        );

        if (updatedStudentBookIssueDetails.modifiedCount > 0 || updatedStudentBookIssueHistoryDetails.modifiedCount > 0) {

            const updatedIssueBook = await StudentsIssueBooks.findOne(
                { 'IssueDetails.bookNo': bookNo },
                { 'IssueDetails.$': 1 }
            );

            const updatedIssueBookHistory = await StudentsIssueBooksHistory.findOne(
                { 'IssueDetails.bookNo': bookNo },
                { 'IssueDetails.$': 1 }
            );

            const updatedDetails = updatedIssueBook ? updatedIssueBook.IssueDetails[0] : updatedIssueBookHistory.IssueDetails[0];


            if (updatedDetails) {
                return NextResponse.json({
                    success: true,
                    message: 'Book renewed successfully',
                    data: {
                        bookNo: updatedDetails.bookNo,
                        bookName: updatedDetails.bookName,
                        bookIssueDate: updatedDetails.bookIssueDate,
                        returnDate: updatedDetails.returnDate
                    }
                }, { status: 200 });
            } else {
                return NextResponse.json({ success: false, message: 'Book not found or no changes detected' }, { status: 404 });
            }
        }
    } catch (error) {
        console.error('Error during book renewal process:', error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}
