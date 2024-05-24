import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { User } from "next-auth";

export async function POST(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);

    const user: User = session?.user as User
    if(!session || !session?.user) {
        return Response.json({
            success: false,
            message: "Please authenticate your account"
        }, {status: 400})
    }
    
    const userId = user._id;
    const {acceptMessages} = await request.json()

    try {
        
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId, 
            {isAcceptingMessage: acceptMessages},
            {new: true}
        );

        if(!updatedUser) {
            return Response.json({
                success: false,
                message: "Falied to update the accept message field"
            }, {status: 401})
        }
        
        return Response.json({
            success: true,
            message: "Accept Messages field updated successfully",
            updatedUser
        }, {status: 200})


    } catch (error) {
        console.log("Falied to update the accept message field :: ", error);
        return Response.json({
            success: false,
            message: "Falied to update the accept message field"
        }, {status: 500})
    }
}

export async function GET(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);

    const user: User = session?.user as User
    if(!session || !session?.user) {
        return Response.json({
            success: false,
            message: "Please authenticate your account"
        }, {status: 400})
    }
    
    const userId = user._id;
    
    try {
        const userAcceptMessageORNot = await UserModel.findById(userId);

        if(!userAcceptMessageORNot) {
            return Response.json({
                success: false,
                message: "Falied to find the user"
            }, {status: 404})
        }
        else {
            // User is found
            return Response.json({
                success: true,
                isAcceptingMessages: userAcceptMessageORNot.isAcceptingMessage
            }, {status: 200});
        }
    } catch (error) {
        return Response.json({
            success: false,
            message: "Failed to get the accept message feild"
        }, {status: 500});
    }
}
