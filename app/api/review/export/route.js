
import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseconnection";
import { catchError,  response } from "@/lib/helperFunction";
import ReviewModel from "@/models/Review.model";

export async function GET(request) {
    try {
        const auth = await isAuthenticated('admin')
        if (!auth.isAuth) {
            return response(false, 403, "Unauthorized")
        }

        await connectDB()

        const filter = {
            deletedAt: null
        }

        const getReview = await ReviewModel.find(filter).sort({createdAt:-1}).lean()
if (!getReview) {
            return response(false, 404, 'Data not found')
        }
       
        return response(true, 200, 'data fatched', getReview)

    } catch (error) {
        return catchError(error)

    }
}