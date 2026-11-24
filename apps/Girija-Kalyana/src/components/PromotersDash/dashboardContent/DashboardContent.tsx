import React, { useState } from 'react';
import {
  Box,
  Typography,
  Divider,
  Card,
  CardContent,
  Avatar,
  Chip,
  CircularProgress,
  useTheme,
  Button,
  Tooltip,
  IconButton
} from '@mui/material';
import {
  Event,
  Logout,
  Dashboard,
  Person,
  Share,
  Search,
  ManageSearch,
  ImageSearch,
  TrendingUp,
  ArrowDropDown as ArrowDropDownIcon,
  Pending,
  CheckCircle,
  TimerOff,
  Groups,
  HowToReg,
  SupportAgent,
  Autorenew,
  Send,
  Inbox,
  AttachMoney,
  AccountBalanceWallet,
  Favorite,
  GroupAdd,
  PersonOff,
  PendingActions,
  TaskAlt,
  Settings,
  Lock,
  Notifications,
  Email,
  Verified,
  ContentCopy,
  WhatsApp,
  Check
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useGetPromoterDashboard } from '../../api/Promoter';
import TokenService from '../../token/tokenService';

const DashboardContent = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const decodedToken = TokenService.decodeToken();
  const promoterId = decodedToken?.promoter_id || decodedToken?.username;

  const { data: dashboardData, isLoading } = useGetPromoterDashboard(promoterId);

  const promoter = dashboardData?.promoter || {
    promoter_name: decodedToken?.first_name || decodedToken?.username || "Promoter",
    promoter_id: decodedToken?.promoter_id || decodedToken?.username || "N/A",
    membership_type: "Partner Promoter",
    registration_date: "Active",
    status: "active"
  };

  const stats = dashboardData?.stats || {
    totalUsers: 0,
    activeUsers: 0,
    pendingUsers: 0,
    freeUsers: 0,
    totalEarnings: 0,
    paidAmount: 0,
    pendingAmount: 0
  };

  const [copied, setCopied] = useState(false);
  const promoCode = promoter?.promoter_id || promoterId || "";
  const referralLink = typeof window !== 'undefined' ? `${window.location.origin}/register?ref=${promoCode}` : "";

  const handleCopyLink = () => {
    if (!promoCode || promoCode === "N/A") {
      toast.error("Promoter code not available yet.");
      return;
    }
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success("Referral link copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareWhatsApp = () => {
    if (!promoCode || promoCode === "N/A") return;
    const text = encodeURIComponent(
      `Hello! Register on Girija Kalyana Matrimony to find your perfect partner. Use my referral code ${promoCode} or click here: ${referralLink}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  const getIconComponent = (iconName, props = {}) => {
    const iconComponents = {
      Logout,
      Dashboard,
      Person,
      Share,
      Search,
      ManageSearch,
      ImageSearch,
      TrendingUp,
      ArrowDropDown: ArrowDropDownIcon,
      Pending,
      CheckCircle,
      TimerOff,
      Groups,
      HowToReg,
      SupportAgent,
      Autorenew,
      Send,
      Inbox,
      AttachMoney,
      AccountBalanceWallet,
      Favorite,
      GroupAdd,
      PersonOff,
      PendingActions,
      TaskAlt,
      Event,
      Settings,
      Lock,
      Notifications,
      Email,
      Verified
    };
    
    const IconComponent = iconComponents[iconName];
    return IconComponent ? <IconComponent {...props} /> : null;
  };

  const statCards = [
    {
      title: "Referred Users",
      value: stats.totalUsers ?? 0,
      color: "#4caf50",
      icon: "Groups",
      link: "/PromotAdmin/my-referrals?tab=all",
      actionText: "View all users →",
    },
    {
      title: "Active Users",
      value: stats.activeUsers ?? 0,
      color: "#2196f3",
      icon: "CheckCircle",
      link: "/PromotAdmin/my-referrals?tab=active",
      actionText: "View active →",
    },
    {
      title: "Pending Approval",
      value: stats.pendingUsers ?? 0,
      color: "#ff9800",
      icon: "Pending",
      link: "/PromotAdmin/my-referrals?tab=pending",
      actionText: "Review pending →",
    },
    {
      title: "My Total Earnings",
      value: `₹${Number(stats.totalEarnings ?? 0).toLocaleString()}`,
      color: "#881337",
      icon: "AttachMoney",
    },
    {
      title: "Paid Amount",
      value: `₹${Number(stats.paidAmount ?? 0).toLocaleString()}`,
      color: "#f44336",
      icon: "AccountBalanceWallet",
    },
    {
      title: "Pending Payout",
      value: `₹${Number(stats.pendingAmount ?? 0).toLocaleString()}`,
      color: "#607d8b",
      icon: "PendingActions",
    },
  ];

  return (
    <>
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{ 
          color: '#881337',
          fontWeight: 'bold', 
          textAlign: { xs: 'start', md: 'center' },
          fontSize: { xs: '1.5rem', sm: '2rem' },
          mb: 3
        }}
      >
        Welcome, {promoter?.promoter_name || "Partner"}
      </Typography>
      
      <Divider sx={{ height: '1px', my: 2 }} />

      {/* Top Cards Section */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 3,
          justifyContent: 'center',
          alignItems: 'stretch'
        }}
      >
        <Card
          sx={{
            backgroundColor: '#fff1f2',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(136,19,55,0.08)',
            border: '1px solid rgba(136,19,55,0.15)',
            flex: 1,
            minWidth: { xs: '100%', sm: '260px' },
          }}
        >
          <CardContent sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="body1" sx={{ color: '#881337', fontWeight: 'bold' }}>
              Promoter Plan
            </Typography>
            <Typography variant="h5" sx={{ color: '#881337', fontWeight: 'bold', mt: 1 }}>
              {promoter?.membership_type || "Partner"}
            </Typography>
          </CardContent>
        </Card>

        <Card
          sx={{
            backgroundColor: '#e8f5e9',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            flex: 1,
            minWidth: { xs: '100%', sm: '260px' },
          }}
        >
          <CardContent sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="body1" sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
              Your Promo / Referral Code
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 1 }}>
              <Typography variant="h5" sx={{ color: '#1b5e20', fontWeight: 'bold', letterSpacing: '1px' }}>
                {promoter?.promoter_id || "N/A"}
              </Typography>
              {promoCode && (
                <Tooltip title="Copy Promo Code">
                  <IconButton
                    size="small"
                    onClick={() => {
                      navigator.clipboard.writeText(promoCode);
                      toast.success(`Copied Code: ${promoCode}`);
                    }}
                    sx={{ color: '#1b5e20' }}
                  >
                    <ContentCopy fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </CardContent>
        </Card>

        <Card
          sx={{
            backgroundColor: '#e3f2fd',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            flex: 1,
            minWidth: { xs: '100%', sm: '260px' },
          }}
        >
          <CardContent sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="body1" sx={{ color: '#1565c0', fontWeight: 'bold' }}>
              Account Info
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mt: 1 }}>
              <Chip
                label={`Joined: ${promoter?.registration_date || "N/A"}`}
                size="small"
                variant="outlined"
                color="primary"
                sx={{ fontSize: '0.8rem' }}
              />
              <Chip
                label={promoter?.status?.toUpperCase() || "ACTIVE"}
                size="small"
                color={promoter?.status === 'active' ? 'success' : 'default'}
                sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}
              />
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Referral Link Action Card */}
      <Card
        sx={{
          mt: 3,
          p: 2.5,
          borderRadius: '12px',
          backgroundColor: '#ffffff',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          border: '1px solid #e2e8f0',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'flex-start', md: 'center' }, justifyContent: 'space-between', gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Your Referral Link
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontWeight: 600,
                color: '#0B192C',
                fontFamily: 'monospace',
                fontSize: { xs: '0.85rem', sm: '0.95rem' },
                mt: 0.5,
                wordBreak: 'break-all',
              }}
            >
              {referralLink}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', width: { xs: '100%', md: 'auto' } }}>
            <Button
              size="small"
              variant="contained"
              onClick={handleCopyLink}
              startIcon={copied ? <Check /> : <ContentCopy />}
              sx={{
                backgroundColor: copied ? '#16a34a' : '#0B192C',
                color: '#fff',
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: '8px',
                px: 2,
                '&:hover': { backgroundColor: copied ? '#15803d' : '#1e293b' },
              }}
            >
              {copied ? 'Copied' : 'Copy Link'}
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="success"
              onClick={handleShareWhatsApp}
              startIcon={<WhatsApp />}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: '8px',
                px: 2,
              }}
            >
              WhatsApp
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={() => window.open(referralLink, '_blank')}
              sx={{
                color: '#0B192C',
                borderColor: '#cbd5e1',
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: '8px',
                px: 2,
                '&:hover': { borderColor: '#0B192C', backgroundColor: 'rgba(11, 25, 44, 0.04)' },
              }}
            >
              Add User
            </Button>
          </Box>
        </Box>
      </Card>

      <Divider sx={{ height: '1px', my: 3 }} />

      {/* User Cards Section */}
      <Typography 
        variant="h5" 
        gutterBottom 
        sx={{ 
          color: '#881337', 
          fontWeight: 'bold', 
          mb: 3,
          textAlign: 'center',
          fontSize: { xs: '1.3rem', sm: '1.5rem' }
        }}
      >
        Real-Time Performance Statistics
      </Typography>
      
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress color="secondary" />
        </Box>
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 3,
            justifyContent: 'center',
            alignItems: 'stretch'
          }}
        >
          {statCards.map((item, index) => (
            <Card
              key={index}
              onClick={() => {
                if (item.link) navigate(item.link);
              }}
              sx={{
                flex: '1 1 260px',
                maxWidth: { xs: '100%', sm: 'calc(50% - 24px)', md: 'calc(33.333% - 24px)', lg: 'calc(25% - 24px)' },
                minWidth: '240px',
                minHeight: '130px',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                border: '1px solid #e2e8f0',
                borderLeft: `5px solid ${item.color}`,
                backgroundColor: '#ffffff',
                cursor: item.link ? 'pointer' : 'default',
                transition: 'all 0.25s ease',
                '&:hover': item.link ? {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
                  borderColor: item.color,
                } : {},
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                  <Avatar
                    sx={{
                      backgroundColor: `${item.color}20`,
                      color: item.color,
                      width: 44,
                      height: 44,
                    }}
                  >
                    {getIconComponent(item.icon)}
                  </Avatar>
                  <Typography
                    variant="h5"
                    sx={{
                      color: item.color,
                      fontWeight: 'bold',
                      fontSize: '1.5rem',
                    }}
                  >
                    {item.value}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#475569',
                      fontWeight: 600,
                      textAlign: 'start',
                      fontSize: '0.9rem'
                    }}
                  >
                    {item.title}
                  </Typography>
                  {item.link && (
                    <Typography
                      variant="caption"
                      sx={{
                        color: item.color,
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        whiteSpace: 'nowrap',
                        ml: 1
                      }}
                    >
                      {item.actionText}
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </>
  );
};

export default DashboardContent;
