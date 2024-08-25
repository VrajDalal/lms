import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path"
import { connect } from "@/app/utils/mongo";
import Admin from "@/lib/models/admin/admin.model";
import AddBooksList from "@/lib/models/admin/addBooksList.model";
import * as XLSX from "xlsx"
import jwt from "jsonwebtoken"
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

export async function POST(req: NextRequest) {
    await connect()

    const token = req.cookies.get('adminToken')?.value

    if (!token) {
        return NextResponse.json({ success: false, message: 'unauthorized' }, { status: 401 })
    }

    try {
        const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY || ""
        const decodedToken = jwt.verify(token, SECRET_KEY) as { id: string }

        const data = await req.formData()
        const file = data.get('file') as File
        const adminId = decodedToken.id as string

        const validType = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
        const maxSize = 5 * 1024 * 1024

        if (!validType.includes(file.type)) {
            return NextResponse.json({ error: 'Invalid type file. only XLX and XLSX file are allowed' }, { status: 400 })
        }

        if (file.size > maxSize) {
            return NextResponse.json({ error: 'File size is too large. Maximum size is 5 MB.' }, { status: 400 })
        }

        const dir = path.join(process.cwd(), 'public', 'Books-list', adminId)
        await fs.mkdir(dir, { recursive: true })

        const filePath = path.join(dir, file.name);
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        await fs.writeFile(filePath, uint8Array);

        const workBook = XLSX.read(uint8Array, { type: 'buffer' })
        const sheetName = workBook.SheetNames[0]
        const sheet = workBook.Sheets[sheetName]
        const excelData = XLSX.utils.sheet_to_json<IAddBooksList>(sheet)

        const admin = await Admin.find({ _id: decodedToken.id })
        if (!admin) {
            return NextResponse.json({ success: false, message: 'Admin not found' }, { status: 404 })
        }

        const allBooks = []
        const getAdminId = admin[0]
        console.log(getAdminId);

        for (const row of excelData) {
            const booksList = AddBooksList.create({
                adminId: getAdminId._id,
                bookNo: row.bookNo,
                bookName: row.bookName,
                bookAuthorName: row.bookAuthorName,
                bookPublisherName: row.bookPublisherName,
                bookQty: row.bookQty,
                createdAt: row.createdAt,
            })
            allBooks.push(booksList)
        }

        return NextResponse.json({ success: true, fileUrl: `/Books-list/${adminId}/${file.name}`, allBooks }, { status: 200 })

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }

}