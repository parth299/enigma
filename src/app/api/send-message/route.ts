import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { Message } from "@/models/Message";

export async function POST(request: Request) {
    await dbConnect();

    const {username, content} = await request.json();

    try {
        const user = await UserModel.findOne(username);

        if(!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, {status: 404});
        }

        // User is found - check whether he/she is accepting messages or not

        if(!user.isAcceptingMessage) {
            return Response.json({
                success: false,
                message: "User is currently not accepting the messages"
            }, {status: 404});
        }

        //User is accepting the messages - send the message(content)

        const newMessage = {content, createdAt: new Date()}

        user.messages.push(newMessage as Message);
        await user.save();

        return Response.json({
            success: true,
            message: `Message sent to ${user?.username} successfully`
        }, {status: 200});

    } catch (error) {
        console.log("Message could not be sent", error);
        return Response.json({
            success: false,
            message: "Message could not be sent"
        }, {status: 500});
    }
}