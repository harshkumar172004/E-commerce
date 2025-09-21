import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseconnection";
import { catchError, response } from "@/lib/helperFunction";
import OrderModel from "@/models/Order.model";
export async function PUT(request) {
    try {
        await connectDB()
        const auth = await isAuthenticated("admin")
                if (!auth.isAuth) {
                    return response(false, 403, 'Unauthorized')
                }
        const {_id,status} = await request.json()


        if (!_id || !status) {
            return response(false, 400, 'Order is and status not found')
        }

        const orderData = await OrderModel.findById(_id)

        if (!orderData) {
            return response(false, 400, 'Order data not found')
        }

        orderData.status = status
        await orderData.save()

        return response(true, 200, 'Order Status updated successfully', orderData)
    } catch (error) {
        return catchError(error)
    }
}