import { emailVerificationLink } from "@/email/emailVarificationLink";
import { otpEmail } from "@/email/otpEmail";
import { connectDB } from "@/lib/databaseconnection";
import { catchError, generateOTP, response } from "@/lib/helperFunction";
import { sendMail } from "@/lib/sendMail";
import { zodSchema } from "@/lib/zodSchema";
import OtpModel from "@/models/Otp.model";
import UserModel from "@/models/User.model";
import { SignJWT } from "jose";
import { z } from "zod";

export async function POST(request) {
    try {
        await connectDB();

        const payload = await request.json();
        const validationSchema = zodSchema.pick({
            email: true,
        }).extend({
            password: z.string()
        })

        const vailidatedData = validationSchema.safeParse(payload)
        if (!vailidatedData.success) {
            return response(false, 401, 'Invalid or missing input Field', vailidatedData.error);

        }

        const { email, password } = vailidatedData.data;

        const getUser = await UserModel.findOne({ deletedAt: null, email }).select("+password");
        if (!getUser) {
            return response(false, 400, 'Invalid email or password');
        }

        if (!getUser.isEmailVarified) {
            const secret = new TextEncoder().encode(process.env.SECRET_KEY);
            const token = await new SignJWT({ userId: getUser._id.toString() })
                .setIssuedAt()
                .setExpirationTime('1h')
                .setProtectedHeader({ alg: 'HS256' })
                .sign(secret);

            await sendMail(
                'Email Verification',
                email,
                emailVerificationLink(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email/${token}`),
            );

            return response(false, 401, 'Please verify your email before logging in. We set you a varification link to your registered mail');
        }

        const isPasswordVerified = await getUser.comparePassword(password);
        if (!isPasswordVerified) {
            return response(false, 400, 'Invalid email or password');
        }
        //OTP 

        await OtpModel.deleteMany({ email }); // Delete any existing OTPs for the user

        const otp = generateOTP()

        const newotpData = new OtpModel({
            email, otp, // OTP valid for 10 minutes
        })

        await newotpData.save();

        const otpEmailStatus = await sendMail('your login verification code', email, otpEmail(otp))
        if (!otpEmailStatus.success) {
            return response(false, 400, 'Failed to send OTP email. Please try again later.');
        }

        return response(true, 200, 'please verify your device');

    } catch (error) {
        return catchError(error);
    }
}