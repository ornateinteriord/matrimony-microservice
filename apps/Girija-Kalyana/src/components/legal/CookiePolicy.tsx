import React from "react";
import { Container, Box, Typography, Paper, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import SEOHead from "../common/SEOHead";

export const CookiePolicy: React.FC = () => {
  return (
    <>
      <SEOHead
        title="Cookie Policy"
        description="Learn how Girija Kalyana uses cookies and browser storage technologies to maintain secure sessions and personalized matrimonial matchmaking."
        canonicalUrl="https://girijakalyana.com/cookie-policy"
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
              Cookie Policy
            </Typography>

            <Typography variant="subtitle2" sx={{ color: "#D97706", mb: 3 }}>
              Transparency in Browser Storage & Tracking Technologies | Updated: November 2026
            </Typography>

            <Divider sx={{ mb: 4, borderColor: "rgba(136, 19, 55, 0.15)" }} />

            <Box sx={{ "& h2": { color: "#881337", fontSize: "1.3rem", fontWeight: 600, mt: 3, mb: 1.5 }, "& p": { color: "#374151", lineHeight: 1.7, mb: 2 } }}>
              <h2>1. What Are Cookies?</h2>
              <p>
                Cookies and local storage tokens are small text files placed on your browser or device when you visit Girija Kalyana. They enable us to recognize your session, remember security tokens, keep you logged in safely across page navigations, and optimize matrimonial search preferences.
              </p>

              <h2>2. Categories of Cookies We Use</h2>
              <TableContainer component={Paper} sx={{ mb: 3, border: "1px solid #e5e7eb" }}>
                <Table size="small">
                  <TableHead sx={{ backgroundColor: "rgba(136, 19, 55, 0.05)" }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, color: "#881337" }}>Category</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: "#881337" }}>Purpose</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: "#881337" }}>Duration</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Essential & Authentication</TableCell>
                      <TableCell>Stores JWT auth token and session state to maintain authorized access</TableCell>
                      <TableCell>Session / 30 Days</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Consent & Preferences</TableCell>
                      <TableCell>Stores `cookieConsent` choice (accepted/declined) and theme settings</TableCell>
                      <TableCell>1 Year</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Security & Fraud Prevention</TableCell>
                      <TableCell>Prevents CSRF vulnerabilities and secures payment order sessions</TableCell>
                      <TableCell>Session</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              <h2>3. Third-Party Cookies & Payment Gateways</h2>
              <p>
                When initiating a paid membership order, our authorized payment aggregators (e.g., Cashfree Payments) may set essential security cookies to verify your checkout transaction and prevent unauthorized credit/debit card charges. These cookies are subject to the privacy policies of the respective payment gateways.
              </p>

              <h2>4. How to Manage or Disable Cookies</h2>
              <p>
                You can adjust your cookie preferences at any time using our floating Cookie Consent Banner, or by configuring your web browser settings to block or delete cookies. Note that disabling essential cookies will prevent logging in to your member account and accessing paid matchmaking features.
              </p>
            </Box>
          </Paper>
        </Container>
      </Box>

      <Footer />
    </>
  );
};

export default CookiePolicy;
