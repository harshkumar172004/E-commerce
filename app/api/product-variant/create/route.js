import { isAuthenticated } from "@/lib/authentication"
import { connectDB } from "@/lib/databaseconnection"
import { catchError, response } from "@/lib/helperFunction"
import { zodSchema } from "@/lib/zodSchema"
import ProductVariantModel from "@/models/productVariant.model"
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
       product: true,
        sku: true,
        color: true,
        size: true,
        mrp: true,
        sellingPrice: true,
        discountPercentage: true,
        media:true,
    })

        const validate = schema.safeParse(payload)
        if (!validate.success) {
            return response(false, 400, 'Invalid or missing field', validate.error)
        }

        // const { name, slug } = validate.data

        const variantData = validate.data

        const newProductVariant = new ProductVariantModel({
            product:variantData.product,
            color:variantData.color,
            size:variantData.size,
            sku:variantData.sku,
            mrp: variantData.mrp,
            sellingPrice: variantData.sellingPrice,
            discountPercentage: variantData.discountPercentage,
            media: variantData.media,
        })

        await newProductVariant.save()
        return response(true, 200, 'product Variant added successfully')
    } catch (error) {
        return catchError(error)
    }
}