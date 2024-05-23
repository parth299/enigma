import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcryptjs from 'bcryptjs'
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { NextRequest, NextResponse } from "next/server";

export async function POST(){

}