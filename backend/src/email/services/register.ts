import { render } from "@react-email/render";
import VerifyEmail from "../../../emails/VerificationEmail";
import { transporter } from "../transporter/config";

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
