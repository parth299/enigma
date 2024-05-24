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
             return Response.json({
                success: false,
                message: "User with the username already exists"
             }, {status: 400})
        }

        const existingUserByEmail = await User.findOne({email});
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if(existingUserByEmail) {
            //User exists by that email already
            if(existingUserByEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: "User with the username already exists"
                 }, {status: 400})
            }
            else {
                //User exists by that email but is not verified
                const hashedPassword = await bcryptjs.hash(password, 10);

                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
            }
        }
        else {
            //User with the email does not already exists, so create and save one

            // create the hashed password.
            const hashedPassword = await bcryptjs.hash(password, 10);

            // create the expiry date for the verifyCode/otp.
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 3600000);

            const newUser = new User({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: []
            });
            await newUser.save();
        }

        const emailResponse = await sendVerificationEmail(
            email, 
            username, 
            verifyCode
        )

        if(!emailResponse.success){
            return Response.json({
                message: emailResponse.message,
                success: false
            }, {status: 500})
        }

        return Response.json({
            message: "User is registered successfully",
            success: true
        }, {status: 200})


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