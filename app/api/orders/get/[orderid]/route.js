import { connectDB } from "@/lib/databaseconnection";
import { catchError, response } from "@/lib/helperFunction";
import MediaModel from "@/models/Media.model";
import OrderModel from "@/models/Order.model";
import productModel from "@/models/product.model";
import ProductVariantModel from "@/models/productVariant.model";
export async function GET(request, { params }) {
    try {
        await connectDB()
        const grtParams = await params
        const orderid = grtParams.orderid

        if (!orderid) {
            return response(false, 400, 'Order not found')
        }

        const orderData = await OrderModel.findOne({ order_id: orderid }).populate('products.productId', 'name slug').populate({ path: 'products.variantId', populate: { path: 'media' } }).lean()

        if (!orderData) {
            return response(false, 400, 'Order data not found')
        }

        return response(true, 200, 'Order found', orderData)
    } catch (error) {
        return catchError(error)
    }
}