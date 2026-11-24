import React from "react";
import { Container, Box, Typography, Paper, Divider } from "@mui/material";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import SEOHead from "../common/SEOHead";

export const RefundPolicy: React.FC = () => {
  return (
    <>
      <SEOHead
        title="Refund & Cancellation Policy"
        description="Official Refund and Cancellation Policy for Girija Kalyana Silver and Premium Matrimonial Memberships."
        canonicalUrl="https://girijakalyana.com/refund-policy"
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
              Refund & Cancellation Policy
            </Typography>

            <Typography variant="subtitle2" sx={{ color: "#D97706", mb: 3 }}>
              Clear and Transparent Subscription Terms | Updated: November 2026
            </Typography>

            <Divider sx={{ mb: 4, borderColor: "rgba(136, 19, 55, 0.15)" }} />

            <Box sx={{ "& h2": { color: "#881337", fontSize: "1.3rem", fontWeight: 600, mt: 3, mb: 1.5 }, "& p": { color: "#374151", lineHeight: 1.7, mb: 2 } }}>
              <h2>1. Nature of Digital Matrimonial Services</h2>
              <p>
                Girija Kalyana provides digital access to verified matrimonial database profiles, matchmaking algorithms, interest exchange features, and direct verified contact details. Due to the immediate activation and consumption of digital access privileges upon payment confirmation, memberships are generally non-refundable once activated.
              </p>

              <h2>2. Technical Error & Duplicate Billing Refunds</h2>
              <p>
                In the following specific circumstances, full refunds will be issued without penalty:
              </p>
              <ul>
                <li><strong>Duplicate Transactions:</strong> If your bank account or payment card was debited multiple times for a single membership subscription order.</li>
                <li><strong>Payment Deducted Without Activation:</strong> If money was deducted from your account, but your membership plan failed to activate due to an API gateway timeout, and our billing desk is unable to manually provision the account within 48 hours.</li>
              </ul>

              <h2>3. Cancellation Procedure & Refund Processing</h2>
              <p>
                To request a billing review or duplicate transaction refund:
              </p>
              <ul>
                <li>Submit your request within 7 calendar days of the transaction to <strong>ornateinteriord@gmail.com</strong> or call our billing desk at <strong>+91 91488 24442</strong>.</li>
                <li>Include your registered mobile number, email address, payment transaction ID / Cashfree order reference, and screenshot of bank debit.</li>
                <li>Eligible refunds are approved within 3 business days and credited back to the original source payment method (bank account, UPI, or card) within 5–7 banking working days.</li>
              </ul>

              <h2>4. Termination for Terms Violation</h2>
              <p>
                No refund shall be issued if a member account is suspended or permanently terminated due to violation of our Terms and Conditions, including posting fraudulent information, harassment, commercial solicitation, or providing invalid age or marital records.
              </p>
            </Box>
          </Paper>
        </Container>
      </Box>

      <Footer />
    </>
  );
};

export default RefundPolicy;
