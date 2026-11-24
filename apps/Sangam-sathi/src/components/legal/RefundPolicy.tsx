import React from 'react';
import { Container, Box, Typography, Paper, Divider, Breadcrumbs, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import Navbar from '../navbar/Navbar';
import Footer from '../footer/Footer';
import SEOHead from '../common/SEOHead';

const RefundPolicy: React.FC = () => {
  return (
    <>
      <SEOHead
        title="Refund Policy"
        description="Sangam Sathi Refund and Cancellation Policy. Detailed guidelines on subscription fees, cooling-off periods, and billing disputes."
        canonicalUrl="https://sangamsathi.com/refund-policy"
      />
      <Navbar />
      <Box sx={{ backgroundColor: '#F8FAFC', minHeight: '100vh', pt: { xs: 10, md: 12 }, pb: 8 }}>
        <Container maxWidth="lg">
          <Breadcrumbs sx={{ mb: 3 }}>
            <MuiLink component={Link} to="/" color="inherit" underline="hover">
              Home
            </MuiLink>
            <Typography color="text.primary">Refund Policy</Typography>
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
              Refund &amp; Cancellation Policy
            </Typography>

            <Typography variant="body2" sx={{ color: '#64748B', mb: 3 }}>
              Effective Date: November 2026 | Transparent Subscription Terms
            </Typography>

            <Divider sx={{ mb: 4 }} />

            <Typography variant="h5" component="h2" sx={{ color: '#0B192C', fontWeight: 700, mt: 3, mb: 1.5 }}>
              1. Subscription Fees and Digital Service Delivery
            </Typography>
            <Typography variant="body1" sx={{ color: '#334155', mb: 2, lineHeight: 1.8 }}>
              Sangam Sathi offers digital matchmaking subscription memberships (such as Silver and Premium plans). Upon successful payment processing through our authorized gateway (Cashfree Payments), membership benefits and contact views are activated immediately in real time.
            </Typography>

            <Typography variant="h5" component="h2" sx={{ color: '#0B192C', fontWeight: 700, mt: 3, mb: 1.5 }}>
              2. Refund Eligibility &amp; Cooling-off Conditions
            </Typography>
            <Box component="ul" sx={{ pl: 4, mb: 2, color: '#334155', lineHeight: 1.8 }}>
              <li>
                <strong>Immediate Activation:</strong> Because digital matchmaking contact credits and premium filters are instantly accessible upon payment, subscription fees are generally non-refundable once any member contact details have been accessed.
              </li>
              <li>
                <strong>Cooling-off Period:</strong> If a member upgrades and does not access, view, or communicate with any matched profiles, a refund request may be submitted within 24 hours of transaction completion.
              </li>
              <li>
                <strong>Duplicate Charges:</strong> In the rare event of technical duplicate billing or multiple deductions for a single plan, all excess payments are refunded automatically within 5 to 7 business days to the original payment source.
              </li>
            </Box>

            <Typography variant="h5" component="h2" sx={{ color: '#0B192C', fontWeight: 700, mt: 3, mb: 1.5 }}>
              3. Chargebacks and Unauthorized Transactions
            </Typography>
            <Typography variant="body1" sx={{ color: '#334155', mb: 2, lineHeight: 1.8 }}>
              In the event of suspected fraudulent or unauthorized transactions on your payment method, please contact our support team immediately before initiating a bank chargeback. We cooperate fully with financial institutions and regulatory authorities to investigate and resolve unauthorized transaction claims promptly.
            </Typography>

            <Typography variant="h5" component="h2" sx={{ color: '#0B192C', fontWeight: 700, mt: 3, mb: 1.5 }}>
              4. How to Request a Refund
            </Typography>
            <Typography variant="body1" sx={{ color: '#334155', mb: 2, lineHeight: 1.8 }}>
              All refund requests must be sent via email from the registered account email address to:
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
                Billing &amp; Refund Desk: Sangam Sathi Finance Department
              </Typography>
              <Typography variant="body2" sx={{ color: '#334155', mt: 0.5 }}>
                Email: ornateinteriord@gmail.com | Phone: +91 91488 24442
              </Typography>
              <Typography variant="body2" sx={{ color: '#334155' }}>
                Please include your Registration Number, Transaction Reference ID, and Reason for Refund.
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default RefundPolicy;
