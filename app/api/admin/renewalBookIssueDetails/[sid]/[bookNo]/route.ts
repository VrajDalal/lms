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

        // Log incoming update data and bookNo for verification
        console.log("Incoming update data:", updateData);
        console.log("Book number being updated:", bookNo);

        if (!Object.keys(updateData).length) {
            return NextResponse.json({ success: false, message: 'No valid fields provided for update' }, { status: 400 });
        }

        // Check if the book exists
        const isPresentBook = await AddBooksList.findOne({ bookNo });
        console.log("Existing book details:", isPresentBook); // Debug line
        if (!isPresentBook) {
            return NextResponse.json({ success: false, message: 'Book not found' }, { status: 404 });
        }

        // Create update fields, ensuring only valid fields are included
        const updateFields = {
            ...(updateData.bookNo && { bookNo: updateData.bookNo }),
            ...(updateData.bookName && { bookName: updateData.bookName }),
            ...(updateData.bookAuthorName && { bookAuthorName: updateData.bookAuthorName }),
            ...(updateData.bookPublisherName && { bookPublisherName: updateData.bookPublisherName }),
            ...(updateData.bookQty && { bookQty: updateData.bookQty }),
            updatedAt: new Date() // Force an update by including a timestamp
        };

        // Perform the update
        const updateLibraryBookDetails = await AddBooksList.updateOne(
            { bookNo },
            { $set: updateFields }
        );

        // Log the update response details
        console.log("Update response:", updateLibraryBookDetails);

        if (!updateLibraryBookDetails.acknowledged || updateLibraryBookDetails.modifiedCount === 0) {
            return NextResponse.json({
                success: false,
                message: 'Failed to update book details or no changes were detected'
            }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: 'Book details updated successfully',
            updateLibraryBookDetails
        }, { status: 200 });
    } catch (error) {
        console.error("Error updating book details:", error);
        return NextResponse.json({
            success: false,
            message: 'An error occurred while updating book details'
        }, { status: 500 });
    }
}
