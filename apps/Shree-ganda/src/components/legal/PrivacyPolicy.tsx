import React, { useEffect } from 'react';
import { Box, Container, Typography, Paper, Divider, Breadcrumbs, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import Navbar from '../navbar/Navbar';
import Footer from '../footer/Footer';
import usePageMetadata from '../../hooks/usePageMetadata';

export const PrivacyPolicy: React.FC = () => {
  usePageMetadata({
    title: 'Privacy Policy - Shree Ganda Matrimony',
    description: 'Privacy Policy for Shree Ganda Matrimony under the Digital Personal Data Protection Act 2023 (DPDP Act 2023). Learn how we protect your personal data.',
    canonicalUrl: 'https://shreegandha.com/privacy-policy',
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Box sx={{ backgroundColor: '#FDFBF7', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 }, flex: 1 }}>
        <Breadcrumbs sx={{ mb: 3, color: '#5C4033', fontSize: '0.9rem' }}>
          <MuiLink component={Link} to="/" color="inherit" underline="hover">
            Home
          </MuiLink>
          <Typography color="#8B1E1E" fontWeight={600}>
            Privacy Policy
          </Typography>
        </Breadcrumbs>

        <Paper
          elevation={2}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: '8px',
            backgroundColor: '#FFFFFF',
            border: '1px solid rgba(197, 160, 89, 0.25)',
          }}
        >
          {/* Exactly one h1 */}
          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontSize: { xs: '2rem', sm: '2.5rem' },
              fontWeight: 700,
              color: '#8B1E1E',
              mb: 1,
            }}
          >
            Shree Ganda Privacy Policy
          </Typography>

          <Typography variant="caption" sx={{ color: '#5C4033', display: 'block', mb: 3 }}>
            Last Updated: November 19, 2026 | Effective Date: November 19, 2026
          </Typography>

          <Divider sx={{ mb: 4, borderColor: 'rgba(197, 160, 89, 0.3)' }} />

          <Typography variant="body1" sx={{ color: '#2D1810', lineHeight: 1.8, mb: 3 }}>
            Under the Digital Personal Data Protection Act 2023 (DPDP Act 2023), Shree Ganda upholds the privacy and confidentiality of all user records. We are committed to safeguarding personal information collected from users, candidates, and families who utilize our matrimonial services across Karnataka and India.
          </Typography>

          <Typography variant="h5" component="h2" sx={{ fontWeight: 700, color: '#8B1E1E', mt: 4, mb: 1.5 }}>
            1. Scope and Applicability
          </Typography>
          <Typography variant="body1" sx={{ color: '#2D1810', lineHeight: 1.8, mb: 3 }}>
            This policy applies to all digital personal data processed by Shree Ganda Matrimony through our web platform, mobile applications, and customer support channels. By registering an account or browsing our profiles, you consent to the lawful processing of your information strictly for matchmaking purposes.
          </Typography>

          <Typography variant="h5" component="h2" sx={{ fontWeight: 700, color: '#8B1E1E', mt: 4, mb: 1.5 }}>
            2. Personal Data We Collect
          </Typography>
          <Typography variant="body1" sx={{ color: '#2D1810', lineHeight: 1.8, mb: 2 }}>
            To deliver authentic matrimonial matchmaking, we collect the following categories of data:
          </Typography>
          <Box component="ul" sx={{ pl: 4, color: '#2D1810', lineHeight: 1.8, mb: 3 }}>
            <li>Identity and demographic details: Full name, date of birth, age, gender, marital status, mother tongue, religion, caste, and sub-caste.</li>
            <li>Contact details: Primary mobile number, email address, residential address, city, and state.</li>
            <li>Professional and educational records: Highest qualification, occupation, employer location, and monthly income bracket.</li>
            <li>Family background and lifestyle: Parent details, family values, dietary habits, and cultural traditions.</li>
            <li>Verification documents: Government ID and photograph uploads required strictly to verify identity and maintain platform authenticity.</li>
          </Box>

          <Typography variant="h5" component="h2" sx={{ fontWeight: 700, color: '#8B1E1E', mt: 4, mb: 1.5 }}>
            3. Rights of the Data Principal
          </Typography>
          <Typography variant="body1" sx={{ color: '#2D1810', lineHeight: 1.8, mb: 3 }}>
            Users may exercise rights of access, correction, erasure, and consent revocation at will. Under the DPDP Act 2023, you have the statutory right to:
          </Typography>
          <Box component="ul" sx={{ pl: 4, color: '#2D1810', lineHeight: 1.8, mb: 3 }}>
            <li>Request a summary of personal data being processed and matching activities performed.</li>
            <li>Seek correction, completion, or updating of inaccurate or misleading profile information.</li>
            <li>Request erasure of personal data when your marriage is finalized or when you choose to discontinue service.</li>
            <li>Withdraw your consent at any time through account settings or written communication to our grievance cell.</li>
          </Box>

          <Typography variant="h5" component="h2" sx={{ fontWeight: 700, color: '#8B1E1E', mt: 4, mb: 1.5 }}>
            4. Data Retention and Erasure
          </Typography>
          <Typography variant="body1" sx={{ color: '#2D1810', lineHeight: 1.8, mb: 3 }}>
            Data retention is strictly restricted to active profile lifespans. Profiles marked deleted undergo complete data purging within 30 days. No archival backups containing identifiable personal information are maintained past statutory audit limits. Payment transactions are retained solely for tax compliance as mandated by Indian finance laws.
          </Typography>

          <Typography variant="h5" component="h2" sx={{ fontWeight: 700, color: '#8B1E1E', mt: 4, mb: 1.5 }}>
            5. Data Security Safeguards
          </Typography>
          <Typography variant="body1" sx={{ color: '#2D1810', lineHeight: 1.8, mb: 3 }}>
            We implement comprehensive technical and organizational measures, including AES-256 encryption in transit and at rest, multi-factor authentication for administrative access, role-based authorization controls, and continuous vulnerability scanning.
          </Typography>

          <Typography variant="h5" component="h2" sx={{ fontWeight: 700, color: '#8B1E1E', mt: 4, mb: 1.5 }}>
            6. Grievance Redressal and Data Protection Officer
          </Typography>
          <Typography variant="body1" sx={{ color: '#2D1810', lineHeight: 1.8, mb: 2 }}>
            Direct inquiries to our Data Protection Officer (DPO):
          </Typography>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              backgroundColor: '#FDFBF7',
              border: '1px solid rgba(197, 160, 89, 0.3)',
              borderRadius: '6px',
              mb: 3,
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 700, color: '#8B1E1E', mb: 0.5 }}>
              Data Protection Officer (DPO) - Shree Ganda Matrimony
            </Typography>
            <Typography variant="body2" sx={{ color: '#2D1810', mb: 0.5 }}>
              Email: privacy@shreegandha.com
            </Typography>
            <Typography variant="body2" sx={{ color: '#2D1810', mb: 0.5 }}>
              Phone: +91 80 2345 6789
            </Typography>
            <Typography variant="body2" sx={{ color: '#2D1810' }}>
              Office: Shree Ganda Customer Redressal Cell, Bengaluru, Karnataka, India
            </Typography>
          </Paper>

          <Typography variant="body2" sx={{ color: '#5C4033', fontStyle: 'italic' }}>
            We resolve all privacy inquiries and data principal rights requests within 30 days of verified receipt.
          </Typography>
        </Paper>
      </Container>

      <Footer />
    </Box>
  );
};

export default PrivacyPolicy;
