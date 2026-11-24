import React from 'react';
import { Box, Typography, Button, Container, Stack } from '@mui/material';
import { ErrorOutline as ErrorIcon, Refresh as RefreshIcon, Home as HomeIcon } from '@mui/icons-material';

export interface Error500PageProps {
  error?: Error | null;
  resetErrorBoundary?: () => void;
}

export const Error500Page: React.FC<Error500PageProps> = ({ error, resetErrorBoundary }) => {
  const handleReload = () => {
    if (resetErrorBoundary) {
      resetErrorBoundary();
    } else {
      window.location.reload();
    }
  };

  const handleHome = () => {
    window.location.href = '/';
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          py: 8,
          px: 3,
        }}
      >
        <Box
          sx={{
            maxWidth: '560px',
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            p: { xs: 3, sm: 5 },
            boxShadow: '0 4px 24px rgba(11, 25, 44, 0.1)',
            border: '1px solid rgba(11, 25, 44, 0.08)',
          }}
        >
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 72,
              height: 72,
              borderRadius: '50%',
              backgroundColor: 'rgba(212, 175, 55, 0.15)',
              color: '#0B192C',
              mb: 2,
            }}
          >
            <ErrorIcon sx={{ fontSize: 42, color: '#D4AF37' }} />
          </Box>

          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontSize: { xs: '2.5rem', sm: '3.5rem' },
              fontWeight: 800,
              color: '#0B192C',
              letterSpacing: '-1px',
              mb: 1,
            }}
          >
            500
          </Typography>

          <Typography
            variant="h5"
            component="h2"
            sx={{
              fontSize: { xs: '1.2rem', sm: '1.4rem' },
              fontWeight: 700,
              color: '#D4AF37',
              mb: 2,
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
            }}
          >
            Internal Server Error
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: '#475569',
              fontSize: '1rem',
              mb: 4,
              lineHeight: 1.6,
            }}
          >
            An unexpected error occurred while processing your request.
            Our technical team has been notified. Please try reloading the page or returning home.
          </Typography>

          {error && process.env.NODE_ENV !== 'production' && (
            <Box
              sx={{
                mb: 3,
                p: 2,
                backgroundColor: '#F8FAFC',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
                textAlign: 'left',
                overflowX: 'auto',
              }}
            >
              <Typography variant="caption" sx={{ fontFamily: 'monospace', color: '#DC2626' }}>
                {error.toString()}
              </Typography>
            </Box>
          )}

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={handleReload}
              sx={{
                backgroundColor: '#0B192C',
                color: '#FFFFFF',
                borderRadius: '8px',
                px: 3,
                py: 1.2,
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: '#1E3E62',
                  boxShadow: '0 4px 14px rgba(11, 25, 44, 0.25)',
                },
              }}
            >
              Try Again
            </Button>

            <Button
              variant="outlined"
              startIcon={<HomeIcon />}
              onClick={handleHome}
              sx={{
                color: '#0B192C',
                borderColor: 'rgba(11, 25, 44, 0.3)',
                borderRadius: '8px',
                px: 3,
                py: 1.2,
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': {
                  borderColor: '#0B192C',
                  backgroundColor: 'rgba(11, 25, 44, 0.04)',
                },
              }}
            >
              Return Home
            </Button>
          </Stack>
        </Box>
      </Box>
    </Container>
  );
};

export default Error500Page;
