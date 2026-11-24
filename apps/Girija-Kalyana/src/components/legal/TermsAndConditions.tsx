import React from "react";
import { Container, Box, Typography, Paper, Divider } from "@mui/material";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import SEOHead from "../common/SEOHead";

export const TermsAndConditions: React.FC = () => {
  return (
    <>
      <SEOHead
        title="Terms and Conditions"
        description="Official Terms and Conditions governing user registration, eligibility, and service usage on the Girija Kalyana Matrimonial platform."
        canonicalUrl="https://girijakalyana.com/terms"
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
              Terms and Conditions
            </Typography>

            <Typography variant="subtitle2" sx={{ color: "#D97706", mb: 3 }}>
              Governing Matrimonial Service Usage | Effective Date: November 2026
            </Typography>

            <Divider sx={{ mb: 4, borderColor: "rgba(136, 19, 55, 0.15)" }} />

            <Box sx={{ "& h2": { color: "#881337", fontSize: "1.3rem", fontWeight: 600, mt: 3, mb: 1.5 }, "& p": { color: "#374151", lineHeight: 1.7, mb: 2 } }}>
              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing, registering, or using Girija Kalyana ("Platform"), you agree to be bound by these Terms and Conditions ("Terms"). If you do not agree with any provision of these Terms, you must immediately discontinue your use of our services.
              </p>

              <h2>2. Eligibility Criteria</h2>
              <p>
                Girija Kalyana is an exclusive matrimonial matchmaking platform. To register an account:
              </p>
              <ul>
                <li>You must be legally competent to marry under the applicable laws of India (minimum 21 years of age for male candidates and minimum 18 years of age for female candidates).</li>
                <li>You must be legally single, divorced, widowed, or awaiting divorce with valid decree status. Married individuals seeking extramarital arrangements are strictly prohibited.</li>
                <li>If creating a profile on behalf of a son, daughter, sibling, or relative, you affirm that you have received their express authorization to provide truthful information.</li>
              </ul>

              <h2>3. Account Registration & Sponsor Verification</h2>
              <p>
                Users must register using accurate, truthful, and verifiable personal information. When entering through an authorized community sponsor link, the referral code is permanently bound to ensure promotional accountability. Submitting fraudulent credentials, impersonating others, or providing deceitful educational or marital statuses constitutes grounds for immediate termination without refund.
              </p>

              <h2>4. Code of Conduct & Prohibited Activities</h2>
              <p>
                Members agree to uphold the dignity and sanctity of matrimonial matchmaking. You expressly agree not to:
              </p>
              <ul>
                <li>Harass, stalk, abuse, or send unsolicited commercial advertisements or obscene material to other members.</li>
                <li>Solicit money, loans, or financial favors under any pretext from members discovered on this platform.</li>
                <li>Scrape, extract, crawl, or automate profile data collection via programmatic bots or third-party tools.</li>
                <li>Upload photographs containing explicit, copyrighted, watermarked, or deceptive imagery.</li>
              </ul>

              <h2>5. Membership Subscriptions & Payments</h2>
              <p>
                Basic profile registration is complimentary. Upgrading to Silver or Premium Membership grants extended communication features, direct phone number access, and priority listing. All payments are processed through RBI-authorized payment aggregators (Cashfree / Razorpay). Membership privileges are strictly non-transferable.
              </p>

              <h2>6. Disclaimer of Warranties & Verification Notice</h2>
              <p>
                While Girija Kalyana conducts mobile verification and community review, we strongly advise members and their families to conduct independent background verification (employment, marital, family background, and character) before finalizing matrimonial alliances. Girija Kalyana does not guarantee marriage alliances and disclaims liability for any loss arising from member misrepresentations.
              </p>

              <h2>7. Governing Law & Dispute Jurisdiction</h2>
              <p>
                These Terms are governed by and construed in accordance with the laws of the Republic of India. Any legal dispute, controversy, or claim arising out of or relating to platform usage shall be subject to the exclusive jurisdiction of the competent courts in Bangalore, Karnataka, India.
              </p>
            </Box>
          </Paper>
        </Container>
      </Box>

      <Footer />
    </>
  );
};

export default TermsAndConditions;
