import React from 'react';
import { Container, Box, Typography, Paper, Divider, Breadcrumbs, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import Navbar from '../navbar/Navbar';
import Footer from '../footer/Footer';
import SEOHead from '../common/SEOHead';

const PrivacyPolicy: React.FC = () => {
  return (
    <>
      <SEOHead
        title="Privacy Policy"
        description="Sangam Sathi Privacy Policy compliant with DPDP Act 2023. Learn about your data principal rights, data retention, consent management, and grievance redressal."
        canonicalUrl="https://sangamsathi.com/privacy-policy"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Privacy Policy",
          "description": "Privacy Policy and Data Protection practices of Sangam Sathi under DPDP Act 2023.",
          "publisher": {
            "@type": "Organization",
            "name": "Sangam Sathi"
          }
        }}
      />
      <Navbar />
      <Box sx={{ backgroundColor: '#F8FAFC', minHeight: '100vh', pt: { xs: 10, md: 12 }, pb: 8 }}>
        <Container maxWidth="lg">
          <Breadcrumbs sx={{ mb: 3 }}>
            <MuiLink component={Link} to="/" color="inherit" underline="hover">
              Home
            </MuiLink>
            <Typography color="text.primary">Privacy Policy</Typography>
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
              Privacy Policy
            </Typography>

            <Typography variant="body2" sx={{ color: '#64748B', mb: 3 }}>
              Last Updated: November 2026 | Compliant with the Digital Personal Data Protection Act (DPDP Act 2023)
            </Typography>

            <Divider sx={{ mb: 4 }} />

            <Typography variant="h5" component="h2" sx={{ color: '#0B192C', fontWeight: 700, mt: 3, mb: 1.5 }}>
              1. Introduction and Scope
            </Typography>
            <Typography variant="body1" sx={{ color: '#334155', mb: 2, lineHeight: 1.8 }}>
              Sangam Sathi (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) operates as a premier digital matrimony platform dedicated to helping individuals discover compatible life partners within their communities. We deeply respect personal privacy and are committed to safeguarding all digital personal data in strict compliance with India&apos;s Digital Personal Data Protection Act, 2023 (DPDP Act 2023) and applicable information technology regulations.
            </Typography>

            <Typography variant="h5" component="h2" sx={{ color: '#0B192C', fontWeight: 700, mt: 3, mb: 1.5 }}>
              2. Data Principal Rights
            </Typography>
            <Typography variant="body1" sx={{ color: '#334155', mb: 2, lineHeight: 1.8 }}>
              Under Chapter III of the DPDP Act 2023, you (as the Data Principal) hold specific enforceable rights concerning your personal data:
            </Typography>
            <Box component="ul" sx={{ pl: 4, mb: 2, color: '#334155', lineHeight: 1.8 }}>
              <li><strong>Right to Access Information:</strong> You may request a summary of personal data processed by us and identities of third-party data fiduciaries with whom it has been shared.</li>
              <li><strong>Right to Correction and Erasure:</strong> You may request correction of inaccurate or misleading data, updating of incomplete data, or deletion of personal data no longer necessary for matchmaking.</li>
              <li><strong>Right of Grievance Redressal:</strong> You have the right to accessible and expeditious grievance redressal provided by our designated Grievance Officer.</li>
              <li><strong>Right to Nominate:</strong> You may nominate another individual to exercise your data principal rights in the event of death or incapacity.</li>
              <li><strong>Right to Withdraw Consent:</strong> Consent granted for processing may be withdrawn at any time with the same ease with which it was provided.</li>
            </Box>

            <Typography variant="h5" component="h2" sx={{ color: '#0B192C', fontWeight: 700, mt: 3, mb: 1.5 }}>
              3. Purpose Limitation and Data Minimization
            </Typography>
            <Typography variant="body1" sx={{ color: '#334155', mb: 2, lineHeight: 1.8 }}>
              We process personal data solely for lawful, specific purposes for which you have provided clear, affirmative consent. We collect only data that is strictly necessary for:
            </Typography>
            <Box component="ul" sx={{ pl: 4, mb: 2, color: '#334155', lineHeight: 1.8 }}>
              <li>Facilitating authentic matrimonial profile matching based on mutual preferences.</li>
              <li>Identity verification, photo authenticity screening, and fraud prevention.</li>
              <li>Subscription management, transaction receipting, and statutory billing compliance.</li>
              <li>Enabling consensual communication between matching members and registered promoters.</li>
            </Box>

            <Typography variant="h5" component="h2" sx={{ color: '#0B192C', fontWeight: 700, mt: 3, mb: 1.5 }}>
              4. Data Retention and Erasure Schedule
            </Typography>
            <Typography variant="body1" sx={{ color: '#334155', mb: 2, lineHeight: 1.8 }}>
              Personal data is retained only for as long as your account remains active or as required by applicable tax and legal statutes. Upon account deletion or verified consent withdrawal:
            </Typography>
            <Box component="ul" sx={{ pl: 4, mb: 2, color: '#334155', lineHeight: 1.8 }}>
              <li>Profile data, photographs, and horoscopic details are permanently purged within 30 days.</li>
              <li>Financial transaction logs are archived in encrypted cold storage for the statutory period mandated by financial regulators.</li>
            </Box>

            <Typography variant="h5" component="h2" sx={{ color: '#0B192C', fontWeight: 700, mt: 3, mb: 1.5 }}>
              5. Grievance Officer Contact Details
            </Typography>
            <Typography variant="body1" sx={{ color: '#334155', mb: 2, lineHeight: 1.8 }}>
              In accordance with Section 10 of the DPDP Act 2023, our designated Data Protection &amp; Grievance Officer may be contacted for any queries, requests, or privacy concerns:
            </Typography>
            <Box
              sx={{
                p: 2.5,
                backgroundColor: '#F1F5F9',
                borderRadius: '8px',
                borderLeft: '4px solid #D4AF37',
                mb: 3,
              }}
            >
              <Typography variant="body1" sx={{ fontWeight: 700, color: '#0B192C' }}>
                Grievance Officer: Sangam Sathi Legal &amp; Compliance Team
              </Typography>
              <Typography variant="body2" sx={{ color: '#334155', mt: 0.5 }}>
                Email: ornateinteriord@gmail.com | Phone: +91 91488 24442
              </Typography>
              <Typography variant="body2" sx={{ color: '#334155' }}>
                Address: Ornate Pvt Ltd, Sangam Sathi Operations, Bengaluru, Karnataka, India
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748B', mt: 0.5, fontStyle: 'italic' }}>
                Response Time: All formal data principal grievances are resolved within 7 business days.
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;
