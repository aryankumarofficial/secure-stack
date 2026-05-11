import { Html, Head, Body, Container, Preview } from "@react-email/components";
import EmailHeader from "./EmailHeader.js";
import EmailFooter from "./EmailFooter.js";

interface EmailLayoutProps {
  children: React.ReactNode;
  preview: string;
}

export default function EmailLayout({ children, preview }: EmailLayoutProps) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          <EmailHeader />
          <div style={content}>{children}</div>
          <EmailFooter />
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f4f6fb",
  padding: "40px 0",
  fontFamily:
    "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
};

const container = {
  backgroundColor: "#ffffff",
  padding: "40px 32px",
  borderRadius: "16px",
  maxWidth: "600px",
  margin: "0 auto",
  boxShadow: "0 8px 30px rgba(0,0,0,0.04)",
  border: "1px solid #eaeaea",
};

const content = {
  padding: "24px 0",
  color: "#333333",
  fontSize: "16px",
  lineHeight: "26px",
};
