import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Enigma | Verification Email',
      react: VerificationEmail({username, otp: verifyCode})
    });
    return {success: true, message: "Verification email sent successfully"}
  } catch (error) {
    console.error("Error occured while sending the verification email");
    return {success: false, message: "Could not send verification email"}
  }
}

