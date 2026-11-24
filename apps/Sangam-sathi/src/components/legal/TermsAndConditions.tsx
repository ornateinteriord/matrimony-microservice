import React from 'react';
import { Container, Box, Typography, Paper, Divider, Breadcrumbs, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import Navbar from '../navbar/Navbar';
import Footer from '../footer/Footer';
import SEOHead from '../common/SEOHead';

const TermsAndConditions: React.FC = () => {
  return (
    <>
      <SEOHead
        title="Terms and Conditions"
        description="Terms and Conditions for Sangam Sathi. Understand eligibility criteria, account responsibilities, membership guidelines, and dispute resolution."
        canonicalUrl="https://sangamsathi.com/terms"
      />
      <Navbar />
      <Box sx={{ backgroundColor: '#F8FAFC', minHeight: '100vh', pt: { xs: 10, md: 12 }, pb: 8 }}>
        <Container maxWidth="lg">
          <Breadcrumbs sx={{ mb: 3 }}>
            <MuiLink component={Link} to="/" color="inherit" underline="hover">
              Home
            </MuiLink>
            <Typography color="text.primary">Terms and Conditions</Typography>
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
              Terms and Conditions
            </Typography>

            <Typography variant="body2" sx={{ color: '#64748B', mb: 3 }}>
              Effective Date: November 2026 | Legal Agreement Governing Use of Sangam Sathi
            </Typography>

            <Divider sx={{ mb: 4 }} />

            <Typography variant="h5" component="h2" sx={{ color: '#0B192C', fontWeight: 700, mt: 3, mb: 1.5 }}>
              1. Platform Purpose &amp; Marriage Intent
            </Typography>
            <Typography variant="body1" sx={{ color: '#334155', mb: 2, lineHeight: 1.8 }}>
              Sangam Sathi is exclusively a matrimony portal designed to assist eligible men and women in finding life partners for lawful solemnization of marriage. This platform is not a dating service or a casual social networking site. Any registration made for purposes other than matrimonial alliance is strictly forbidden.
            </Typography>

            <Typography variant="h5" component="h2" sx={{ color: '#0B192C', fontWeight: 700, mt: 3, mb: 1.5 }}>
              2. Eligibility Criteria
            </Typography>
            <Typography variant="body1" sx={{ color: '#334155', mb: 2, lineHeight: 1.8 }}>
              To register, browse, or initiate matrimonial connections on Sangam Sathi, you represent and warrant that:
            </Typography>
            <Box component="ul" sx={{ pl: 4, mb: 2, color: '#334155', lineHeight: 1.8 }}>
              <li>You are legally competent to enter into a marriage under the laws applicable to you. In India, minimum legal age is 18 years for females and 21 years for males.</li>
              <li>You are legally single, widowed, or legally divorced with a valid decree of divorce.</li>
              <li>You are not barred by any court order, statute, or law from contracting a marriage.</li>
            </Box>

            <Typography variant="h5" component="h2" sx={{ color: '#0B192C', fontWeight: 700, mt: 3, mb: 1.5 }}>
              3. Account Security and Accurate Representations
            </Typography>
            <Typography variant="body1" sx={{ color: '#334155', mb: 2, lineHeight: 1.8 }}>
              You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account. You warrant that all profile information, educational qualifications, marital status, identity proofs, and photographs uploaded are authentic, accurate, and current.
            </Typography>

            <Typography variant="h5" component="h2" sx={{ color: '#0B192C', fontWeight: 700, mt: 3, mb: 1.5 }}>
              4. Prohibited Conduct
            </Typography>
            <Typography variant="body1" sx={{ color: '#334155', mb: 2, lineHeight: 1.8 }}>
              Members are expressly prohibited from:
            </Typography>
            <Box component="ul" sx={{ pl: 4, mb: 2, color: '#334155', lineHeight: 1.8 }}>
              <li>Soliciting money, gifts, dowry, or financial favors from other members or promoters.</li>
              <li>Posting abusive, defamatory, obscene, harassing, or sexually explicit content or photographs.</li>
              <li>Creating multiple duplicate accounts or impersonating another living or deceased person.</li>
              <li>Scraping profile data, automated harvesting, or sharing contact information of members without consent.</li>
            </Box>

            <Typography variant="h5" component="h2" sx={{ color: '#0B192C', fontWeight: 700, mt: 3, mb: 1.5 }}>
              5. Dispute Resolution and Governing Law
            </Typography>
            <Typography variant="body1" sx={{ color: '#334155', mb: 2, lineHeight: 1.8 }}>
              These Terms and Conditions and any dispute or claim arising out of or in connection with them shall be governed by and construed in accordance with the laws of India. Any legal dispute shall be subject to the exclusive jurisdiction of the competent civil courts in Bengaluru, Karnataka, India.
            </Typography>
          </Paper>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default TermsAndConditions;
