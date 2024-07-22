import mongoose from "mongoose";

interface IBookIssue {
    bookIssueDate: string,
    bookName: string,
    returnDate: string,
}

interface IStudentsIssueBooks {
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

const StudentsIssueBooksSchema = new mongoose.Schema<IStudentsIssueBooks>({
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

const StudentsIssueBooks = mongoose.models.StudentsIssueBooks || mongoose.model<IStudentsIssueBooks>('StudentsIssueBooks', StudentsIssueBooksSchema)

export default StudentsIssueBooks