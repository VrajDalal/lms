import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/app/utils/mongo";
import AddBooksList from "@/lib/models/admin/addBooksList.model";

interface IAvailableBookDetails {
    bookNo: string;
    bookName: string;
    bookAuthorName: string;
    bookPublisherName: string;
    bookQty: number;
    createdAt: Date;
}

export async function PATCH(req: NextRequest, { params }: { params: { bookNo: string } }) {
    const { bookNo } = params;

    if (!bookNo) {
        return NextResponse.json({ success: false, message: 'Invalid bookNo' }, { status: 409 });
    }

    await connect();

    try {
        const body = await req.json();

        const updateData: Partial<IAvailableBookDetails> = body;

        if (!Object.keys(updateData).length) {
            return NextResponse.json({ success: false, message: 'No valid fields provided for update' }, { status: 400 });
        }

        const isPresentBook = await AddBooksList.findOne({ bookNo });
        if (!isPresentBook) {
            return NextResponse.json({ success: false, message: 'Book not found' }, { status: 404 });
        }

        const updateFields = {
            ...(updateData.bookNo && { bookNo: updateData.bookNo }),
            ...(updateData.bookName && { bookName: updateData.bookName }),
            ...(updateData.bookAuthorName && { bookAuthorName: updateData.bookAuthorName }),
            ...(updateData.bookPublisherName && { bookPublisherName: updateData.bookPublisherName }),
            ...(updateData.bookQty && { bookQty: updateData.bookQty }),
            updatedAt: new Date()
        };

        const updateLibraryBookDetails = await AddBooksList.updateOne(
            { bookNo },
            { $set: updateFields }
        );

        if (!updateLibraryBookDetails.acknowledged || updateLibraryBookDetails.modifiedCount === 0) {
            return NextResponse.json({ success: false, message: 'Failed to update book details or no changes were detected' }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'Book details updated successfully' }, { status: 200 });
    } catch (error) {
        console.error("Error updating book details:", error);
        return NextResponse.json({ success: false, message: 'An error occurred while updating book details' }, { status: 500 });
    }
}