import { connectDB } from "@/lib/databaseconnection";
import { catchError, response } from "@/lib/helperFunction";
// import { jwtVerify } from 'jose';
import { SignJWT } from 'jose';
// import { isValidObjectId } from "mongoose";
// import { isValid } from "zod";
import UserModel from "@/models/User.model";
// import { emailVerificationLink } from "@/email/emailVarificationLink";
import { zodSchema } from "@/lib/zodSchema";
import { cookies } from "next/headers";
import OtpModel from "@/models/Otp.model";

export async function POST(request) {
    try {
        await connectDB()
        const payload = await request.json()
        const validationSchema = zodSchema.pick({
            otp: true, email: true
        })

        const validatedData = validationSchema.safeParse(payload)
        if (!validatedData.success) {
            return response(false, 401, 'Invalid or missing input field', validatedData.error)
        }

        const { otp, email } = validatedData.data;

        const getOtpData = await OtpModel.findOne({ email, otp })
        if (!getOtpData) {
            return response(false, 404, 'invalid or expired otp');
        }

        const getUser = await UserModel.findOne({ deletedAt: null, email }).lean()
        if (!getUser) {
            return response(false, 404, 'User not found');
        }



            await getOtpData.deleteOne()

            return response(true,200,'otpvarified')


    } catch (error) {
        return catchError(error)
    }

}