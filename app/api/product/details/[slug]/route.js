
import { isAuthenticated } from "lib/authentication";
import { connectDB } from "lib/databaseconnection";
import { catchError, response } from "lib/helperFunction";
import MediaModel from "models/Media.model";
import productModel from "models/product.model";
import ProductVariantModel from "models/productVariant.model";
import ReviewModel from "models/Review.model";
import { isValidObjectId } from "mongoose";


export async function GET(request, { params }) {
    try {

        await connectDB()

        const getparams = await params
        const slug = getparams.slug
        const searchParams = request.nextUrl.searchParams
        const size = searchParams.get('size')
        const color = searchParams.get('color')

        const filter = {
            deletedAt: null
        }

        if (!slug) {
            return response(false, 404, 'Product not found')
        }

        filter.slug = slug

        //get Product
        const getProduct = await productModel.findOne(filter).populate('media', 'secure_url').lean()
        if (!getProduct) {
            return response(false, 404, 'Product not found')
        }
        const variantFilter = {
            product: getProduct._id
        }
        if (size) {
            variantFilter.size = size
        }
        if (color) {
            variantFilter.color = color
        }

        const variant = await ProductVariantModel.findOne(variantFilter).populate('media', 'secure_url').lean()

        if (!variant) {
            return response(false, 404, 'Product not found')
        }

        const getColor = await ProductVariantModel.distinct('color', { product: getProduct._id })

        const getSize = await ProductVariantModel.aggregate([
            {$match:{product:getProduct._id}},
            { $sort: { _id: 1 } },
            {
                $group: {
                    _id: "$size",
                    first: { $first: "$_id" }
                }
            },
            { $sort: { first: 1 } },
            { $project: { _id: 0, size: "$_id" } }
        ])

 const review = await ReviewModel.countDocuments({product:getProduct._id})

 const productData = {
    product:getProduct,
    variant:variant,
    colors:getColor,
    sizes: getSize.length ? getSize.map(item => item.size) : [],
    reviewCount: review,
 }

 return response(true, 200, 'Product  found',productData)

    } catch (error) {
        return catchError(error)

    }
}