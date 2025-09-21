
import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseconnection";
import { catchError,  response } from "@/lib/helperFunction";
import productModel from "@/models/product.model";

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

        const getProduct = await productModel.find(filter).select('-media -description').sort({createdAt:-1}).lean()
if (!getProduct) {
            return response(false, 404, 'Data not found')
        }
       
        return response(true, 200, 'data fatched', getProduct)

    } catch (error) {
        return catchError(error)

    }
}