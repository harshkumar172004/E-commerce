import { connectDB } from "@/lib/databaseconnection";
import { catchError, response } from "@/lib/helperFunction";
import { zodSchema } from "@/lib/zodSchema";
import couponModel from "@/models/Coupon.model";

export async function POST(request) {
    try {
        await connectDB()
        const payload = await request.json()
        const schema = zodSchema.pick({
            code: true,
            minShoppingAmount: true,
        
          })

          const validate = schema.safeParse(payload)
          if(!validate.success){
            return response(false,400,'Messing or invalid data',validate.error)
          }

          const {code,minShoppingAmount} = validate.data

          const couponData = await couponModel.findOne({code}).lean()
          if(!couponData){
            return response(false,400,'Invalid or expired coupon code')
          }

          if(new Date()> couponData.validity){
            return response(false,400,'Coupon is Expired')
          }

          if(minShoppingAmount< couponData.minShoppingAmount){
            return response(false,400,'copuon is not applied')
          }

          return response(true,200,'Coupon applied successfully',{discountPercentage: couponData.discountPercentage})

    } catch (error) {
        return catchError(error)
    }
    
}