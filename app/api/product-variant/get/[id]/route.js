
import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseconnection";
import { catchError,  response } from "@/lib/helperFunction";
import MediaModel from "@/models/Media.model";
import ProductVariantModel from "@/models/productVariant.model";
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
        
        const getProductVariant = await ProductVariantModel.findOne(filter).populate('media','_id secure_url').lean()

        if (!getProductVariant) {
            return response(false, 404, 'product variant not found')
        }

        return response(true, 200, 'data fatched', getProductVariant)

    } catch (error) {
        return catchError(error)

    }
}