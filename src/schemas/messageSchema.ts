import {z} from 'zod'

export const messageSchema = z.object({
    content: z.string().min(10, {message: "content must be at least 10 characters long"})
    .max(300, "content must be less than 300 characters"),
    createdAt: z.date()
})