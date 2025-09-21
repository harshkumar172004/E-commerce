import { isAuthenticated } from "@/lib/authentication"
import { connectDB } from "@/lib/databaseconnection"
import { catchError, response } from "@/lib/helperFunction"
import { zodSchema } from "@/lib/zodSchema"
import couponModel from "@/models/Coupon.model"

export async function POST(request) {
    try {
        const auth = await isAuthenticated("admin")
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized')
        }
        await connectDB()
        const payload = await request.json()
        const schema = zodSchema.pick({
            code: true,
            discountPercentage: true,
            minShoppingAmount: true,
            validity: true,
        })

        const validate = schema.safeParse(payload)
        if (!validate.success) {
            return response(false, 400, 'Invalid or missing field', validate.error)
        }

        // const { name, slug } = validate.data

        const CouponData = validate.data

        const newCoupon = new couponModel({
            code: CouponData.code,
            discountPercentage: CouponData.discountPercentage,
            minShoppingAmount: CouponData.minShoppingAmount,
            validity: CouponData.validity,
        })

        await newCoupon.save()
        return response(true, 200, 'Coupon added successfully')
    } catch (error) {
        return catchError(error)
    }
}