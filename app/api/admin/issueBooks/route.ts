import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connect } from "@/app/utils/mongo";
import AddStudentsList from "@/lib/models/admin/addStudents.model";
import StudentsIssueBooks from "@/lib/models/admin/studentsIssueBook.model";
import { format, parseISO, isValid } from "date-fns";

export async function POST(req: NextRequest) {
    const body = await req.json()
    const { sid, enrollmentNo, studentRollNo, studentName, studentEmail, studentMobileNo, studentCource, studentYear, studentDiv, IssueDetails } = body

    if (!body) {
        return NextResponse.json({ success: false, message: 'All fields required' }, { status: 409 })
    }

    await connect()

    try {

        const studentObjectId = await AddStudentsList.findOne({ sid })
        console.log(studentObjectId.adminId);

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
            IssueDetails: IssueDetails.map((detail: any) => {
                const issueDate = parseISO(detail.issueDate);
                const returnDate = detail.returnDate ? parseISO(detail.returnDate) : null;

                if (!isValid(issueDate) || (returnDate && !isValid(returnDate))) {
                    throw new Error('Invalid date format');
                }

                return {
                    bookIssueDate: format(issueDate, "dd-MM-yyyy"),
                    bookName: detail.bookName,
                    returnDate: returnDate ? format(returnDate, "dd-MM-yyyy") : "",
                };
            }),
        })
        console.log(studentBookIssueDetails);
        return NextResponse.json({ success: true, message: 'student book issued successfully', studentBookIssueDetails }, { status: 200 })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, message: 'method not found' }, { status: 500 })
    }
}