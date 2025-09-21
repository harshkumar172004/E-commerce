import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseconnection";
import { catchError, response } from "@/lib/helperFunction";
import CategoryModel from "@/models/Category.model";
import OrderModel from "@/models/Order.model";
import productModel from "@/models/product.model";
import UserModel from "@/models/User.model";
// import { promise } from "zod";

export async function GET() {
    try {
        const auth = await isAuthenticated("admin");
        if (!auth.isAuth) {
            return response(false, 403, "Unauthorized");
        }

        await connectDB()

        const [category, product, customer,order] = await Promise.all([
            CategoryModel.countDocuments({ deletedAt: null }),
            productModel.countDocuments({ deletedAt: null }),
            UserModel.countDocuments({ deletedAt: null }),
            OrderModel.countDocuments({ deletedAt: null }),
        ])

        return response(true, 200, 'Dashboard count', {
            category, product, customer,order
        })
    } catch (error) {
        return catchError(error)
    }
}