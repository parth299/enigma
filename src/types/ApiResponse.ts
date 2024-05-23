import { Message } from "@/models/Message";

export interface ApiResponse{
    success: Boolean;
    message: string;
    isAcceptingMessages?: Boolean
    messages?: Array<Message>
}