import React from 'react';
import { Container, Box, Typography, Paper, Divider, Breadcrumbs, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import Navbar from '../navbar/Navbar';
import Footer from '../footer/Footer';
import SEOHead from '../common/SEOHead';

const CookiePolicy: React.FC = () => {
  return (
    <>
      <SEOHead
        title="Cookie Policy"
        description="Learn about the cookies used by Sangam Sathi, including strictly necessary, preferences, and session tokens, and how you can manage or withdraw consent."
        canonicalUrl="https://sangamsathi.com/cookie-policy"
      />
      <Navbar />
      <Box sx={{ backgroundColor: '#F8FAFC', minHeight: '100vh', pt: { xs: 10, md: 12 }, pb: 8 }}>
        <Container maxWidth="lg">
          <Breadcrumbs sx={{ mb: 3 }}>
            <MuiLink component={Link} to="/" color="inherit" underline="hover">
              Home
            </MuiLink>
            <Typography color="text.primary">Cookie Policy</Typography>
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
              Cookie Policy
            </Typography>

            <Typography variant="body2" sx={{ color: '#64748B', mb: 3 }}>
              Last Updated: November 2026 | Transparency on Browser Storage &amp; Cookies
            </Typography>

            <Divider sx={{ mb: 4 }} />

            <Typography variant="h5" component="h2" sx={{ color: '#0B192C', fontWeight: 700, mt: 3, mb: 1.5 }}>
              1. What Are Cookies?
            </Typography>
            <Typography variant="body1" sx={{ color: '#334155', mb: 2, lineHeight: 1.8 }}>
              Cookies are small text files placed on your device by your web browser when you visit websites. They allow web applications to maintain session state, authenticate authorized users, remember preferences, and ensure a secure, uninterrupted experience.
            </Typography>

            <Typography variant="h5" component="h2" sx={{ color: '#0B192C', fontWeight: 700, mt: 3, mb: 1.5 }}>
              2. Categories of Cookies We Use
            </Typography>
            <Box component="ul" sx={{ pl: 4, mb: 2, color: '#334155', lineHeight: 1.8 }}>
              <li>
                <strong>Strictly Necessary Cookies:</strong> Essential for platform security, user authentication, and CSRF protection. Without these, secure login and session continuity cannot be provided.
              </li>
              <li>
                <strong>Functionality &amp; Preference Cookies:</strong> Used to retain your chosen UI settings, filter preferences (e.g. state/city selections), and sponsor referral locks during registration.
              </li>
              <li>
                <strong>Analytical &amp; Performance Cookies:</strong> Measure aggregated platform performance, identifying sluggish pages or broken links without tracking personally identifiable details.
              </li>
            </Box>

            <Typography variant="h5" component="h2" sx={{ color: '#0B192C', fontWeight: 700, mt: 3, mb: 1.5 }}>
              3. Session vs. Persistent Cookies
            </Typography>
            <Typography variant="body1" sx={{ color: '#334155', mb: 2, lineHeight: 1.8 }}>
              <strong>Session Cookies:</strong> Temporary cookies stored in memory that expire immediately upon closing your browser session.
              <br />
              <strong>Persistent Storage:</strong> Items such as your cookie consent preferences (<code>cookieConsent</code>) and remembered login identifiers are retained locally on your browser until cleared or expired.
            </Typography>

            <Typography variant="h5" component="h2" sx={{ color: '#0B192C', fontWeight: 700, mt: 3, mb: 1.5 }}>
              4. Managing and Withdrawing Consent
            </Typography>
            <Typography variant="body1" sx={{ color: '#334155', mb: 2, lineHeight: 1.8 }}>
              You may manage or withdraw your consent for non-essential cookies at any time via our floating Cookie Consent Banner or by adjusting your browser cookie settings. Please note that disabling strictly necessary cookies may restrict access to authenticated member areas.
            </Typography>
          </Paper>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default CookiePolicy;
