import { connectDB } from "@/lib/databaseconnection";
import { catchError,  response } from "@/lib/helperFunction";
import ProductVariantModel from "@/models/productVariant.model";

export async function GET() {
    try {
       

        await connectDB()
        
        const getColor = await ProductVariantModel.distinct('color')

        if (!getColor) {
            return response(false, 404, 'Color not found')
        }

        return response(true, 200, 'data fatched', getColor)

    } catch (error) {
        return catchError(error)

    }
}