import { connectDB } from "@/lib/databaseconnection";
import UserModel from "@/models/User.model";
import { zodSchema } from "@/lib/zodSchema";
import { sendMail } from "@/lib/sendMail";
import { emailVerificationLink } from "@/email/emailVarificationLink";
import { catchError, response } from "@/lib/helperFunction";
import { SignJWT } from 'jose';
// import { response } from "@/lib/helperFunction";

export async function POST(request) {
    try {
        await connectDB();
        const validationSchema = zodSchema.pick({
            name: true, email: true, password: true
        })
        const payload = await request.json();

        const validatedData = validationSchema.safeParse(payload);
        if (!validatedData.success) {
            return response(false, 401, 'Invalid or missing input field', validatedData.error);
        }

        // Validate input
        const { name, email, password } = validatedData.data;

        // Check if user already exists
        const checkUser = await UserModel.exists({ email });
        if (checkUser) {
            return response(true, 409, 'User already exists');
        }

        // Create new user
        const newRagistration = new UserModel({ name, email, password});
        await newRagistration.save();

        const secret = new TextEncoder().encode(process.env.SECRET_KEY);
        const token = await new SignJWT({ userId: newRagistration._id.toString() })
            .setIssuedAt()
            .setExpirationTime('1h')
            .setProtectedHeader({ alg: 'HS256' })
            .sign(secret);

        await sendMail(
            'Email Verification',
            email,
            emailVerificationLink(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email/${token}`),
        );

        return response(true, 200, 'User registered successfully , varification link sent on your mail', {
            
        });



        // return new Response(JSON.stringify({ message: 'User registered su ccessfully' }), { status: 201 });
    } catch (error) {

        catchError(error)
    }
}