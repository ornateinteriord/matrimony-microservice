import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Stack, Container } from "@mui/material";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          backgroundColor: '#F8FAFC',
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
            background: '#FFFFFF',
            p: { xs: 3, sm: 5 },
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(11, 25, 44, 0.08)',
            border: '1px solid rgba(11, 25, 44, 0.06)',
          }}
        >
          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontSize: { xs: '3.5rem', sm: '5rem' },
              fontWeight: 800,
              mb: 1,
              color: '#0B192C',
              letterSpacing: '-1px',
            }}
          >
            404
          </Typography>

          <Typography
            variant="h5"
            component="h2"
            sx={{
              fontSize: { xs: '1.25rem', sm: '1.5rem' },
              fontWeight: 700,
              mb: 2,
              color: '#D4AF37',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
          >
            Page Not Found
          </Typography>

          <Typography
            variant="body1"
            sx={{
              fontSize: '1rem',
              color: '#475569',
              mb: 4,
              lineHeight: 1.6,
            }}
          >
            The page you are looking for does not exist, has been removed, or is temporarily unavailable.
            Please verify the address or use the navigation options below.
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button
              variant="contained"
              onClick={() => navigate('/')}
              sx={{
                textTransform: 'none',
                backgroundColor: '#0B192C',
                color: '#FFFFFF',
                fontWeight: 600,
                borderRadius: '8px',
                px: 3.5,
                py: 1.2,
                '&:hover': {
                  backgroundColor: '#1E3E62',
                  boxShadow: '0 4px 14px rgba(11, 25, 44, 0.25)',
                },
              }}
            >
              Return to Home
            </Button>

            <Button
              variant="outlined"
              onClick={() => navigate(-1)}
              sx={{
                textTransform: 'none',
                color: '#0B192C',
                borderColor: 'rgba(11, 25, 44, 0.3)',
                fontWeight: 600,
                borderRadius: '8px',
                px: 3.5,
                py: 1.2,
                '&:hover': {
                  borderColor: '#0B192C',
                  backgroundColor: 'rgba(11, 25, 44, 0.04)',
                },
              }}
            >
              Go Back
            </Button>
          </Stack>
        </Box>
      </Box>
    </Container>
  );
};

export default NotFoundPage;
