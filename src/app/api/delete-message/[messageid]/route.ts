import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function DELETE(request: Request, {params}: {params: {messageid: string}}) {
    const messageId = params.messageid;
    await dbConnect();
    //localhost:3000/api/dm/{messageid};
        
    const session = await getServerSession(authOptions);

    const user: User = session?.user as User
    if(!session || !session?.user) {
        return Response.json({
            success: false,
            message: "Please authenticate your account"
        }, {status: 400})
    }

    try {

        const userWithUpdatedMessages = await UserModel.updateOne(
            {_id: user._id},
            {$pull: {messages: {_id: messageId}}}
        );

        if(userWithUpdatedMessages.modifiedCount == 0) {
            //Nothing was modified 
            return Response.json({
                success: false,
                message: "Message could not be deleted"
            }, {status: 404})
        } 

        return Response.json({
            sucess: true,
            message: "Message deleted successfully"
        }, {status: 200});

    } catch (error) {
        return Response.json({
            success: false,
            error: error
        }, {status: 500});
    }
    

}