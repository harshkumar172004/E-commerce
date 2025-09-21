
import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseconnection";
import { catchError,  response } from "@/lib/helperFunction";
import CategoryModel from "@/models/Category.model";
import { isValidObjectId } from "mongoose";

export async function GET(request, { params }) {
    try {
        const auth = await isAuthenticated('admin')
        if (!auth.isAuth) {
            return response(false, 403, "Unauthorized")
        }

        await connectDB()
        const getparams = await params
        const id = getparams.id

        const filter = {
            deletedAt: null
        }

        if (!isValidObjectId(id)) {
            return response(false, 400, 'Invalid object id')
        }

        filter._id = id 
        
        const getCategory = await CategoryModel.findOne(filter).lean()

        if (!getCategory) {
            return response(false, 404, 'category not found')
        }

        return response(true, 200, 'data fatched', getCategory)

    } catch (error) {
        return catchError(error)

    }
}