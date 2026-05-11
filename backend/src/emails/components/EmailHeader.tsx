import { Img, Section, Text } from "@react-email/components";

export default function EmailHeader() {
  return (
    <Section style={header}>
      <Img
        src="https://dummyimage.com/120x40/000/fff&text=SecureStack"
        width="120"
        height="40"
        alt="Secure Stack"
      />

      <Text style={tagline}>Securely Access your Tasks</Text>
    </Section>
  );
}

const header = {
  textAlign: "center" as const,
  marginBottom: "28px",
};

const tagline = {
  fontSize: "14px",
  color: "#666",
  marginTop: "8px",
  fontWeight: "medium",
};
