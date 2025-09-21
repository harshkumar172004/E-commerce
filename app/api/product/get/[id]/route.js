
import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseconnection";
import { catchError,  response } from "@/lib/helperFunction";
import MediaModel from "@/models/Media.model";
import productModel from "@/models/product.model";
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
        
        const getProduct = await productModel.findOne(filter).populate('media','_id secure_url').lean()

        if (!getProduct) {
            return response(false, 404, 'product not found')
        }

        return response(true, 200, 'data fatched', getProduct)

    } catch (error) {
        return catchError(error)

    }
}