import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Stack } from '@mui/material';
import { Cookie as CookieIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';

export const CookieConsentBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('cookieConsent');
      if (!consent) {
        setIsVisible(true);
      }
    } catch {
      // In case localStorage is blocked
      setIsVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    try {
      localStorage.setItem('cookieConsent', 'accepted');
    } catch (e) {
      console.error('Failed to store cookie consent', e);
    }
    setIsVisible(false);
  };

  const handleDecline = () => {
    try {
      localStorage.setItem('cookieConsent', 'essential_only');
    } catch (e) {
      console.error('Failed to store cookie consent', e);
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <Paper
      elevation={12}
      sx={{
        position: 'fixed',
        bottom: { xs: 70, md: 24 }, // account for mobile bottom nav
        left: { xs: 12, md: 24 },
        right: { xs: 12, md: 'auto' },
        maxWidth: { md: 480 },
        p: { xs: 2, sm: 2.5 },
        backgroundColor: '#0B192C',
        color: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid rgba(212, 175, 55, 0.3)',
        boxShadow: '0 8px 32px rgba(11, 25, 44, 0.4)',
        zIndex: 1300,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 1.5 }}>
        <CookieIcon sx={{ color: '#D4AF37', fontSize: 28, mt: 0.2 }} />
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#D4AF37', mb: 0.5 }}>
            Cookie &amp; Privacy Notice
          </Typography>
          <Typography variant="body2" sx={{ color: '#CBD5E1', fontSize: '0.82rem', lineHeight: 1.5 }}>
            We use necessary cookies to maintain session security and preferences. You can read our{' '}
            <Link to="/cookie-policy" style={{ color: '#D4AF37', textDecoration: 'underline' }}>
              Cookie Policy
            </Link>{' '}
            and{' '}
            <Link to="/privacy-policy" style={{ color: '#D4AF37', textDecoration: 'underline' }}>
              Privacy Policy
            </Link>{' '}
            for full details under the DPDP Act 2023.
          </Typography>
        </Box>
      </Box>

      <Stack direction="row" spacing={1.5} justifyContent="flex-end" sx={{ mt: 1 }}>
        <Button
          size="small"
          onClick={handleDecline}
          sx={{
            color: '#CBD5E1',
            textTransform: 'none',
            fontSize: '0.8rem',
            fontWeight: 500,
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              color: '#FFFFFF',
            },
          }}
        >
          Essential Only
        </Button>
        <Button
          size="small"
          variant="contained"
          onClick={handleAcceptAll}
          sx={{
            backgroundColor: '#D4AF37',
            color: '#0B192C',
            fontWeight: 700,
            fontSize: '0.8rem',
            textTransform: 'none',
            borderRadius: '6px',
            px: 2,
            '&:hover': {
              backgroundColor: '#AA820A',
              color: '#FFFFFF',
            },
          }}
        >
          Accept All
        </Button>
      </Stack>
    </Paper>
  );
};

export default CookieConsentBanner;
