import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Stack, Container, Paper } from "@mui/material";
import { Home, ArrowBack } from "@mui/icons-material";

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

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
            border: "1px solid rgba(217, 119, 6, 0.2)",
          }}
        >
          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontSize: { xs: "3.5rem", sm: "5rem" },
              fontWeight: 800,
              color: "#881337",
              lineHeight: 1,
              mb: 1,
            }}
          >
            404
          </Typography>

          <Typography
            variant="h4"
            component="h2"
            sx={{
              fontWeight: 700,
              color: "#D97706",
              mb: 2,
              fontSize: { xs: "1.4rem", sm: "1.8rem" },
            }}
          >
            Page Not Found
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "#4b5563",
              mb: 4,
              lineHeight: 1.6,
            }}
          >
            The matrimonial page you are seeking does not exist or may have been relocated.
            Please verify the address or continue your search through our verified profiles.
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center"
          >
            <Button
              variant="contained"
              startIcon={<Home />}
              onClick={() => navigate("/")}
              sx={{
                backgroundColor: "#881337",
                color: "#ffffff",
                px: 3,
                py: 1.2,
                borderRadius: "8px",
                "&:hover": { backgroundColor: "#70102e" },
              }}
            >
              Return Home
            </Button>

            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() => navigate(-1)}
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
              Go Back
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default NotFoundPage;
