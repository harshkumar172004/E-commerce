import { otpEmail } from "@/email/otpEmail";
import { connectDB } from "@/lib/databaseconnection";
import { catchError, generateOTP, response } from "@/lib/helperFunction";
import { sendMail } from "@/lib/sendMail";
import { zodSchema } from "@/lib/zodSchema";
import OtpModel from "@/models/Otp.model";
import UserModel from "@/models/User.model";

export async function POST(request){
    try{
        await connectDB()

        const payload = await request.json()
        const validationSchema = zodSchema.pick({email:true})
        const validatedData = validationSchema.safeParse(payload)
        if(!validatedData.success){
            return response(false,401,'Invalid or missing input field',validatedData.error)
        }


        const {email} = validatedData.data
        const getUser = await UserModel.findOne({email})
        if(!getUser){
            return response(false,404,'user not found')
        }


        await OtpModel.deleteMany({email})
        const otp = generateOTP()
        const newOtpData = new OtpModel({
            email,otp
        })

        await newOtpData.save()

        const otpSendStatus = await sendMail('Your login varification code ',email,otpEmail(otp))

        if(!otpSendStatus.success){
            return response(false,400,'Faild to resend otp')
        }
        return response(true,200,'new otp send on your e-mail')
    }
    catch (error){
        return catchError(error)
    }
}