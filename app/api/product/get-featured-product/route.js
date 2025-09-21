
import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseconnection";
import { catchError,  response } from "@/lib/helperFunction";
import MediaModel from "@/models/Media.model";
import productModel from "@/models/product.model";
import { isValidObjectId } from "mongoose";


export async function GET() {
    try {       

        await connectDB()
        
        const getProduct = await productModel.find({deleteType:null}).populate('media').limit(8).lean()

        if (!getProduct) {
            return response(false, 404, 'product not found')
        }

        return response(true, 200, 'data fatched', getProduct)

    } catch (error) {
        return catchError(error)

    }
}