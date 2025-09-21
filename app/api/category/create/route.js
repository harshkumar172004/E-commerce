import { isAuthenticated } from "@/lib/authentication"
import { connectDB } from "@/lib/databaseconnection"
import { catchError,  response } from "@/lib/helperFunction"
import { zodSchema } from "@/lib/zodSchema"
import CategoryModel from "@/models/Category.model"

export async function POST(request) {
    try {
        const auth = await isAuthenticated("admin")
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized')
        }
        await connectDB()
        const payload = await request.json()
        const schema = zodSchema.pick({
            name: true,
            slug: true,
        })

        const validate = schema.safeParse(payload)
        if (!validate.success) {
            return response(false, 400, 'Invalid or missing field', validate.error)
        }

        const { name, slug } = validate.data

        const newCategory = await CategoryModel({
            name, slug
        })

        await newCategory.save()
        return response(true, 200, 'Category created successfully')
    } catch (error) {
        return catchError(error)
    }
}