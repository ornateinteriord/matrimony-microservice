import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  InputAdornment,
  CircularProgress,
  Alert,
  Tooltip,
  Paper,
} from "@mui/material";
import {
  Close,
  ContentCopy,
  Check,
  WhatsApp,
  Visibility,
  VisibilityOff,
  Link as LinkIcon,
  Key,
  Security,
  Refresh,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import { useGenerateLoginLinkMutation } from "../../api/Auth";

interface GenerateLoginLinkDialogProps {
  open: boolean;
  onClose: () => void;
}

const GenerateLoginLinkDialog: React.FC<GenerateLoginLinkDialogProps> = ({
  open,
  onClose,
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [targetUser, setTargetUser] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const { mutate: generateLink, isPending } = useGenerateLoginLinkMutation();

  const handleClose = () => {
    onClose();
    // Reset form on close after a brief delay
    setTimeout(() => {
      setUsername("");
      setPassword("");
      setGeneratedLink(null);
      setTargetUser(null);
      setCopied(false);
      setShowPassword(false);
    }, 200);
  };

  const handleReset = () => {
    setUsername("");
    setPassword("");
    setGeneratedLink(null);
    setTargetUser(null);
    setCopied(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      toast.error("Please enter the user's username or registration number");
      return;
    }
    if (!password) {
      toast.error("Please enter the user's password");
      return;
    }

    generateLink(
      { username: username.trim(), password },
      {
        onSuccess: (res) => {
          if (res?.loginUrl) {
            setGeneratedLink(res.loginUrl);
            setTargetUser(res.user || null);
          }
        },
      }
    );
  };

  const handleCopy = () => {
    if (!generatedLink) return;
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    toast.success("Login link copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareWhatsApp = () => {
    if (!generatedLink) return;
    const userName = targetUser?.first_name || targetUser?.username || "Member";
    const text = encodeURIComponent(
      `Hello ${userName}!\n\nHere is your direct 1-click login link for Sangam Sathi Matrimony:\n👉 ${generatedLink}\n\nSimply click the link above to log in automatically without typing your password.\n\n⚠️ Note: This link is valid for 15 days and works for a single login for your account security.`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "16px",
          overflow: "hidden",
          p: 0,
          boxShadow: "0 12px 40px rgba(0,0,0,0.18)",
        },
      }}
    >
      {/* Clean Compact Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 3,
          py: 2,
          borderBottom: "1px solid #e2e8f0",
          backgroundColor: "#ffffff",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: "10px",
              backgroundColor: "rgba(123, 31, 162, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#7b1fa2",
              flexShrink: 0,
            }}
          >
            <Key fontSize="small" />
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#1e293b", lineHeight: 1.2 }}>
              Generate Direct Login Link
            </Typography>
            <Typography variant="caption" sx={{ color: "#64748b", display: "block", mt: 0.2 }}>
              Assisted 1-click login for users who struggle to log in
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={handleClose} size="small" sx={{ color: "#94a3b8", "&:hover": { color: "#334155" } }}>
          <Close fontSize="small" />
        </IconButton>
      </Box>

      <DialogContent sx={{ px: 3, py: 2.5, m: 0 }}>
        {!generatedLink ? (
          <form onSubmit={handleSubmit} id="generate-link-form">
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: "#334155", mb: 0.8 }}>
                  User's Username, Email, or Registration No. *
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="e.g. S0123 or user's email / mobile"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isPending}
                  autoFocus
                />
              </Box>

              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: "#334155", mb: 0.8 }}>
                  User's Password *
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter the user's password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isPending}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          size="small"
                          sx={{ color: "#64748b" }}
                        >
                          {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </Box>
          </form>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Alert
              severity="success"
              sx={{
                borderRadius: "10px",
                fontSize: "0.9rem",
                fontWeight: 500,
              }}
            >
              Login link generated for{" "}
              <strong>
                {targetUser?.first_name || targetUser?.username || "the user"}{" "}
                {targetUser?.registration_no ? `(${targetUser.registration_no})` : ""}
              </strong>
              !
            </Alert>

            <Paper
              variant="outlined"
              sx={{
                p: 2,
                backgroundColor: "#f8fafc",
                borderColor: "#e2e8f0",
                borderRadius: "12px",
              }}
            >
              <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 600 }}>
                ONE-TIME LOGIN LINK (Valid for 15 days):
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: "monospace",
                  fontWeight: 600,
                  color: "#0f172a",
                  wordBreak: "break-all",
                  mt: 0.8,
                  backgroundColor: "#ffffff",
                  p: 1.5,
                  borderRadius: "8px",
                  border: "1px dashed #cbd5e1",
                }}
              >
                {generatedLink}
              </Typography>

              <Box sx={{ display: "flex", gap: 1.5, mt: 2, flexWrap: "wrap" }}>
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleCopy}
                  startIcon={copied ? <Check /> : <ContentCopy />}
                  sx={{
                    backgroundColor: copied ? "#16a34a" : "#0f172a",
                    color: "#fff",
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: "8px",
                    px: 2,
                    "&:hover": {
                      backgroundColor: copied ? "#15803d" : "#1e293b",
                    },
                  }}
                >
                  {copied ? "Copied!" : "Copy Link"}
                </Button>

                <Button
                  variant="outlined"
                  size="small"
                  color="success"
                  onClick={handleShareWhatsApp}
                  startIcon={<WhatsApp />}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: "8px",
                    px: 2,
                  }}
                >
                  Share on WhatsApp
                </Button>

                <Button
                  variant="text"
                  size="small"
                  onClick={() => window.open(generatedLink, "_blank")}
                  startIcon={<LinkIcon />}
                  sx={{
                    color: "#475569",
                    textTransform: "none",
                    fontWeight: 500,
                  }}
                >
                  Test Link
                </Button>
              </Box>
            </Paper>

            <Typography variant="caption" sx={{ color: "#64748b", display: "block" }}>
              ℹ️ Once the user opens this link, they will be logged into their dashboard automatically and their session will remain active for 15 days in their browser.
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, borderTop: "1px solid #e2e8f0", backgroundColor: "#f8fafc" }}>
        {!generatedLink ? (
          <>
            <Button onClick={handleClose} sx={{ color: "#64748b", textTransform: "none" }}>
              Cancel
            </Button>
            <Button
              type="submit"
              form="generate-link-form"
              variant="contained"
              disabled={isPending}
              startIcon={isPending ? <CircularProgress size={18} sx={{ color: "#fff" }} /> : <Key />}
              sx={{
                backgroundColor: "#7b1fa2",
                color: "#fff",
                fontWeight: 600,
                textTransform: "none",
                borderRadius: "8px",
                px: 2.5,
                "&:hover": { backgroundColor: "#6a1b9a" },
              }}
            >
              {isPending ? "Generating..." : "Generate Link"}
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={handleReset}
              startIcon={<Refresh />}
              sx={{ color: "#475569", textTransform: "none", mr: "auto" }}
            >
              Generate Another
            </Button>
            <Button
              onClick={handleClose}
              variant="contained"
              sx={{
                backgroundColor: "#0f172a",
                color: "#fff",
                textTransform: "none",
                borderRadius: "8px",
                px: 2.5,
              }}
            >
              Done
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default GenerateLoginLinkDialog;
