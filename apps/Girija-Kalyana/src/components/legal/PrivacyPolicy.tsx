import React from "react";
import { Container, Box, Typography, Paper, Divider } from "@mui/material";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import SEOHead from "../common/SEOHead";

export const PrivacyPolicy: React.FC = () => {
  return (
    <>
      <SEOHead
        title="Privacy Policy (DPDP Act 2023 Compliant)"
        description="Girija Kalyana's official Privacy Policy complying with the Digital Personal Data Protection (DPDP) Act 2023, detailing how we collect, process, and protect your matrimonial data."
        canonicalUrl="https://girijakalyana.com/privacy-policy"
      />
      <Navbar />

      <Box sx={{ backgroundColor: "#FFFDF9", minHeight: "80vh", py: { xs: 4, md: 6 } }}>
        <Container maxWidth="md">
          <Paper
            elevation={2}
            sx={{
              p: { xs: 3, sm: 5 },
              borderRadius: "8px",
              border: "1px solid rgba(217, 119, 6, 0.2)",
            }}
          >
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 700,
                color: "#881337",
                mb: 1,
                fontSize: { xs: "2rem", sm: "2.5rem" },
              }}
            >
              Privacy Policy
            </Typography>

            <Typography variant="subtitle2" sx={{ color: "#D97706", mb: 3 }}>
              Compliant with the Digital Personal Data Protection (DPDP) Act, 2023 | Last Updated: November 2026
            </Typography>

            <Divider sx={{ mb: 4, borderColor: "rgba(136, 19, 55, 0.15)" }} />

            <Box sx={{ "& h2": { color: "#881337", fontSize: "1.3rem", fontWeight: 600, mt: 3, mb: 1.5 }, "& p": { color: "#374151", lineHeight: 1.7, mb: 2 } }}>
              <h2>1. Introduction & Data Fiduciary Details</h2>
              <p>
                Girija Kalyana ("We", "Our", "Us"), operated by Kiran Computers Pvt Ltd / Ornate Pvt Ltd, provides dedicated sacred matrimonial matchmaking services. We act as a Data Fiduciary under the provisions of the Digital Personal Data Protection (DPDP) Act, 2023 of the Republic of India. We are committed to safeguarding the privacy, dignity, and digital rights of our registered members and visitors ("Data Principals" or "Users").
              </p>

              <h2>2. Grounds for Processing Personal Data</h2>
              <p>
                Under Section 6 of the DPDP Act 2023, we process personal data solely on the basis of your freely given, specific, informed, unconditional, and unambiguous consent, or for legitimate legal uses provided by law. You maintain the right to withdraw your consent at any time through your account settings or by contacting our Data Protection Officer.
              </p>

              <h2>3. Categories of Data Collected</h2>
              <p>
                To provide verified matrimonial matchmaking matches, we collect the following categories of data:
              </p>
              <ul>
                <li><strong>Identity Data:</strong> Full legal name, date of birth, gender, marital status, photograph, and optional government ID for identity verification.</li>
                <li><strong>Contact Data:</strong> Verified mobile phone number, email address, physical residence city, state, and country.</li>
                <li><strong>Matrimonial & Community Data:</strong> Religion, caste, sub-caste, mother tongue, gotra, astrological horoscope details, educational qualifications, occupation, and family background.</li>
                <li><strong>Technical & Usage Data:</strong> IP address, device identifier, browser type, login timestamp, and cookie preferences.</li>
              </ul>

              <h2>4. Purpose Limitation & Data Minimization</h2>
              <p>
                Your personal data is collected and processed exclusively for verifying member profiles, recommending compatible matrimonial life partners, facilitating mutual interest requests, preventing identity fraud, and generating transaction receipts for premium memberships. We do not sell, rent, or trade your personal data to commercial third parties for marketing.
              </p>

              <h2>5. Profile Visibility & Information Sharing</h2>
              <p>
                Your matrimonial profile summary is visible to other verified members on the Girija Kalyana platform. Sensitive contact information (mobile numbers, full address, email) is protected and disclosed only when mutual interest is explicitly accepted by both parties or unlocked via premium membership privileges.
              </p>

              <h2>6. Rights of Data Principals (Under DPDP Act 2023)</h2>
              <p>
                As a registered user, you are entitled to the following statutory rights under the DPDP Act 2023:
              </p>
              <ul>
                <li><strong>Right to Access Information:</strong> Request a summary of personal data being processed and identities of processing entities.</li>
                <li><strong>Right to Correction & Erasure:</strong> Correct outdated profile data or request complete deletion of your matrimonial account and associated data.</li>
                <li><strong>Right to Grievance Redressal:</strong> Submit grievances regarding data processing directly to our designated Grievance Officer.</li>
                <li><strong>Right to Nominate:</strong> Nominate an individual who may exercise data rights on your behalf in the event of death or incapacity.</li>
              </ul>

              <h2>7. Data Retention & Security Architecture</h2>
              <p>
                We maintain appropriate technical and organizational measures, including TLS 1.3 encryption in transit, encrypted database storage at rest, restricted administrative access controls, and periodic security audits. Data is retained only for as long as your account remains active or as required by Indian statutory obligations.
              </p>

              <h2>8. Grievance Officer & Contact Information</h2>
              <p>
                In accordance with the DPDP Act 2023 and Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, the contact details of our Grievance Officer are:
              </p>
              <Paper sx={{ p: 2.5, backgroundColor: "rgba(136, 19, 55, 0.04)", border: "1px solid rgba(136, 19, 55, 0.15)", borderRadius: "6px", mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#881337" }}>
                  Mr. Nagaraj S — Grievance & Data Protection Officer
                </Typography>
                <Typography variant="body2" sx={{ color: "#374151", mt: 0.5 }}>
                  Ornate Pvt Ltd / Girija Kalyana Matrimony
                </Typography>
                <Typography variant="body2" sx={{ color: "#374151" }}>
                  Address: #148/E, 2nd Floor, 17th Main, Vijaynagar, Bangalore - 560040, Karnataka, India
                </Typography>
                <Typography variant="body2" sx={{ color: "#374151" }}>
                  Email: ornateinteriord@gmail.com | Phone: +91 91488 24442 / 080-23409697
                </Typography>
                <Typography variant="body2" sx={{ color: "#374151" }}>
                  Response Window: Grievances are acknowledged within 24 hours and resolved within 15 working days.
                </Typography>
              </Paper>
            </Box>
          </Paper>
        </Container>
      </Box>

      <Footer />
    </>
  );
};

export default PrivacyPolicy;
