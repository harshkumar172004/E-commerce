import { isAuthenticated } from "@/lib/authentication"
import { connectDB } from "@/lib/databaseconnection"
import { catchError } from "@/lib/helperFunction"
import couponModel from "@/models/Coupon.model"
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
                { code: { $regex: globalFilter, $options: 'i' } },

                {
                    $expr: {
                        $regexMatch: {
                            input: { $toString: "$minShoppingAmount" },
                            regex: globalFilter,
                            options: 'i'
                        }
                    }
                },
                {
                    $expr: {
                        $regexMatch: {
                            input: { $toString: "$discountPercentage" },
                            regex: globalFilter,
                            options: 'i'
                        }
                    }
                }
            ]
        }

        // column filteration 

        filters.forEach(filter => {
            if (filter.id === 'minShoppingAmount' || filter.id === 'discountPercentage') {
                matchQuery[filter.id] = Number(filter.value)
            } else if (filter.id === 'validity') {
                matchQuery[filter.id] = new Date(filter.value)
            }
            else {
                matchQuery[filter.id] = { $regex: filter.value, $options: 'i' }
            }
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
            {
                $project: {
                    _id: 1,
                    code: 1,
                    discountPercentage: 1,
                    minShoppingAmount: 1,
                    validity: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    deletedAt: 1,
                }
            },
        ]

        // Execute Query 

        const getCoupon = await couponModel.aggregate(aggregatePipeline)

        // get totalRowCount 
        const totalRowCount = await couponModel.countDocuments(matchQuery)

        return NextResponse.json({
            success: true,
            data: getCoupon,
            meta: {
                totalRowCount,
            }
        })


    } catch (error) {
        return catchError(error)
    }
}