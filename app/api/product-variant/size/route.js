import { connectDB } from "@/lib/databaseconnection";
import { catchError, response } from "@/lib/helperFunction";
import ProductVariantModel from "@/models/productVariant.model";

export async function GET() {
    try {


        await connectDB()

        const getSize = await ProductVariantModel.aggregate([
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

        if (!getSize.length) {
            return response(false, 404, 'Size not found')
        }

        const size = getSize.map(item => item.size)

        return response(true, 200, 'data fatched', size)

    } catch (error) {
        return catchError(error)

    }
}