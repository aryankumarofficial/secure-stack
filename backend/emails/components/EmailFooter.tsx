import { Section, Text } from "@react-email/components";

export default function EmailFooter() {
  return (
    <Section style={footer}>
      <Text style={text}>© {new Date().getFullYear()} Secure Stack</Text>

      <Text style={sub}>Securely Manage your Tasks</Text>
    </Section>
  );
}

const footer = {
  textAlign: "center" as const,
  marginTop: "32px",
  borderTop: "1px solid #eee",
  paddingTop: "20px",
};

const text = {
  fontSize: "13px",
  color: "#777",
};

const sub = {
  fontSize: "12px",
  color: "#aaa",
};
