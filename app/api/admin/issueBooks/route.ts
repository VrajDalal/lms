import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/app/utils/mongo";
import AddStudentsList from "@/lib/models/admin/addStudents.model";
import StudentsIssueBooks from "@/lib/models/admin/studentsIssueBook.model";
import StudentsIssueBooksHistory from "@/lib/models/admin/studentsIssueBookHistory.model";
import { format, parseISO, isValid } from "date-fns";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { sid, enrollmentNo, studentRollNo, studentName, studentEmail, studentMobileNo, studentCource, studentYear, studentDiv, IssueDetails } = body;

    if (!body || !IssueDetails || IssueDetails.length === 0) {
        return NextResponse.json({ success: false, message: 'All fields required' }, { status: 409 });
    }

    await connect();

    try {
        const studentObjectId = await AddStudentsList.findOne({ sid });
        if (!studentObjectId) {
            return NextResponse.json({ success: false, message: 'Student not found' }, { status: 404 });
        }

        const formattedIssueDetails = IssueDetails.map((detail: any) => {
            const issueDate = detail.bookIssueDate ? parseISO(detail.bookIssueDate) : null;
            const returnDate = detail.returnDate ? parseISO(detail.returnDate) : null;

            if (!issueDate || !isValid(issueDate) || (returnDate && !isValid(returnDate))) {
                throw new Error('Invalid date format');
            }

            return {
                bookNo: detail.bookNo,
                bookIssueDate: format(issueDate, "dd-MM-yyyy"),
                bookName: detail.bookName,
                returnDate: returnDate ? format(returnDate, "dd-MM-yyyy") : "",
            };
        });

        const existingIssueRecord = await StudentsIssueBooks.findOne({ sid });

        if (existingIssueRecord) {
            const newBooks = formattedIssueDetails.filter((newBook: any) =>
                !existingIssueRecord.IssueDetails.some((existingBook: any) => existingBook.bookNo === newBook.bookNo)
            );
            existingIssueRecord.IssueDetails.push(...newBooks);
            await existingIssueRecord.save();
        } else {
            await StudentsIssueBooks.create({
                adminObjectId: studentObjectId.adminId,
                studentObjectId: studentObjectId._id,
                sid,
                enrollmentNo,
                studentRollNo,
                studentName,
                studentEmail,
                studentMobileNo,
                studentCource,
                studentYear,
                studentDiv,
                IssueDetails: formattedIssueDetails,
            });
        }

        // Handling history
        const existingHistoryRecord = await StudentsIssueBooksHistory.findOne({ sid });

        if (existingHistoryRecord) {
            const newHistoryBooks = formattedIssueDetails.filter((newBook: any) =>
                !existingHistoryRecord.IssueDetails.some((existingBook: any) => existingBook.bookNo === newBook.bookNo)
            );

            existingHistoryRecord.IssueDetails.push(...newHistoryBooks);
            await existingHistoryRecord.save();
        } else {
            await StudentsIssueBooksHistory.create({
                adminObjectId: studentObjectId.adminId,
                studentObjectId: studentObjectId._id,
                sid,
                enrollmentNo,
                studentRollNo,
                studentName,
                studentEmail,
                studentMobileNo,
                studentCource,
                studentYear,
                studentDiv,
                IssueDetails: formattedIssueDetails,
            });
        }

        return NextResponse.json({ success: true, message: 'Book issued successfully' }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, message: 'An error occurred while issuing the book' }, { status: 500 });
    }
}
