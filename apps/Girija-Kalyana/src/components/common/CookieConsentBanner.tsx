import React, { useState, useEffect } from "react";
import { Box, Paper, Typography, Button, Stack } from "@mui/material";
import { Cookie } from "@mui/icons-material";
import { Link } from "react-router-dom";

export const CookieConsentBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem("cookieConsent");
      if (!consent) {
        setIsVisible(true);
      }
    } catch (e) {
      // LocalStorage access issues
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem("cookieConsent", "accepted");
    } catch (e) {}
    setIsVisible(false);
  };

  const handleDecline = () => {
    try {
      localStorage.setItem("cookieConsent", "declined");
    } catch (e) {}
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: { xs: 72, md: 24 }, // Safe spacing above BottomNav on mobile
        left: { xs: 12, md: 24 },
        right: { xs: 12, md: "auto" },
        maxWidth: { xs: "calc(100% - 24px)", md: 460 },
        zIndex: 1400,
      }}
    >
      <Paper
        elevation={8}
        sx={{
          p: 2.5,
          borderRadius: "8px",
          backgroundColor: "#ffffff",
          border: "1px solid rgba(136, 19, 55, 0.2)",
          boxShadow: "0 8px 30px rgba(136, 19, 55, 0.15)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, mb: 1.5 }}>
          <Cookie sx={{ color: "#D97706", fontSize: 28, mt: 0.2 }} />
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#881337" }}>
              Cookie & Data Privacy Notice
            </Typography>
            <Typography variant="body2" sx={{ color: "#4b5563", fontSize: "0.82rem", mt: 0.5, lineHeight: 1.5 }}>
              We use essential cookies to maintain secure sessions, remember matrimonial search preferences, and ensure DPDP Act 2023 compliance.{" "}
              <Link
                to="/cookie-policy"
                style={{ color: "#881337", fontWeight: 600, textDecoration: "underline" }}
              >
                Learn more
              </Link>
            </Typography>
          </Box>
        </Box>

        <Stack direction="row" spacing={1.5} justifyContent="flex-end">
          <Button
            size="small"
            variant="outlined"
            onClick={handleDecline}
            sx={{
              color: "#6b7280",
              borderColor: "#d1d5db",
              textTransform: "none",
              fontSize: "0.8rem",
              borderRadius: "6px",
              "&:hover": { borderColor: "#9ca3af", backgroundColor: "#f9fafb" },
            }}
          >
            Decline Non-Essential
          </Button>

          <Button
            size="small"
            variant="contained"
            onClick={handleAccept}
            sx={{
              backgroundColor: "#881337",
              color: "#ffffff",
              textTransform: "none",
              fontSize: "0.8rem",
              fontWeight: 600,
              borderRadius: "6px",
              "&:hover": { backgroundColor: "#70102e" },
            }}
          >
            Accept All
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default CookieConsentBanner;
