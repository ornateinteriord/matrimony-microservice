import React from 'react';
import { Box, Typography, Button, Stack, Container, Paper } from '@mui/material';
import { ErrorOutline as ErrorOutlineIcon, Refresh as RefreshIcon, Home as HomeIcon } from '@mui/icons-material';

export interface Error500PageProps {
  error?: Error | null;
  resetErrorBoundary?: () => void;
}

export const Error500Page: React.FC<Error500PageProps> = ({
  error,
  resetErrorBoundary,
}) => {
  const handleReload = () => {
    if (resetErrorBoundary) {
      resetErrorBoundary();
    } else {
      window.location.reload();
    }
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FDFBF7',
        py: 4,
        px: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={4}
          sx={{
            p: { xs: 3, sm: 5 },
            textAlign: 'center',
            borderRadius: '8px',
            backgroundColor: '#FFFFFF',
            border: '1px solid rgba(197, 160, 89, 0.3)',
          }}
        >
          <Box
            sx={{
              display: 'inline-flex',
              p: 2,
              borderRadius: '50%',
              backgroundColor: 'rgba(139, 30, 30, 0.08)',
              color: '#8B1E1E',
              mb: 2,
            }}
          >
            <ErrorOutlineIcon sx={{ fontSize: 56 }} />
          </Box>

          {/* Exactly one semantic h1 heading */}
          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontSize: { xs: '1.8rem', sm: '2.4rem' },
              fontWeight: 700,
              color: '#8B1E1E',
              mb: 1.5,
            }}
          >
            500 - Server Error
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: '#5C4033',
              fontSize: '1rem',
              lineHeight: 1.6,
              mb: 3,
            }}
          >
            An unexpected error occurred while processing your request. Our technical team has been notified. Please try refreshing the page or returning home.
          </Typography>

          {error && process.env.NODE_ENV === 'development' && (
            <Box
              sx={{
                p: 2,
                mb: 3,
                backgroundColor: '#FFF1F2',
                borderRadius: '6px',
                textAlign: 'left',
                overflowX: 'auto',
                fontSize: '0.85rem',
                color: '#991B1B',
                fontFamily: 'monospace',
              }}
            >
              {error.message}
            </Box>
          )}

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="center"
          >
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={handleReload}
              sx={{
                backgroundColor: '#8B1E1E',
                color: '#FFFFFF',
                fontWeight: 600,
                borderRadius: '6px',
                px: 3,
                py: 1.2,
                '&:hover': {
                  backgroundColor: '#6B1717',
                },
              }}
            >
              Try Again
            </Button>

            <Button
              variant="outlined"
              startIcon={<HomeIcon />}
              onClick={handleGoHome}
              sx={{
                borderColor: '#C5A059',
                color: '#2D1810',
                fontWeight: 600,
                borderRadius: '6px',
                px: 3,
                py: 1.2,
                '&:hover': {
                  borderColor: '#9E7B3B',
                  backgroundColor: 'rgba(197, 160, 89, 0.08)',
                },
              }}
            >
              Return to Home
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default Error500Page;
