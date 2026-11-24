import React, { useEffect } from 'react';
import { Box, Container, Typography, Paper, Divider, Breadcrumbs, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import Navbar from '../navbar/Navbar';
import Footer from '../footer/Footer';
import usePageMetadata from '../../hooks/usePageMetadata';

export const DataCollectionDisclosure: React.FC = () => {
  usePageMetadata({
    title: 'Data Collection Disclosure - Shree Ganda Matrimony',
    description: 'Detailed disclosure of personal data collection, processing purposes, storage protocols, and security practices by Shree Ganda Matrimony.',
    canonicalUrl: 'https://shreegandha.com/data-collection-disclosure',
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
            Data Collection Disclosure
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
            Shree Ganda Data Collection Disclosure
          </Typography>

          <Typography variant="caption" sx={{ color: '#5C4033', display: 'block', mb: 3 }}>
            Last Updated: November 19, 2026 | In Compliance with DPDP Act 2023
          </Typography>

          <Divider sx={{ mb: 4, borderColor: 'rgba(197, 160, 89, 0.3)' }} />

          <Typography variant="body1" sx={{ color: '#2D1810', lineHeight: 1.8, mb: 3 }}>
            This Data Collection Disclosure document provides full transparency into the specific types of personal, sensitive, and demographic data collected by Shree Ganda Matrimony, the operational purposes of collection, and our strict limits on third-party access.
          </Typography>

          <Typography variant="h5" component="h2" sx={{ fontWeight: 700, color: '#8B1E1E', mt: 4, mb: 1.5 }}>
            1. Purpose of Data Collection
          </Typography>
          <Typography variant="body1" sx={{ color: '#2D1810', lineHeight: 1.8, mb: 3 }}>
            We collect personal information solely to facilitate legitimate matrimonial matchmaking, profile authenticity verification, community compatibility calculation, and secure communication between prospective candidates and their authorized family representatives.
          </Typography>

          <Typography variant="h5" component="h2" sx={{ fontWeight: 700, color: '#8B1E1E', mt: 4, mb: 1.5 }}>
            2. Detailed Data Inventory
          </Typography>

          <Typography variant="h6" component="h3" sx={{ fontWeight: 600, color: '#2D1810', mt: 2, mb: 1 }}>
            A. Candidate Identity &amp; Verification Data
          </Typography>
          <Typography variant="body1" sx={{ color: '#2D1810', lineHeight: 1.8, mb: 2 }}>
            Full legal name, photograph, government-issued photo ID (verified by internal compliance officers and not made public), date of birth, place of birth, and gender.
          </Typography>

          <Typography variant="h6" component="h3" sx={{ fontWeight: 600, color: '#2D1810', mt: 2, mb: 1 }}>
            B. Cultural, Astrological &amp; Community Attributes
          </Typography>
          <Typography variant="body1" sx={{ color: '#2D1810', lineHeight: 1.8, mb: 2 }}>
            Mother tongue, religion, caste, sub-caste, gotra, rashi, nakshatra, and horoscope chart details provided voluntarily to determine horoscope compatibility.
          </Typography>

          <Typography variant="h6" component="h3" sx={{ fontWeight: 600, color: '#2D1810', mt: 2, mb: 1 }}>
            C. Contact &amp; Geographic Information
          </Typography>
          <Typography variant="body1" sx={{ color: '#2D1810', lineHeight: 1.8, mb: 2 }}>
            Primary mobile number, secondary guardian phone number, email address, current city, state, taluk, and permanent residential address.
          </Typography>

          <Typography variant="h6" component="h3" sx={{ fontWeight: 600, color: '#2D1810', mt: 2, mb: 1 }}>
            D. Socio-Economic Profile
          </Typography>
          <Typography variant="body1" sx={{ color: '#2D1810', lineHeight: 1.8, mb: 3 }}>
            Educational qualification, university attended, current employment sector, job title, and annual income range.
          </Typography>

          <Typography variant="h5" component="h2" sx={{ fontWeight: 700, color: '#8B1E1E', mt: 4, mb: 1.5 }}>
            3. Third-Party Sharing Restrictions
          </Typography>
          <Typography variant="body1" sx={{ color: '#2D1810', lineHeight: 1.8, mb: 3 }}>
            Shree Ganda maintains a strict zero-sale policy. We never rent, trade, or monetize user data with third-party advertisers or data brokers. Data is shared exclusively with:
          </Typography>
          <Box component="ul" sx={{ pl: 4, color: '#2D1810', lineHeight: 1.8, mb: 3 }}>
            <li>Other registered, verified users only to the extent permitted by your explicit privacy settings and premium contact access permissions.</li>
            <li>Regulated banking and payment processors (e.g., UPI, Cashfree) to complete subscription billing securely.</li>
            <li>Law enforcement agencies strictly when presented with valid statutory court orders or legal mandates under Indian law.</li>
          </Box>
        </Paper>
      </Container>

      <Footer />
    </Box>
  );
};

export default DataCollectionDisclosure;
