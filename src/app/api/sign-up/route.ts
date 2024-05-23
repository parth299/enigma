import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcryptjs from 'bcryptjs'
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function POST(request: Request){
    await dbConnect();

    try {
        const {username, email, password} = await request.json();

        //Register the user in he database according to the conditions of defined algorithm

        //this will return the user with the username and it would also be a verified user
        const existingUserVerifiedByUsername = await User.findOne({
            username,
            isVerified: true
        });

        if(existingUserVerifiedByUsername) {
             
        }


    } catch (error) {
        console.error("Something went wrong in signup process :: ", error);
        return Response.json({
            success: false,
            message: "Error while registering the user"
        }, {
            status: 500 //internal server error
        })
    }
}