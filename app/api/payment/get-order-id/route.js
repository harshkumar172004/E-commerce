import { connectDB } from "@/lib/databaseconnection";
import { catchError, response } from "@/lib/helperFunction";
import { zodSchema } from "@/lib/zodSchema";
import Razorpay from "razorpay";

export async function POST(request) {
    try {
        await connectDB()
        const payload = await request.json()
        const schema = zodSchema.pick({
            amount: true,
        })

        const validate = schema.safeParse(payload)

        if (!validate.success) {
            return response(false, 400, 'Invalid or missing field', validate.error)
        }

        const { amount } = validate.data

        
        const razInstance = new Razorpay({
            key_id:process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            key_secret:process.env.RAZORPAY_KEY_SECRET
        })

        const razOption = {
            amount: Number(amount)*100,
            currency:'INR',
        }

        const orderDetail = await razInstance.orders.create(razOption)
        const order_id = orderDetail.id

        return response(true,200,'Oreder id genrated',order_id)

    } catch (error) {
        return catchError(error)
    }
}