
import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseconnection";
import { catchError, response } from "@/lib/helperFunction";
import OrderModel from "@/models/Order.model";

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

        const getOrder = await OrderModel.find(filter).select("-products").sort({ createdAt: -1 }).lean()
        if (!getOrder) {
            return response(false, 404, 'Data not found')
        }

        return response(true, 200, 'data fatched', getOrder)

    } catch (error) {
        return catchError(error)

    }
}