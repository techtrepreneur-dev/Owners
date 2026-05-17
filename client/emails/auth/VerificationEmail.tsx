import { Html, Head, Body, Button, Container, Text, Section } from "@react-email/components";

const VerificationEmail = ({ firstName, token, email }: { firstName: string, token: string, email: string }) => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // Using a template string for the href
    const verificationUrl = `${baseUrl}/verify-email?token=${token}&email=${email}`;
    return (
        <Html>
            <Head />
            <Body style={{ padding: "40px 0" }}>
                <Container style={{ borderRadius: "10px" }}>
                    <Section style={{ background: "#111113", padding: "0 40px", borderTopLeftRadius: "10px", borderTopRightRadius: "10px" }}>
                        <Text style={{ color: "white", textAlign: "center", letterSpacing: "2px", fontWeight: "600", fontFamily: "sans-serif" }}> <span style={{ fontSize: "32px" }}>O</span><span style={{ fontSize: "24px" }}>w</span><span style={{ fontSize: "20px" }}>n</span><span style={{ color: "#F8D34F" }}>ers</span></Text>
                    </Section>
                    <Section style={{ background: "#fcfcfc", padding: "20px", fontFamily: "sans-serif" }}>
                        <Text style={{ fontSize: "16px", fontWeight: "bold", letterSpacing: "1px" }}>Hey {firstName}!</Text>
                        <Text style={{ fontSize: "14px", margin: "0px" }}>Welcome to Owners, thank you for registering with us. Click on the button below to verify your email to login.</Text>

                        <Button href={verificationUrl} style={{ marginTop: "10px", background: "#27272a", color: "white", padding: "10px", borderRadius: "3px", fontSize: "14px" }}>Verify Email</Button>
                        <Text style={{ fontSize: "12px", color: "#8898aa", marginTop: "20px" }}>This link expires in 10 minutes.</Text>
                    </Section>
                </Container>
            </Body>
        </Html >
    )
};

export default VerificationEmail
