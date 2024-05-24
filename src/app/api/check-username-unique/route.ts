import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import {z} from 'zod';
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    username: usernameValidation
});

export async function GET(request: Request) {
    await dbConnect();
    //localhost:3000/api/cuu?username=parth

    try {
        const {searchParams} = new URL(request.url);

        const queryParam = {
            username: searchParams.get('username')
        }

        // Validate using ZOD
        const result = UsernameQuerySchema.safeParse(queryParam);

        // Check this result
        console.log(result);

        if(!result.success) {
            const usernameErrors = result.error.format().username?._errors || [];
            return Response.json({
                success: false,
                message: usernameErrors?.length > 0 ? usernameErrors.join(', ') : "Invalid query parameter"
            }, {
                status: 500
            });
        }

        const {username} = result.data;
        
        const existingVerifiedUser = await UserModel.findOne({ username, isVerified: true })

        if(existingVerifiedUser) {
            return Response.json({
                success: false,
                message: "Existing username is already taken"
            }, {
                status: 400
            });
        }
        // Username is unique and can be taken
        return Response.json({
            success: false,
            message: "Username is available"
        }, {
            status: 200
        });

    } catch (error) {
        console.error("Error checking username ", error);
        return Response.json({
            message: "Error checking username",
            success: false
        }, {status: 500}
        )
    }
}