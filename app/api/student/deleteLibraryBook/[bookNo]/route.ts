import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/app/utils/mongo";
import AddBooksList from "@/lib/models/admin/addBooksList.model";

export async function DELETE(req: NextRequest, { params }: { params: { bookNo: string } }) {

    const { bookNo } = params

    if (!bookNo) {
        return NextResponse.json({ success: false, message: 'Invaild bookNo' }, { status: 409 })
    }

    await connect()

    try {
        const isPresentBook = await AddBooksList.findOne({ bookNo })

        if (!isPresentBook) {
            return NextResponse.json({ success: false, message: 'Book not found' }, { status: 404 })
        }

        await AddBooksList.deleteOne({ bookNo })
        return NextResponse.json({ success: true, message: 'Book deleted successfully',isPresentBook }, { status: 200 })
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}