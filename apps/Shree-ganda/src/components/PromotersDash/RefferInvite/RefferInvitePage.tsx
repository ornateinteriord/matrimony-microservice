import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  Grid,
  Card,
  CircularProgress
} from '@mui/material';
import { Send, ContentCopy, WhatsApp, Check, Link as LinkIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import TokenService from '../../token/tokenService';
import { useReferUser } from '../../api/Promoter';

const ReferInvitePage = () => {
  const decodedToken = TokenService.decodeToken();
  const promoCode = decodedToken?.promoter_id || "";
  const referralLink = typeof window !== 'undefined' ? `${window.location.origin}/register?ref=${promoCode}` : "";
  const [copied, setCopied] = useState(false);

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const { mutate: referUser, isPending } = useReferUser();

  const handleCopyLink = () => {
    if (!promoCode) {
      toast.error("Promoter code not available.");
      return;
    }
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success("Referral link copied!");
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareWhatsApp = () => {
    if (!promoCode) return;
    const text = encodeURIComponent(
      `Hello! Register on Shree Gandha Matrimony with my referral code ${promoCode} or click here: ${referralLink}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  const handleRefer = () => {
    if (!email.trim() || !phone.trim()) {
      toast.error("Please enter both email and phone number.");
      return;
    }

    referUser(
      { email: email.trim(), phone: phone.trim() },
      {
        onSuccess: (res: any) => {
          toast.success(res?.message || "User referred successfully!");
          setEmail('');
          setPhone('');
        },
        onError: (err: any) => {
          const errMsg = err?.response?.data?.message || err?.message || "Failed to refer user.";
          toast.error(errMsg);
        },
      }
    );
  };

  return (
    <Box sx={{
      p: 0,
      ml: { xs: 0, md: 2 },
      mt: { xs: 1, md: 2 }, 
      maxWidth: 900,
      borderRadius: 2
    }}>

      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          mb: 3,
          color: 'primary.main',
          textAlign: 'center'
        }}
      >
        Invite Your Friends & Family
      </Typography>

      {/* Direct Referral Link Card */}
      <Card
        sx={{
          mb: 4,
          p: { xs: 2, sm: 2.5 },
          borderRadius: "12px",
          border: "1px solid #e2e8f0",
          backgroundColor: "#ffffff",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 600, color: "#64748b", mb: 0.5 }}>
          Your Referral Link
        </Typography>

        <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 1.5, alignItems: "center" }}>
          <TextField
            fullWidth
            size="small"
            value={referralLink}
            InputProps={{
              readOnly: true,
              startAdornment: <LinkIcon sx={{ color: "#64748b", mr: 1 }} fontSize="small" />,
              sx: {
                backgroundColor: "#f8fafc",
                color: "#0f172a",
                fontFamily: "monospace",
                fontSize: "0.88rem",
                borderRadius: "8px",
              },
            }}
          />
          <Box sx={{ display: "flex", gap: 1, width: { xs: "100%", sm: "auto" } }}>
            <Button
              size="small"
              variant="contained"
              onClick={handleCopyLink}
              startIcon={copied ? <Check /> : <ContentCopy />}
              sx={{
                backgroundColor: copied ? "#16a34a" : "#0B192C",
                color: "#fff",
                fontWeight: 600,
                textTransform: "none",
                whiteSpace: "nowrap",
                borderRadius: "8px",
                px: 2,
                "&:hover": { backgroundColor: copied ? "#15803d" : "#1e293b" },
              }}
            >
              {copied ? "Copied" : "Copy"}
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="success"
              onClick={handleShareWhatsApp}
              startIcon={<WhatsApp />}
              sx={{
                fontWeight: 600,
                textTransform: "none",
                whiteSpace: "nowrap",
                borderRadius: "8px",
                px: 2,
              }}
            >
              WhatsApp
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={() => window.open(referralLink, "_blank")}
              sx={{
                color: "#0B192C",
                borderColor: "#cbd5e1",
                fontWeight: 600,
                textTransform: "none",
                whiteSpace: "nowrap",
                borderRadius: "8px",
                px: 2,
                "&:hover": { borderColor: "#0B192C" },
              }}
            >
              Add User
            </Button>
          </Box>
        </Box>
      </Card>

      {/* Refer Form Card */}
      <Card
        sx={{
          mb: 4,
          p: { xs: 2.5, sm: 3 },
          borderRadius: "12px",
          border: "1px solid #e2e8f0",
          backgroundColor: "#ffffff",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            mb: 2.5,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            color: '#0f172a'
          }}
        >
          <Send sx={{ color: 'primary.main' }} /> Refer
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={2.5}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email ID"
              variant="outlined"
              placeholder="example@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isPending}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Mobile No"
              variant="outlined"
              placeholder="9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={isPending}
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 1 }}>
              <Button
                variant="contained"
                onClick={handleRefer}
                disabled={isPending}
                startIcon={isPending ? <CircularProgress size={20} color="inherit" /> : <Send />}
                sx={{
                  px: 4,
                  py: 1.2,
                  textTransform: 'capitalize',
                  fontWeight: 600,
                  borderRadius: '8px',
                  backgroundColor: '#0B192C',
                  '&:hover': {
                    backgroundColor: '#1e293b',
                  },
                }}
              >
                {isPending ? 'Referring...' : 'Refer'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
};

export default ReferInvitePage;
