import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  IconButton,
  Alert,
  AlertTitle,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  PersonOutline,
  LockOutlined,
  ArrowBack,
  Favorite,
  Key,
  CheckCircleOutline,
  ErrorOutline,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import { useLoginMutation, useMagicLoginMutation, useResetpassword } from "../api/Auth";
import TokenService from "../token/tokenService";
import "./LoginPage.scss";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tokenParam = searchParams.get("token") || searchParams.get("t");

  // Form states
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Forgot password dialog
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  // Magic login state
  const [magicError, setMagicError] = useState<string | null>(null);
  const hasTriggeredMagic = useRef(false);

  // Mutations
  const { mutate: login, isPending: isLoginPending } = useLoginMutation();
  const { mutate: magicLogin, isPending: isMagicPending } = useMagicLoginMutation();
  const { mutate: resetPassword, isPending: isResetPending } = useResetpassword();

  // If already logged in, redirect to user dashboard
  useEffect(() => {
    const existingToken = TokenService.getToken();
    if (existingToken && !tokenParam) {
      const role = TokenService.getRole()?.toString().toLowerCase();
      if (role === "promoter") {
        navigate("/PromotAdmin", { replace: true });
      } else if (role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/user/userDashboard", { replace: true });
      }
    }
  }, [navigate, tokenParam]);

  // Handle One-Time Magic Login via Token in URL
  useEffect(() => {
    if (tokenParam && !hasTriggeredMagic.current) {
      hasTriggeredMagic.current = true;
      setMagicError(null);

      magicLogin(
        { token: tokenParam.trim() },
        {
          onError: (err: any) => {
            const msg =
              err?.response?.data?.message ||
              "This one-time login link has already been used or has expired. Please log in with your credentials.";
            setMagicError(msg);
          },
        }
      );
    }
  }, [tokenParam, magicLogin]);

  // Load remembered username if present
  useEffect(() => {
    const saved = localStorage.getItem("sangamRememberedUsername");
    if (saved) {
      setFormData((prev) => ({ ...prev, username: saved }));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username.trim() || !formData.password) {
      toast.error("Please enter both username and password");
      return;
    }

    if (rememberMe) {
      localStorage.setItem("sangamRememberedUsername", formData.username.trim());
    } else {
      localStorage.removeItem("sangamRememberedUsername");
    }

    login({
      username: formData.username.trim(),
      password: formData.password,
    });
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      toast.error("Please enter your registered username or email");
      return;
    }
    resetPassword(
      { username: forgotEmail.trim() },
      {
        onSuccess: () => {
          setForgotPasswordOpen(false);
          setForgotEmail("");
        },
      }
    );
  };

  return (
    <div className="user-login-page">
      <div className="user-login-container">
        {/* Back Link */}
        <Link to="/" className="login-back-link">
          <ArrowBack fontSize="small" /> Back to Sangam Sathi
        </Link>

        {/* Login Card */}
        <div className="user-login-card">
          {/* Header */}
          <div className="user-login-header">
            <div className="brand-badge">
              <Favorite className="badge-icon" />
              <span>Sangam Sathi Matrimony</span>
            </div>
            <h1 className="auth-title">
              {tokenParam && !magicError ? "Instant Login" : "Member Login"}
            </h1>
            <p className="auth-subtitle">
              {tokenParam && !magicError
                ? "Verifying your secure login link..."
                : "Welcome back! Please sign in to connect with matches."}
            </p>
          </div>

          {/* Scenario 1: Magic Token In Progress */}
          {tokenParam && isMagicPending && (
            <div className="magic-login-box">
              <div className="magic-icon-wrap">
                <CircularProgress size={36} sx={{ color: "#D4AF37" }} />
              </div>
              <h2 className="magic-title">Signing You In Securely</h2>
              <p className="magic-desc">
                Verifying your one-time assisted login link. You will be redirected to your dashboard in a moment...
              </p>
            </div>
          )}

          {/* Scenario 2: Magic Token Failed or Already Used */}
          {magicError && (
            <Alert
              severity="warning"
              icon={<ErrorOutline />}
              sx={{
                mb: 3,
                borderRadius: "12px",
                backgroundColor: "rgba(255, 152, 0, 0.12)",
                color: "#FFA726",
                border: "1px solid rgba(255, 152, 0, 0.3)",
                "& .MuiAlert-icon": { color: "#FFA726" },
              }}
            >
              <AlertTitle sx={{ fontWeight: 700 }}>Link Notice</AlertTitle>
              {magicError}
              <Typography variant="body2" sx={{ mt: 0.5, color: "#FFE0B2", fontSize: "0.85rem" }}>
                For security reasons, each assisted link can only be used once. Please sign in below using your password.
              </Typography>
            </Alert>
          )}

          {/* Scenario 3: Standard Form (shown when no token, or after magic token error/finish) */}
          {(!tokenParam || magicError) && (
            <form onSubmit={handleManualLogin} className="user-login-form" noValidate>
              <div className="form-group">
                <label htmlFor="username">Username, Email, or Registration No.</label>
                <TextField
                  id="username"
                  name="username"
                  placeholder="e.g. your email or registration number"
                  fullWidth
                  variant="outlined"
                  value={formData.username}
                  onChange={handleChange}
                  autoComplete="username"
                  disabled={isLoginPending}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonOutline className="input-icon" />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <TextField
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  fullWidth
                  variant="outlined"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  disabled={isLoginPending}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlined className="input-icon" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ color: "#94A3B8" }}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </div>

              <div className="form-row-actions">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      size="small"
                    />
                  }
                  label="Remember Me"
                  className="remember-me"
                />
                <button
                  type="button"
                  className="forgot-password-btn"
                  onClick={() => setForgotPasswordOpen(true)}
                >
                  Forgot Password?
                </button>
              </div>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isLoginPending}
                className="submit-btn"
              >
                {isLoginPending ? <CircularProgress size={24} sx={{ color: "#070F1E" }} /> : "Sign In"}
              </Button>
            </form>
          )}

          {/* Footer links */}
          <div className="user-login-footer">
            <p>
              Don't have an account? <Link to="/register">Register Free</Link>
            </p>
            <p>
              Are you a Promoter / Partner? <Link to="/promoter/login">Promoter Login</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Forgot Password Dialog */}
      <Dialog
        open={forgotPasswordOpen}
        onClose={() => setForgotPasswordOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: "#0F172A",
            color: "#F8FAFC",
            borderRadius: "16px",
            border: "1px solid rgba(212, 175, 55, 0.3)",
          },
        }}
      >
        <DialogTitle sx={{ color: "#D4AF37", fontWeight: 700 }}>Reset Password</DialogTitle>
        <form onSubmit={handleForgotPasswordSubmit}>
          <DialogContent sx={{ pt: 1 }}>
            <Typography variant="body2" sx={{ color: "#94A3B8", mb: 2 }}>
              Enter your registered username or email to receive password reset instructions.
            </Typography>
            <TextField
              autoFocus
              fullWidth
              placeholder="Username or Email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              disabled={isResetPending}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  color: "#fff",
                  fieldset: { borderColor: "rgba(255, 255, 255, 0.2)" },
                  "&.Mui-focused fieldset": { borderColor: "#D4AF37" },
                },
              }}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2.5 }}>
            <Button
              onClick={() => setForgotPasswordOpen(false)}
              sx={{ color: "#94A3B8", textTransform: "none" }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isResetPending}
              sx={{
                background: "linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)",
                color: "#070F1E",
                fontWeight: 600,
                textTransform: "none",
              }}
            >
              {isResetPending ? <CircularProgress size={20} sx={{ color: "#070F1E" }} /> : "Send Reset Link"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default LoginPage;
