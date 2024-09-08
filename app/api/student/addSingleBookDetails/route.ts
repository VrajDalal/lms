import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/app/utils/mongo";
import Admin from "@/lib/models/admin/admin.model";
import AddBooksList from "@/lib/models/admin/addBooksList.model";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";

interface IAddSingleBookDestails {
    adminId: mongoose.Schema.Types.ObjectId,
    bookNo: string,
    bookName: string,
    bookAuthorName: string,
    bookPublisherName: string,
    bookQty: number,
    createdAt: Date
}

export async function POST(req: NextRequest) {
    await connect()

    const token = req.cookies.get('adminToken')?.value

    if (!token) {
        return NextResponse.json({ success: false, message: 'unauthorized' }, { status: 401 })
    }

    try {
        const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY || ""
        const decodedToken = jwt.verify(token, SECRET_KEY) as { id: string }

        const admin = await Admin.find({ _id: decodedToken.id })

        if (!admin) {
            return NextResponse.json({ success: false, message: 'Admin not found' }, { status: 404 })
        }

        const getAdminId = admin[0]
        console.log(getAdminId);

        const body = await req.json();
        const { bookNo, bookName, bookAuthorName, bookPublisherName, bookQty } = body;


        if (!bookNo || !bookName || !bookAuthorName || !bookPublisherName || !bookQty) {
            return NextResponse.json({ success: false, message: "All fields are required" }, { status: 400 }
            );
        }


        const singleBookDetails = AddBooksList.create<IAddSingleBookDestails>({
            adminId: getAdminId._id,
            bookNo: bookNo,
            bookName: bookName,
            bookAuthorName: bookAuthorName,
            bookPublisherName: bookPublisherName,
            bookQty: bookQty,
            createdAt: new Date(),
        })

        return NextResponse.json({ success: true, message: 'Single book added successfully', singleBookDetails }, { status: 200 })

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }

}