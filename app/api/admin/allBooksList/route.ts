import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/app/utils/mongo";
import AddBooksList from "@/lib/models/admin/addBooksList.model";

export async function GET() {
    await connect();

    try {
        const allBooksDeatilsList = await AddBooksList.find({}).lean();
        console.log(allBooksDeatilsList);

        if (!allBooksDeatilsList) {
            return NextResponse.json({ success: false, message: 'All books details not retrieved' }, { status: 404 });
        }
        return NextResponse.json({ success: true, message: 'All books details successfully retrieved', datas: allBooksDeatilsList }, { status: 200 });
    } catch (error) {
        console.error('Error fetching student issue books:', error);
        return NextResponse.json({ success: false, message: 'Error retrieving books details' }, { status: 500 }
        );
    }
}