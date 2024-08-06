import mongoose from "mongoose";

interface IBookIssue {
    bookNo: string
    bookIssueDate: string,
    bookName: string,
    returnDate: string,
}

interface IStudentsIssueBooksHistory {
    adminObjectId: mongoose.Schema.Types.ObjectId,
    studentObjectId: mongoose.Schema.Types.ObjectId,
    sid: number,
    enrollmentNo: string,
    studentRollNo: number,
    studentName: string,
    studentEmail: string,
    studentMobileNo: number,
    studentCource: string,
    studentYear: string,
    studentDiv: string,
    IssueDetails: IBookIssue[],
    createdAt: Date
}

const StudentsIssueBooksHistorySchema = new mongoose.Schema<IStudentsIssueBooksHistory>({
    adminObjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true
    },
    studentObjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'addstudentslist',
        required: true
    },
    sid: {
        type: Number,
        required: true,
        unique: true,
    },
    enrollmentNo: {
        type: String,
        required: true,
        unique: true,
    },
    studentRollNo: {
        type: Number,
        required: true,
    },
    studentName: {
        type: String,
        required: true,
    },
    studentEmail: {
        type: String,
        required: true,
        unique: true,
    },
    studentMobileNo: {
        type: Number,
        required: true,
        unique: true,
    },
    studentCource: {
        type: String,
        required: true,
    },
    studentYear: {
        type: String,
        required: true,
    },
    studentDiv: {
        type: String,
        required: true,
    },
    IssueDetails: [{
        bookNo: {
            type: String,
            required: false,
            unique: true
        },
        bookIssueDate: {
            type: String,
            required: false,
        },
        bookName: {
            type: String,
            required: false,
        },
        returnDate: {
            type: String,
            required: false,
        },
    }],
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

const StudentsIssueBooksHistory = mongoose.models.StudentsIssueBooksHistory || mongoose.model<IStudentsIssueBooksHistory>('StudentsIssueBooksHistory', StudentsIssueBooksHistorySchema)

export default StudentsIssueBooksHistory