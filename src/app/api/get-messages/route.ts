import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { User } from "next-auth";
import mongoose from "mongoose";

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
    
    // We are writing the aggregation pipeline therefore it is needed to create the objectId instead of simply writing 
    // const userId = user._id;

    const userId = new mongoose.Types.ObjectId(user._id);

    try {

        const user = await UserModel.aggregate([
            { $match: {id: userId} },
            { $unwind: "$messages" },
            { $sort: {'messages.createdAt': -1} },
            { $group: {_id: "$_id", messages: {$push: '$messages'}} }
        ]);

        if(!user || user.length === 0) {
            return Response.json({
                success: false,
                message: "User not found"
            }, {status: 401}); 
        }

        // Messages are aggregated into the user
        return Response.json({
            success: true,
            messages: user[0].messages
        }, {status: 200});
        
    } catch (error) {
        return Response.json({
            success: false,
            message: "Failed to get the accept message field"
        }, {status: 500});
    }
}