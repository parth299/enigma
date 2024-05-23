import {z} from 'zod';

export const verifySchema = z.object({
    verifyCode: z.string().min(6, {message: "verification code must be at least 6 digits"})
})