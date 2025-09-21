import { isAuthenticated } from "@/lib/authentication"
import { connectDB } from "@/lib/databaseconnection"
import { catchError, response } from "@/lib/helperFunction"
import { zodSchema } from "@/lib/zodSchema"
import productModel from "@/models/product.model"
import { encode } from "entities"

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
            category: true,
            mrp: true,
            sellingPrice: true,
            discountPercentage: true,
            description: true,
            media: true
        })

        const validate = schema.safeParse(payload)
        if (!validate.success) {
            return response(false, 400, 'Invalid or missing field', validate.error)
        }

        // const { name, slug } = validate.data

        const productData = validate.data

        const newProduct = new productModel({
            name: productData.name,
            slug: productData.slug,
            category: productData.category,
            mrp: productData.mrp,
            sellingPrice: productData.sellingPrice,
            discountPercentage: productData.discountPercentage,
            description: encode(productData.description),
            media: productData.media,
        })

        await newProduct.save()
        return response(true, 200, 'product added successfully')
    } catch (error) {
        return catchError(error)
    }
}