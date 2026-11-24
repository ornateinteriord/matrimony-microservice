import React, { useEffect } from 'react';
import { Box, Container, Typography, Paper, Divider, Breadcrumbs, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import Navbar from '../navbar/Navbar';
import Footer from '../footer/Footer';
import usePageMetadata from '../../hooks/usePageMetadata';

export const CookiePolicy: React.FC = () => {
  usePageMetadata({
    title: 'Cookie Policy - Shree Ganda Matrimony',
    description: 'Cookie Policy for Shree Ganda Matrimony. Understand how we use essential, analytics, and functional cookies on our platform.',
    canonicalUrl: 'https://shreegandha.com/cookie-policy',
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
            Cookie Policy
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
            Shree Ganda Cookie Policy
          </Typography>

          <Typography variant="caption" sx={{ color: '#5C4033', display: 'block', mb: 3 }}>
            Last Updated: November 19, 2026 | Effective Date: November 19, 2026
          </Typography>

          <Divider sx={{ mb: 4, borderColor: 'rgba(197, 160, 89, 0.3)' }} />

          <Typography variant="body1" sx={{ color: '#2D1810', lineHeight: 1.8, mb: 3 }}>
            This Cookie Policy explains how Shree Ganda Matrimony uses cookies and related local storage technologies to enhance user security, remember preferences, and analyze platform usage in compliance with the Digital Personal Data Protection Act 2023.
          </Typography>

          <Typography variant="h5" component="h2" sx={{ fontWeight: 700, color: '#8B1E1E', mt: 4, mb: 1.5 }}>
            1. What Are Cookies?
          </Typography>
          <Typography variant="body1" sx={{ color: '#2D1810', lineHeight: 1.8, mb: 3 }}>
            Cookies are small text files stored on your computer or mobile device when you browse websites. They help the website remember your login state, language preference, and interface customizations over a period of time.
          </Typography>

          <Typography variant="h5" component="h2" sx={{ fontWeight: 700, color: '#8B1E1E', mt: 4, mb: 1.5 }}>
            2. Categories of Cookies We Use
          </Typography>

          <Typography variant="h6" component="h3" sx={{ fontWeight: 600, color: '#2D1810', mt: 2, mb: 1 }}>
            A. Strictly Necessary (Essential) Cookies
          </Typography>
          <Typography variant="body1" sx={{ color: '#2D1810', lineHeight: 1.8, mb: 2 }}>
            These cookies are required for basic technical operations, authentication session tokens, cross-site request forgery (CSRF) defenses, and access to secure account dashboards. You cannot opt out of essential cookies as the application cannot function without them.
          </Typography>

          <Typography variant="h6" component="h3" sx={{ fontWeight: 600, color: '#2D1810', mt: 2, mb: 1 }}>
            B. Performance and Analytics Cookies
          </Typography>
          <Typography variant="body1" sx={{ color: '#2D1810', lineHeight: 1.8, mb: 2 }}>
            These cookies collect anonymous, aggregated statistics regarding how visitors use Shree Ganda (e.g., page load speeds, search query duration, bounce rates). This allows us to optimize user journeys and troubleshoot connectivity issues without identifying individuals.
          </Typography>

          <Typography variant="h6" component="h3" sx={{ fontWeight: 600, color: '#2D1810', mt: 2, mb: 1 }}>
            C. Functional and Preference Cookies
          </Typography>
          <Typography variant="body1" sx={{ color: '#2D1810', lineHeight: 1.8, mb: 3 }}>
            These cookies allow the site to remember user selections such as community filters, age range ranges, and dashboard view settings.
          </Typography>

          <Typography variant="h5" component="h2" sx={{ fontWeight: 700, color: '#8B1E1E', mt: 4, mb: 1.5 }}>
            3. Managing Your Cookie Preferences
          </Typography>
          <Typography variant="body1" sx={{ color: '#2D1810', lineHeight: 1.8, mb: 3 }}>
            Upon first visit, our floating Cookie Consent Banner allows you to select either "Accept All" or "Necessary Only". Your preference is recorded in your browser local storage and honored on all subsequent visits. You can reset your cookie choices at any time by clearing your browser cache or re-opening the banner via the footer link.
          </Typography>
        </Paper>
      </Container>

      <Footer />
    </Box>
  );
};

export default CookiePolicy;
