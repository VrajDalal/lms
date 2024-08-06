import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
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

        const existingRecord = await StudentsIssueBooks.findOne({ sid });

        if (existingRecord) {
            const newBooks = formattedIssueDetails.filter((newBook: any) =>
                !existingRecord.IssueDetails.some((existingBook: any) => existingBook.bookNo === newBook.bookNo)
            );
            existingRecord.IssueDetails.push(...newBooks);
            await existingRecord.save();

            // Update the history collection with the new books
            const existingHistoryRecord = await StudentsIssueBooksHistory.findOne({ sid });
            if (existingHistoryRecord) {
                existingHistoryRecord.IssueDetails.push(...newBooks);
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
                    IssueDetails: newBooks,
                });
            }

            return NextResponse.json({ success: true, message: 'Book issued successfully', studentBookIssueDetails: existingRecord }, { status: 200 });
        } else {
            const studentBookIssueDetails = await StudentsIssueBooks.create({
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

            const studentBookIssueHistoryDetails = await StudentsIssueBooksHistory.create({
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
            return NextResponse.json({ success: true, message: 'Student book issued successfully', studentBookIssueDetails, studentBookIssueHistoryDetails }, { status: 200 });
        }
    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, message: 'An error occurred while issuing the book' }, { status: 500 });
    }
}
