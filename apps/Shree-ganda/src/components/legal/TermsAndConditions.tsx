import React, { useEffect } from 'react';
import { Box, Container, Typography, Paper, Divider, Breadcrumbs, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import Navbar from '../navbar/Navbar';
import Footer from '../footer/Footer';
import usePageMetadata from '../../hooks/usePageMetadata';

export const TermsAndConditions: React.FC = () => {
  usePageMetadata({
    title: 'Terms and Conditions - Shree Ganda Matrimony',
    description: 'Terms and Conditions for Shree Ganda Matrimony. Understand eligibility criteria, code of conduct, membership rules, and dispute jurisdiction.',
    canonicalUrl: 'https://shreegandha.com/terms-and-conditions',
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
            Terms &amp; Conditions
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
            Shree Ganda Terms and Conditions
          </Typography>

          <Typography variant="caption" sx={{ color: '#5C4033', display: 'block', mb: 3 }}>
            Last Updated: November 19, 2026 | Effective Date: November 19, 2026
          </Typography>

          <Divider sx={{ mb: 4, borderColor: 'rgba(197, 160, 89, 0.3)' }} />

          <Typography variant="body1" sx={{ color: '#2D1810', lineHeight: 1.8, mb: 3 }}>
            Welcome to Shree Ganda Matrimony. These Terms and Conditions govern your access to and use of the Shree Ganda web application, mobile applications, and matchmaking support services. Please read these terms carefully before creating an account.
          </Typography>

          <Typography variant="h5" component="h2" sx={{ fontWeight: 700, color: '#8B1E1E', mt: 4, mb: 1.5 }}>
            1. Eligibility Criteria
          </Typography>
          <Typography variant="body1" sx={{ color: '#2D1810', lineHeight: 1.8, mb: 3 }}>
            Only persons aged 18 years and above eligible for marriage under applicable laws may register. By submitting a registration request, you warrant and represent that:
          </Typography>
          <Box component="ul" sx={{ pl: 4, color: '#2D1810', lineHeight: 1.8, mb: 3 }}>
            <li>You are of legal marriageable age in India (18 years for women, 21 years for men or applicable statutory standards).</li>
            <li>You are legally competent to enter into a valid marriage contract under the relevant personal laws or civil marriage statutes.</li>
            <li>You are currently unmarried, legally divorced with finalized decree, or widowed.</li>
            <li>You are registering for matrimonial purposes only, either on your own behalf or as parent/guardian with authentic consent.</li>
          </Box>

          <Typography variant="h5" component="h2" sx={{ fontWeight: 700, color: '#8B1E1E', mt: 4, mb: 1.5 }}>
            2. Code of Conduct
          </Typography>
          <Typography variant="body1" sx={{ color: '#2D1810', lineHeight: 1.8, mb: 3 }}>
            Users must maintain truthful information and refrain from unauthorized commercial activities. All registered candidates agree to:
          </Typography>
          <Box component="ul" sx={{ pl: 4, color: '#2D1810', lineHeight: 1.8, mb: 3 }}>
            <li>Provide genuine, verified identity, educational credentials, and accurate marital status.</li>
            <li>Treat all prospective candidates and families with mutual dignity, cultural sensitivity, and respect.</li>
            <li>Never solicit financial loans, gifts, business investments, or commercial endorsements.</li>
            <li>Never upload defamatory, obscene, deceptive, or copyrighted media without lawful authorization.</li>
            <li>Never scrape, reverse engineer, or harvest user data using automated bots or scripts.</li>
          </Box>

          <Typography variant="h5" component="h2" sx={{ fontWeight: 700, color: '#8B1E1E', mt: 4, mb: 1.5 }}>
            3. Account Termination
          </Typography>
          <Typography variant="body1" sx={{ color: '#2D1810', lineHeight: 1.8, mb: 3 }}>
            Shree Ganda reserves the right to suspend or terminate accounts for non-compliance or fraudulent representation. Immediate account suspension or permanent termination may occur without prior notice upon receipt of credible proof regarding:
          </Typography>
          <Box component="ul" sx={{ pl: 4, color: '#2D1810', lineHeight: 1.8, mb: 3 }}>
            <li>Falsification of age, identity documents, marital status, or photograph imposture.</li>
            <li>Harassment, abusive messaging, or stalking of other members.</li>
            <li>Misuse of contact information acquired through premium service for unsolicited sales or spam.</li>
          </Box>

          <Typography variant="h5" component="h2" sx={{ fontWeight: 700, color: '#8B1E1E', mt: 4, mb: 1.5 }}>
            4. Membership Subscriptions and Payments
          </Typography>
          <Typography variant="body1" sx={{ color: '#2D1810', lineHeight: 1.8, mb: 3 }}>
            Free basic memberships allow profile setup and browsing. Upgraded tier plans (Silver, Premium) unlock verified contact access and match counselor assistance. All prices are listed in Indian Rupees (INR) and are inclusive of applicable GST.
          </Typography>

          <Typography variant="h5" component="h2" sx={{ fontWeight: 700, color: '#8B1E1E', mt: 4, mb: 1.5 }}>
            5. Dispute Jurisdiction
          </Typography>
          <Typography variant="body1" sx={{ color: '#2D1810', lineHeight: 1.8, mb: 3 }}>
            These terms are governed by the laws of India and subject to the exclusive jurisdiction of the courts of Bengaluru. Any legal dispute, arbitration, or statutory claim arising from or related to the usage of Shree Ganda Matrimony shall be resolved exclusively through competent courts located in Bengaluru, Karnataka.
          </Typography>
        </Paper>
      </Container>

      <Footer />
    </Box>
  );
};

export default TermsAndConditions;
