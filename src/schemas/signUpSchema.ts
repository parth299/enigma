import {z} from 'zod'

export const usernameValidation = z
    .string()
    .min(3, "username must be at least 3 characters")
    .max(25, "username cannot exceed more than 25 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "username should not contain special characters")

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message: "Please enter a valid email address"}),
    password: z.string().min(8, {message: "password must be at least 8 characters"})
})