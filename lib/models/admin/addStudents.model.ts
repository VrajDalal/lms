import mongoose from "mongoose";

interface IAddStudentsList {
    adminId: mongoose.Schema.Types.ObjectId,
    sid: number,
    enrollmentNo: string,
    studentRollNo: number,
    studentName: string,
    studentEmail: string,
    studentMobileNo: number,
    studentCource: string,
    studentYear: string,
    studentDiv: string,
    createdAt: Date
}

const AddStudentsListSchema = new mongoose.Schema<IAddStudentsList>({
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
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
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

const AddStudentsList = mongoose.models.AddStudentsList || mongoose.model<IAddStudentsList>('AddStudentsList', AddStudentsListSchema)

export default AddStudentsList