import { isAuthenticated } from "@/lib/authentication"
import { connectDB } from "@/lib/databaseconnection"
import { catchError } from "@/lib/helperFunction"
import OrderModel from "@/models/Order.model"
import { Code } from "lucide-react"
import { NextResponse } from "next/server"

export async function GET(request) {
    try {
        const auth = await isAuthenticated("admin")
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized')
        }

        await connectDB()

        const searchParams = request.nextUrl.searchParams

        // extrect query parameters 
        const start = parseInt(searchParams.get('start') || 0, 10)
        const size = parseInt(searchParams.get('size') || 0, 10)
        const filters = JSON.parse(searchParams.get('filters') || "[]")
        const globalFilter = searchParams.get('globalFilter') || ''
        const sorting = JSON.parse(searchParams.get('sorting') || "[]")
        const deleteType = searchParams.get('deleteType')

        // build match query 
        let matchQuery = {}
        if (deleteType === 'SD') {
            matchQuery = { deletedAt: null }
        } else if (deleteType === 'PD') {
            matchQuery = { deletedAt: { $ne: null } }
        }

        //globel search 
        if (globalFilter) {
            matchQuery['$or'] = [
                { order_id: { $regex: globalFilter, $options: 'i' } },
                { payment_id: { $regex: globalFilter, $options: 'i' } },
                { name: { $regex: globalFilter, $options: 'i' } },
                { email: { $regex: globalFilter, $options: 'i' } },
                { mobile: { $regex: globalFilter, $options: 'i' } },
                { country: { $regex: globalFilter, $options: 'i' } },
                { state: { $regex: globalFilter, $options: 'i' } },
                { city: { $regex: globalFilter, $options: 'i' } },
                { pincode: { $regex: globalFilter, $options: 'i' } },
                { subtotal: { $regex: globalFilter, $options: 'i' } },
                { discount: { $regex: globalFilter, $options: 'i' } },
                { couponDiscount: { $regex: globalFilter, $options: 'i' } },
                { totalAmount: { $regex: globalFilter, $options: 'i' } },
                { status: { $regex: globalFilter, $options: 'i' } },

            ]
        }

        // column filteration 

        filters.forEach(filter => {
            matchQuery[filter.id] = { $regex: filter.value, $options: 'i' }
        });

        // sorting 
        let sortQuery = {}
        sorting.forEach(sort => {
            sortQuery[sort.id] = sort.desc ? -1 : 1
        });

        // aggragate pipeline 

        const aggregatePipeline = [

            { $match: matchQuery },
            { $sort: Object.keys(sortQuery).length ? sortQuery : { createdAt: -1 } },
            { $skip: start },
            { $limit: size },
            // {
            //     $project: {
            //         _id: 1,
            //         code: 1,
            //         discountPercentage: 1,
            //         minShoppingAmount: 1,
            //         validity: 1,
            //         createdAt: 1,
            //         updatedAt: 1,
            //         deletedAt: 1,
            //     }
            // },
        ]

        // Execute Query 

        const getOrders = await OrderModel.aggregate(aggregatePipeline)

        // get totalRowCount 
        const totalRowCount = await OrderModel.countDocuments(matchQuery)

        return NextResponse.json({
            success: true,
            data: getOrders,
            meta: {
                totalRowCount,
            }
        })


    } catch (error) {
        return catchError(error)
    }
}