import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import UserModel from "@/models/User";
import dbConnect from "@/lib/dbConnect";
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "email", type: "text" },
                password: { label: "password", type: "password" }
            },
            async authorize(credentials: any): Promise<any> {
                await dbConnect();

                try {
                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials.email },
                            { username: credentials.username }
                        ]
                    });

                    if (!user) {
                        throw new Error("No such user exists with that email or username");
                    }
                    if (!user.isVerified) {
                        throw new Error("User is not verified! Please verify your account");
                    }

                    const isUserCorrect = await bcrypt.compare(credentials.password, user.password);
                    
                    if (isUserCorrect) {
                        // Return only necessary user fields
                        return user;
                    } else {
                        throw new Error("Incorrect password! Please enter the correct password");
                    }

                } catch (err: any) {
                    throw new Error(err.message);
                }
            }
        })
    ],
    pages: {
        signIn: '/sign-in'
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id;
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
                session.user.username = token.username;
            }
            return session;
        },
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET
};
