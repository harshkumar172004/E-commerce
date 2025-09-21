
import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseconnection";
import { catchError,  response } from "@/lib/helperFunction";
import couponModel from "@/models/Coupon.model";
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
        
        const getCoupon = await couponModel.findOne(filter).lean()

        if (!getCoupon) {
            return response(false, 404, 'Coupon not found')
        }

        return response(true, 200, 'data fatched', getCoupon)

    } catch (error) {
        return catchError(error)

    }
}