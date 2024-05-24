import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";

export async function POST(request: Request) {
    await dbConnect();

    try {
        
        const {username, code} = await request.json();

        const decodedUsername = decodeURIComponent(username);
        const user = await UserModel.findOne({
            username: decodedUsername
        });

        if(!user) {
            return Response.json({
                success: false,
                message: "User does not exist"
            }, {status: 400});
        }

        const isCodeCorrect = code === user?.verifyCode;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

        if(isCodeCorrect && isCodeNotExpired) {
            // Verify the user
            user.isVerified = true;
            await user.save();
            return Response.json({
                success: true,
                message: "User verified successfully"
            },{status: 200});
        }
        else if(!isCodeNotExpired) {
            // Send verification code again
            return Response.json({
                success: false,
                message: "Please sign up again - verification code is expired"
            },{status: 400}); 
        } else {
            // User verifycode is expired and also verifycode is wrong
            return Response.json({
                success: false,
                message: "Please enter correct verification code"
            },{status: 400}); 
        }

    } catch (error) {
        console.log("Error while verifying user ", error);
        return Response.json({
            success: false,
            message: "Error verifying user"
        }, {
            status: 500
        })
    }
}