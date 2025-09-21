import { isAuthenticated } from "@/lib/authentication"
import { connectDB } from "@/lib/databaseconnection"
import { catchError,  response } from "@/lib/helperFunction"
import { zodSchema } from "@/lib/zodSchema"
import ReviewModel from "@/models/Review.model"

export async function POST(request) {
    try {
        const auth = await isAuthenticated("user")
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized')
        }
        await connectDB()
        const payload = await request.json()
        const schema = zodSchema.pick({
                product: true,
                userId: true,
                rating:true,
                title:true,
                review:true,
            })

        const validate = schema.safeParse(payload)
        if (!validate.success) {
            return response(false, 400, 'Invalid or missing field', validate.error)
        }

        const { product,userId,rating,title,review } = validate.data

        const newRating = new ReviewModel({
            product:product,
            user:userId,
            rating:rating,
            title:title,
            review:review,
        }) 
        await newRating.save()
        return response(true, 200, 'Thanks for your Review')
    } catch (error) {
        return catchError(error)
    }
}