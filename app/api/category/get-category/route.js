import { connectDB } from "@/lib/databaseconnection";
import { catchError,  response } from "@/lib/helperFunction";
import CategoryModel from "@/models/Category.model";

export async function GET() {
    try {
       

        await connectDB()
        
        const getCategory = await CategoryModel.find({deletedAt: null}).lean()

        if (!getCategory) {
            return response(false, 404, 'category not found')
        }

        return response(true, 200, 'data fatched', getCategory)

    } catch (error) {
        return catchError(error)

    }
}