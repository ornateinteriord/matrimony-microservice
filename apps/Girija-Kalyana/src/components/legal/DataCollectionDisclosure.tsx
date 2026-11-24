import React from "react";
import { Container, Box, Typography, Paper, Divider } from "@mui/material";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import SEOHead from "../common/SEOHead";

export const DataCollectionDisclosure: React.FC = () => {
  return (
    <>
      <SEOHead
        title="Data Collection Disclosure"
        description="Comprehensive disclosure of how user personal and matrimonial data is gathered, processed, and safeguarded on the Girija Kalyana platform."
        canonicalUrl="https://girijakalyana.com/data-disclosure"
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
              Data Collection Disclosure
            </Typography>

            <Typography variant="subtitle2" sx={{ color: "#D97706", mb: 3 }}>
              Statutory Disclosure of Personal Data Gathering & Processing | Updated: November 2026
            </Typography>

            <Divider sx={{ mb: 4, borderColor: "rgba(136, 19, 55, 0.15)" }} />

            <Box sx={{ "& h2": { color: "#881337", fontSize: "1.3rem", fontWeight: 600, mt: 3, mb: 1.5 }, "& p": { color: "#374151", lineHeight: 1.7, mb: 2 } }}>
              <h2>1. Scope & Commitment</h2>
              <p>
                In compliance with Rule 3 of the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011 and the Digital Personal Data Protection Act, 2023, this Disclosure clearly enumerates all personal data collected by Girija Kalyana during registration and matchmaking.
              </p>

              <h2>2. Explicit Data Collection Inventory</h2>
              <p>
                When creating an account and configuring a matrimonial profile, we collect:
              </p>
              <ul>
                <li><strong>Personal Identity Attributes:</strong> First name, last name, gender, date of birth, age, marital status (unmarried, divorced, widowed), and profile creator relationship (self, parent, sibling, relative).</li>
                <li><strong>Community & Vedic Attributes:</strong> Religion, caste, sub-caste, mother tongue, gotra, rashi, nakshatra, and horoscope chart details.</li>
                <li><strong>Socio-Economic Attributes:</strong> Highest educational degree, institution, current occupation, employment sector, annual/monthly income range, and work location.</li>
                <li><strong>Family & Lifestyle Details:</strong> Parent names, family type (nuclear or joint), family values, dietary habits, and residential address.</li>
                <li><strong>Photographic Assets:</strong> Profile photos uploaded for matrimonial verification and display.</li>
                <li><strong>Referral & Sponsorship Attribution:</strong> Promoter sponsor code permanently bound during registration for community accountability.</li>
              </ul>

              <h2>3. Processing Security & Storage Boundaries</h2>
              <p>
                All data is stored in secure MongoDB clusters with encryption at rest and access-controlled API endpoints. Passwords are encrypted using salted bcrypt hashing algorithms. Profile images are processed to remove EXIF location metadata before publishing.
              </p>

              <h2>4. Disclosure to Third-Party Service Providers</h2>
              <p>
                We do not sell personal data. We disclose limited data strictly to authorized processing partners under strict confidentiality agreements:
              </p>
              <ul>
                <li><strong>Payment Processors:</strong> Cashfree Payments and banking networks for completing membership transactions.</li>
                <li><strong>SMS & Notification Gateways:</strong> Authorized telecom aggregators for dispatching OTP verification codes and match alerts.</li>
                <li><strong>Legal Authorities:</strong> Law enforcement or judicial bodies only when compelled by valid legal summons or statutory court orders under Indian law.</li>
              </ul>

              <h2>5. Account Deletion & Data Purge</h2>
              <p>
                Members have the absolute right to delete their profiles at any point once married or when choosing to withdraw. Upon receiving a verified account deletion request, your profile, contact records, and images will be purged from active discovery queries within 7 business days.
              </p>
            </Box>
          </Paper>
        </Container>
      </Box>

      <Footer />
    </>
  );
};

export default DataCollectionDisclosure;
