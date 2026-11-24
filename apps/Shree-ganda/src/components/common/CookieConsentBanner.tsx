import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Button, Stack, Link as MuiLink } from '@mui/material';
import { Cookie as CookieIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';

export interface CookieConsentRecord {
  essential: boolean;
  analytics: boolean;
  timestamp: number;
}

const STORAGE_KEY = 'shreeganda_cookie_consent';

export const CookieConsentBanner: React.FC = () => {
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    const record: CookieConsentRecord = {
      essential: true,
      analytics: true,
      timestamp: Date.now(),
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
    } catch (e) {
      console.warn('Could not save cookie consent:', e);
    }
    setVisible(false);
  };

  const handleNecessaryOnly = () => {
    const record: CookieConsentRecord = {
      essential: true,
      analytics: false,
      timestamp: Date.now(),
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
    } catch (e) {
      console.warn('Could not save cookie consent:', e);
    }
    setVisible(false);
  };

  if (!visible) {
    return null;
  }

  return (
    <Paper
      elevation={8}
      role="region"
      aria-label="Cookie Consent"
      sx={{
        position: 'fixed',
        bottom: { xs: 65, md: 24 },
        left: { xs: 12, sm: 24 },
        right: { xs: 12, sm: 'auto' },
        maxWidth: { sm: 460 },
        zIndex: 1400,
        p: 2.5,
        borderRadius: '8px',
        backgroundColor: '#FFFFFF',
        border: '1px solid rgba(197, 160, 89, 0.4)',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 1.5 }}>
        <CookieIcon sx={{ color: '#C5A059', fontSize: 28, mt: 0.2 }} />
        <Box>
          {/* Note: Use Typography component="div" or variant="subtitle1" to avoid injecting secondary <h1> */}
          <Typography
            variant="subtitle1"
            component="div"
            sx={{ fontWeight: 700, color: '#8B1E1E', lineHeight: 1.2, mb: 0.5 }}
          >
            We Value Your Privacy
          </Typography>
          <Typography variant="body2" sx={{ color: '#5C4033', fontSize: '0.85rem', lineHeight: 1.5 }}>
            Shree Ganda Matrimony uses cookies to ensure secure authentication, remember preferences, and improve matchmaking journeys under the DPDP Act 2023. Read our{' '}
            <MuiLink
              component={Link}
              to="/cookie-policy"
              sx={{ color: '#8B1E1E', fontWeight: 600, textDecoration: 'underline' }}
            >
              Cookie Policy
            </MuiLink>
            .
          </Typography>
        </Box>
      </Box>

      <Stack direction="row" spacing={1.5} justifyContent="flex-end" sx={{ mt: 2 }}>
        <Button
          variant="outlined"
          size="small"
          onClick={handleNecessaryOnly}
          sx={{
            borderColor: '#C5A059',
            color: '#2D1810',
            fontWeight: 600,
            fontSize: '0.8rem',
            textTransform: 'none',
            borderRadius: '6px',
            '&:hover': {
              borderColor: '#9E7B3B',
              backgroundColor: 'rgba(197, 160, 89, 0.08)',
            },
          }}
        >
          Necessary Only
        </Button>

        <Button
          variant="contained"
          size="small"
          onClick={handleAcceptAll}
          sx={{
            backgroundColor: '#8B1E1E',
            color: '#FFFFFF',
            fontWeight: 600,
            fontSize: '0.8rem',
            textTransform: 'none',
            borderRadius: '6px',
            '&:hover': {
              backgroundColor: '#6B1717',
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
