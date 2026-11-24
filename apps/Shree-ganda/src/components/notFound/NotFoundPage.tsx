import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Stack } from "@mui/material";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        backgroundColor: '#FDFBF7',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 4,
        color: '#2D1810'
      }}
    >
      <Box sx={{ maxWidth: '600px' }}>
        <Typography
          variant="h1"
          component="h1"
          sx={{
            fontSize: { xs: '2.5rem', sm: '3.5rem' },
            fontWeight: 700,
            mb: 2,
            color: '#8B1E1E'
          }}
        >
          404 - Page Not Found
        </Typography>

        <Typography
          variant="body1"
          sx={{
            fontSize: '1.1rem',
            color: '#5C4033',
            mb: 4,
            lineHeight: 1.6
          }}
        >
          The page you are looking for does not exist, has been moved, or is temporarily unavailable.
          Please check the URL or use the options below to continue.
        </Typography>

        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            variant="contained"
            onClick={() => navigate('/')}
            sx={{
              textTransform: 'none',
              backgroundColor: '#8B1E1E',
              color: '#FFFFFF',
              fontWeight: 600,
              borderRadius: '6px',
              '&:hover': { backgroundColor: '#6B1717' },
              px: 3,
              py: 1.2
            }}
          >
            Return to Home
          </Button>

          <Button
            variant="outlined"
            onClick={() => navigate(-1)}
            sx={{
              textTransform: 'none',
              color: '#8B1E1E',
              borderColor: '#8B1E1E',
              fontWeight: 600,
              borderRadius: '6px',
              '&:hover': {
                backgroundColor: 'rgba(139, 30, 30, 0.08)',
                borderColor: '#6B1717',
                color: '#6B1717'
              },
              px: 3,
              py: 1.2
            }}
          >
            Go Back
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default NotFoundPage;
