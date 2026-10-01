import { Html, Head, Body, Container, Text, Section } from "@react-email/components";

const ForgetPasswordOtp = ({ firstName, token }: { firstName: string, token: string }) => {

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
                        <Text style={{ fontSize: "14px", margin: "0px" }}>Here is your OTP. Use this to change your password on the platform.<br /> Do not share this code with anybody</Text>
                        <Text style={{ fontSize: "20px", marginTop: "10px", padding: "5px 10px", borderRadius: "3px", background: "#f1f1f2", letterSpacing: "5px", display: "inline-block" }}>{token}</Text>

                        <Text style={{ fontSize: "12px", color: "#8898aa", marginTop: "20px" }}>This code expires in 10 minutes.</Text>
                    </Section>
                </Container>
            </Body>
        </Html >
    )
};

export default ForgetPasswordOtp 
