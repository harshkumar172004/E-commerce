import { connectDB } from "@/lib/databaseconnection";
import { catchError, response } from "@/lib/helperFunction";
import { jwtVerify } from 'jose';
import { SignJWT } from 'jose';
import { isValidObjectId } from "mongoose";
import { isValid } from "zod";
import UserModel from "@/models/User.model";
import { emailVerificationLink } from "@/email/emailVarificationLink";

export async function POST(request) {
    try {
        await connectDB()
        const { token } = await request.json();

        if (!token) {
            return response(false, 400, 'missing token');
        }

        const secret = new TextEncoder().encode(process.env.SECRET_KEY);

        const decoded = await jwtVerify(token, secret)
        const userId = decoded.payload.userId;

        if(!isValidObjectId(userId)){
            return response(false, 400, 'Invalid user id ',userId);
        }

        const user = await UserModel.findById(userId);

        if (!user) {
            return response(false, 404, 'User not found');
            
        }

        user.isEmailVarified = true;
        await user.save();

        return response(true,200,'email verified successfully')

    } catch (error) {
        return catchError(error)
    }

}