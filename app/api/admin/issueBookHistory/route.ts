import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/app/utils/mongo";
import StudentsIssueBooks from "@/lib/models/admin/studentsIssueBook.model";

export async function GET() {

    await connect()

    try {
        const isPresentStudentsIssueBooks = await StudentsIssueBooks.find({})

        const StudentsIssueBooksDetails = []
        for (const data of isPresentStudentsIssueBooks) {
            const datas = data
            StudentsIssueBooksDetails.push(datas)
        }
        return NextResponse.json({ success: true, message: 'Student issue book history successfully shows', datas: StudentsIssueBooksDetails }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Method not found' }, { status: 500 })
    }
}