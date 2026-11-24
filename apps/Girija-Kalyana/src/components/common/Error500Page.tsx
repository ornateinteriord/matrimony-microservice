import React from "react";
import { Box, Typography, Button, Stack, Container, Paper } from "@mui/material";
import { Refresh, Home, WarningAmber } from "@mui/icons-material";

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

  const handleReturnHome = () => {
    window.location.href = "/";
  };

  return (
    <Box
      sx={{
        backgroundColor: "#FFFDF9",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 6,
        px: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={4}
          sx={{
            p: { xs: 3, sm: 5 },
            textAlign: "center",
            borderRadius: "8px",
            border: "1px solid rgba(136, 19, 55, 0.15)",
          }}
        >
          <Box
            sx={{
              display: "inline-flex",
              p: 2,
              borderRadius: "50%",
              backgroundColor: "rgba(220, 38, 38, 0.1)",
              color: "#dc2626",
              mb: 2,
            }}
          >
            <WarningAmber sx={{ fontSize: 48 }} />
          </Box>

          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 700,
              color: "#881337",
              mb: 1.5,
              fontSize: { xs: "1.8rem", sm: "2.2rem" },
            }}
          >
            500 - Unexpected System Error
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "#4b5563",
              mb: 3,
              lineHeight: 1.6,
            }}
          >
            We encountered an unexpected technical issue while processing your sacred matchmaking request.
            Our technical team has been notified. Please try refreshing or return to the home page.
          </Typography>

          {error && process.env.NODE_ENV !== "production" && (
            <Box
              sx={{
                mb: 3,
                p: 1.5,
                backgroundColor: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: "6px",
                textAlign: "left",
                fontFamily: "monospace",
                fontSize: "0.8rem",
                color: "#991b1b",
                overflowX: "auto",
              }}
            >
              {error.message || String(error)}
            </Box>
          )}

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center"
          >
            <Button
              variant="contained"
              startIcon={<Refresh />}
              onClick={handleReload}
              sx={{
                backgroundColor: "#881337",
                color: "#ffffff",
                px: 3,
                py: 1.2,
                borderRadius: "8px",
                "&:hover": { backgroundColor: "#70102e" },
              }}
            >
              Reload Page
            </Button>

            <Button
              variant="outlined"
              startIcon={<Home />}
              onClick={handleReturnHome}
              sx={{
                borderColor: "#881337",
                color: "#881337",
                px: 3,
                py: 1.2,
                borderRadius: "8px",
                "&:hover": {
                  borderColor: "#70102e",
                  backgroundColor: "rgba(136, 19, 55, 0.04)",
                },
              }}
            >
              Return Home
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default Error500Page;
