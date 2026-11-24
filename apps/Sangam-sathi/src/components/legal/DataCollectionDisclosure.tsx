import React from 'react';
import { Container, Box, Typography, Paper, Divider, Breadcrumbs, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import Navbar from '../navbar/Navbar';
import Footer from '../footer/Footer';
import SEOHead from '../common/SEOHead';

const DataCollectionDisclosure: React.FC = () => {
  return (
    <>
      <SEOHead
        title="Data Collection Disclosure"
        description="Comprehensive disclosure of what data Sangam Sathi collects, why it is processed, identity verification procedures, and security safeguards."
        canonicalUrl="https://sangamsathi.com/data-disclosure"
      />
      <Navbar />
      <Box sx={{ backgroundColor: '#F8FAFC', minHeight: '100vh', pt: { xs: 10, md: 12 }, pb: 8 }}>
        <Container maxWidth="lg">
          <Breadcrumbs sx={{ mb: 3 }}>
            <MuiLink component={Link} to="/" color="inherit" underline="hover">
              Home
            </MuiLink>
            <Typography color="text.primary">Data Collection Disclosure</Typography>
          </Breadcrumbs>

          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 6 },
              borderRadius: '12px',
              border: '1px solid rgba(11, 25, 44, 0.08)',
              backgroundColor: '#FFFFFF',
            }}
          >
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 800,
                color: '#0B192C',
                mb: 1,
                fontSize: { xs: '2rem', md: '2.5rem' },
              }}
            >
              Data Collection Disclosure
            </Typography>

            <Typography variant="body2" sx={{ color: '#64748B', mb: 3 }}>
              Comprehensive Transparency on Information Handling &amp; Verification
            </Typography>

            <Divider sx={{ mb: 4 }} />

            <Typography variant="h5" component="h2" sx={{ color: '#0B192C', fontWeight: 700, mt: 3, mb: 1.5 }}>
              1. Information We Collect from Members
            </Typography>
            <Typography variant="body1" sx={{ color: '#334155', mb: 2, lineHeight: 1.8 }}>
              To operate an authentic, secure matrimonial platform, Sangam Sathi collects the following specific categories of information with your express consent:
            </Typography>
            <Box component="ul" sx={{ pl: 4, mb: 2, color: '#334155', lineHeight: 1.8 }}>
              <li><strong>Basic Identity Information:</strong> Full legal name, gender, date of birth, age, and marital status.</li>
              <li><strong>Contact Information:</strong> Verified mobile number and email address used for OTP authentication and account notifications.</li>
              <li><strong>Community &amp; Cultural Data:</strong> Mother tongue, religion, caste, sub-caste, gotra, and optional horoscopic preferences.</li>
              <li><strong>Professional &amp; Educational Profile:</strong> Highest degree, educational institution, occupation, annual income range, and workplace city/country.</li>
              <li><strong>Photographs &amp; Identity Verification:</strong> Profile photos uploaded for screening, along with government identity documents (Aadhaar/PAN/Passport) submitted to authorized administrators for profile verification badges.</li>
              <li><strong>Referral &amp; Sponsor Attribution:</strong> Referral codes, sponsor tags, and promoter association IDs used to trace authorized matchmaking assistance.</li>
            </Box>

            <Typography variant="h5" component="h2" sx={{ color: '#0B192C', fontWeight: 700, mt: 3, mb: 1.5 }}>
              2. Why We Collect This Data
            </Typography>
            <Typography variant="body1" sx={{ color: '#334155', mb: 2, lineHeight: 1.8 }}>
              Each data attribute collected has a direct, stated purpose in delivering trustworthy matrimonial matchmaking:
            </Typography>
            <Box component="ul" sx={{ pl: 4, mb: 2, color: '#334155', lineHeight: 1.8 }}>
              <li>Ensuring only genuine, age-eligible candidates with real matrimonial intent participate.</li>
              <li>Preventing impersonation, romance fraud, and catfishing through manual image and document verification.</li>
              <li>Calculating accurate match compatibility scores based on mutual preferences.</li>
              <li>Complying with statutory financial reporting and electronic transaction audit trails.</li>
            </Box>

            <Typography variant="h5" component="h2" sx={{ color: '#0B192C', fontWeight: 700, mt: 3, mb: 1.5 }}>
              3. Data Security and Encryption
            </Typography>
            <Typography variant="body1" sx={{ color: '#334155', mb: 2, lineHeight: 1.8 }}>
              All transmitted data is encrypted in transit using industry-standard Transport Layer Security (TLS 1.3) with strong cryptographic ciphers. Passwords are cryptographically salted and hashed. Sensitive verification documents are restricted to authorized internal compliance officers with role-based access controls and comprehensive audit logging.
            </Typography>

            <Typography variant="h5" component="h2" sx={{ color: '#0B192C', fontWeight: 700, mt: 3, mb: 1.5 }}>
              4. Third-Party Service Providers
            </Typography>
            <Typography variant="body1" sx={{ color: '#334155', mb: 2, lineHeight: 1.8 }}>
              We do not sell, rent, or trade your personal data. We partner only with vetted third-party data processors who adhere to strict data security obligations:
            </Typography>
            <Box component="ul" sx={{ pl: 4, mb: 2, color: '#334155', lineHeight: 1.8 }}>
              <li><strong>Cashfree Payments:</strong> PCI-DSS compliant payment gateway processing credit card, UPI, and net banking transactions.</li>
              <li><strong>Telecom/SMS Providers:</strong> Delivering one-time passwords (OTP) for phone verification and critical security alerts.</li>
            </Box>
          </Paper>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default DataCollectionDisclosure;
