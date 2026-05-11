import { render } from "@react-email/render";
import { transporter } from "../transporter/config.js";
import VerifyEmail from "../../emails/VerificationEmail.js";

interface SendVerifyEmailPayload {
  to: string;
  username: string;
  verificationUrl: string;
}
export async function sendVerifyEmail({
  to,
  username,
  verificationUrl,
}: SendVerifyEmailPayload) {
  const subject = `Verify Your SecureStack Account`;
  const html = await render(VerifyEmail({ username, verificationUrl }));
  return transporter.sendMail({
    from: `SecureStack <${process.env.SMTP_USER}>`,
    subject,
    to,
    html,
  });
}
