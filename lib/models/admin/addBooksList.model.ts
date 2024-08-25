import mongoose from "mongoose";

interface IAddBooksList {
    adminId: mongoose.Schema.Types.ObjectId,
    bookNo: string,
    bookName: string,
    bookAuthorName: string,
    bookPublisherName: string,
    bookQty: number,
    createdAt: Date
}

const AddBooksListSchema = new mongoose.Schema<IAddBooksList>({
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
        required: true
    },
    bookNo: {
        type: String,
        required: true,
        unique: true
    },
    bookName: {
        type: String,
        required: true,
    },
    bookAuthorName: {
        type: String,
        required: true
    },
    bookPublisherName: {
        type: String,
        required: true
    },
    bookQty: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

const AddBooksList = mongoose.models.AddBookList || mongoose.model<IAddBooksList>('AddBookList', AddBooksListSchema)

export default AddBooksList