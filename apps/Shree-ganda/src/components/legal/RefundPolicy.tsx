import React, { useEffect } from 'react';
import { Box, Container, Typography, Paper, Divider, Breadcrumbs, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import Navbar from '../navbar/Navbar';
import Footer from '../footer/Footer';
import usePageMetadata from '../../hooks/usePageMetadata';

export const RefundPolicy: React.FC = () => {
  usePageMetadata({
    title: 'Refund Policy - Shree Ganda Matrimony',
    description: 'Refund Policy for Shree Ganda Matrimony subscriptions. Review our eligibility criteria, 5-7 business days processing window, and non-refundable terms.',
    canonicalUrl: 'https://shreegandha.com/refund-policy',
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
            Refund Policy
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
            Shree Ganda Refund Policy
          </Typography>

          <Typography variant="caption" sx={{ color: '#5C4033', display: 'block', mb: 3 }}>
            Last Updated: November 19, 2026 | Effective Date: November 19, 2026
          </Typography>

          <Divider sx={{ mb: 4, borderColor: 'rgba(197, 160, 89, 0.3)' }} />

          <Typography variant="body1" sx={{ color: '#2D1810', lineHeight: 1.8, mb: 3 }}>
            At Shree Ganda Matrimony, we strive to deliver transparent, authentic matchmaking services to all candidates and families. This Refund Policy outlines the terms under which fee refunds are considered for premium tier subscriptions and assisted matchmaking services.
          </Typography>

          <Typography variant="h5" component="h2" sx={{ fontWeight: 700, color: '#8B1E1E', mt: 4, mb: 1.5 }}>
            1. Refund Eligibility Window
          </Typography>
          <Typography variant="body1" sx={{ color: '#2D1810', lineHeight: 1.8, mb: 3 }}>
            Members may request a refund within 48 hours of completing a subscription upgrade, provided that:
          </Typography>
          <Box component="ul" sx={{ pl: 4, color: '#2D1810', lineHeight: 1.8, mb: 3 }}>
            <li>No verified candidate phone numbers, addresses, or confidential contact details have been unlocked or accessed.</li>
            <li>No personalized matchmaker counseling sessions have been scheduled or completed.</li>
            <li>The account has maintained clean compliance with our terms and has received no behavioral complaints.</li>
          </Box>

          <Typography variant="h5" component="h2" sx={{ fontWeight: 700, color: '#8B1E1E', mt: 4, mb: 1.5 }}>
            2. Non-Refundable Conditions
          </Typography>
          <Typography variant="body1" sx={{ color: '#2D1810', lineHeight: 1.8, mb: 3 }}>
            Subscription fees are strictly non-refundable under the following circumstances:
          </Typography>
          <Box component="ul" sx={{ pl: 4, color: '#2D1810', lineHeight: 1.8, mb: 3 }}>
            <li>The 48-hour initial cancellation window has expired.</li>
            <li>One or more candidate contact records have been retrieved from the database.</li>
            <li>The member enters into an engagement or marriage through other personal or matrimonial channels prior to plan expiration.</li>
            <li>The account is suspended or terminated due to fraud, deceptive profile information, abusive messaging, or terms of service violation.</li>
          </Box>

          <Typography variant="h5" component="h2" sx={{ fontWeight: 700, color: '#8B1E1E', mt: 4, mb: 1.5 }}>
            3. Refund Processing Timeline
          </Typography>
          <Typography variant="body1" sx={{ color: '#2D1810', lineHeight: 1.8, mb: 3 }}>
            Approved refund requests are credited back to the original source payment instrument (UPI, Debit Card, Credit Card, or Net Banking) within 5 to 7 business days from date of formal confirmation. A standard banking gateway fee of up to 3% may be deducted where applicable.
          </Typography>

          <Typography variant="h5" component="h2" sx={{ fontWeight: 700, color: '#8B1E1E', mt: 4, mb: 1.5 }}>
            4. How to Request a Refund
          </Typography>
          <Typography variant="body1" sx={{ color: '#2D1810', lineHeight: 1.8, mb: 3 }}>
            To initiate a refund evaluation, send an email to support@shreegandha.com with your registered mobile number, registration ID, transaction reference code, and the reason for your cancellation.
          </Typography>
        </Paper>
      </Container>

      <Footer />
    </Box>
  );
};

export default RefundPolicy;
