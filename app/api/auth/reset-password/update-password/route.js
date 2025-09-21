import { connectDB } from "@/lib/databaseconnection";
import { catchError, response } from "@/lib/helperFunction";
import { zodSchema } from "@/lib/zodSchema";
import UserModel from "@/models/User.model";

export async function PUT(request) {

    try {
        await connectDB()

        const payload = await request.json()
        const validationSchema = zodSchema.pick({
            email:true,password:true
        })

        const validatedData = validationSchema.safeParse(payload)

        if (!validatedData.success) {
            return response(false,401,'Inavlid or missing input field',validatedData.error);
        }

        const {email , password}=validatedData.data

        const getUser = await UserModel.findOne({deletedAt:null,email}).select("+password")

        if (!getUser) {
             return response(false,404,'User not found');
        }
        getUser.password = password
        await getUser.save()
        return response(true,200,'password updated successfully');

        // return new Response(JSON.stringify({ message: 'Password updated successfully' }), { status: 200 });
    } catch (error) {
       catchError(error)
    }
}