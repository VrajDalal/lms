import mongoose, { Schema } from "mongoose";

interface IAdmin {
    username: string,
    password: string
}

const AdminSchema = new mongoose.Schema<IAdmin>({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
})

const Admin = mongoose.models.Admin || mongoose.model<IAdmin>("Admin", AdminSchema)

export default Admin