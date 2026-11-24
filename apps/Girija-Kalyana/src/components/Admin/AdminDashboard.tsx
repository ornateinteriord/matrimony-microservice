import React, { useEffect, useState } from 'react';
import './AdminDashboard.css';
import {  FaUser, FaUsers, FaServer, FaReceipt, FaBars, FaChevronDown, FaChevronUp, FaDashcube, FaIdBadge } from 'react-icons/fa';
import { TbMessageReportFilled } from 'react-icons/tb';
import { IoIosNotifications } from 'react-icons/io';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Collapse, List, ListItem, ListItemText, IconButton, Typography, Menu, MenuItem, Avatar, Badge, Dialog, DialogTitle, DialogContent, TextField, Button, DialogActions, Box } from '@mui/material';
import { IoMdNotifications } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { getAllUserCounts } from '../api/Admin';
import DynamicSidebar from '../common/DynamicSidebar';
import { SidebarConfig } from '../../types/navigation';

const adminSidebarConfig: SidebarConfig = {
  brandTitle: "Girija Kalyana Admin",
  homePath: "/admin/dashboard",
  items: [
    {
      id: "admin-profile",
      title: "Profile",
      path: "/admin/profile",
      icon: "Person",
    },
    {
      id: "admin-dashboard",
      title: "Dashboard",
      path: "/admin/dashboard",
      icon: "Dashboard",
    },
    {
      id: "user-management",
      title: "User Management",
      path: "/admin/user-table",
      icon: "Person",
      children: [
        { id: "user-table", title: "User Table", path: "/admin/user-table", icon: "People" },
        { id: "user-upgrade", title: "User Upgrade", path: "/admin/userData", icon: "TrendingUp" },
        { id: "renewals", title: "Renewals", path: "/admin/renewals", icon: "Autorenew" },
        { id: "reset-password", title: "Password", path: "/admin/resetpass", icon: "LockReset" },
        { id: "image-verify", title: "Image Verification", path: "/admin/imageverify", icon: "ImageSearch" },
      ],
    },
    {
      id: "assistance-service",
      title: "Assistance Service",
      path: "/admin/pendingdata",
      icon: "SupportAgent",
      children: [
        { id: "pending-data", title: "Pending", path: "/admin/pendingdata", icon: "Pending" },
        { id: "success-data", title: "Success", path: "/admin/successdata", icon: "CheckCircle" },
        { id: "promoter-users-data", title: "Promoter User", path: "/admin/promotersdata", icon: "Groups" },
      ],
    },
    {
      id: "promoter-management",
      title: "Promoter Management",
      path: "/admin/promoters",
      icon: "Groups",
      children: [
        { id: "promoters-data", title: "Promoters", path: "/admin/promoters", icon: "Groups" },
        { id: "promoters-users", title: "Promoter Users", path: "/admin/promotersusers", icon: "People" },
        { id: "promoter-earnings", title: "Promoter Earnings", path: "/admin/promoterearn", icon: "AttachMoney" },
        { id: "pay-to-promoters", title: "Pay to Promoters", path: "/admin/paytopromoters", icon: "AccountBalanceWallet" },
      ],
    },
    {
      id: "receipts-management",
      title: "Receipts",
      path: "/admin/onlinetransaction",
      icon: "Receipt",
      children: [
        { id: "online-txn", title: "Online Transaction", path: "/admin/onlinetransaction", icon: "Receipt" },
        { id: "assistance-txn", title: "Assistance Online Transaction", path: "/admin/assistance", icon: "Receipt" },
        { id: "receipt-voucher", title: "Receipt Voucher", path: "/admin/receiptsvocher", icon: "Receipt" },
      ],
    },
    {
      id: "reports-management",
      title: "Reports",
      path: "/admin/userreports",
      icon: "Assessment",
      children: [
        { id: "user-reports", title: "Users", path: "/admin/userreports", icon: "Assessment" },
        { id: "renewal-reports", title: "Renewals", path: "/admin/renewalreports", icon: "Assessment" },
        { id: "receipts-reports", title: "Receipts", path: "/admin/receiptsreports", icon: "Assessment" },
      ],
    },
    {
      id: "incomplete-payments",
      title: "Incomplete Payments",
      path: "/admin/incomplete-payments",
      icon: "AttachMoney",
    },
    {
      id: "notifications",
      title: "Notifications",
      path: "/admin/notification",
      icon: "Notifications",
    },
  ],
};

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openUserManagement, setOpenUserManagement] = useState(false);
  const [openAssistanceService, setOpenAssistanceService] = useState(false);
  const [openPromoterManagement, setOpenPromoterManagement] = useState(false);
  const [openPromoterReceipts, setOpenPromoterReceipts] = useState(false);
  const [openPromoterReports, setOpenPromoterReports] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: "Admin",
    email: "admin@example.com",
    phone: "123-456-7890",
    profilePicture: null,
  });
  const [activePath, setActivePath] = useState('');
  const location = useLocation();
  
  const navigate = useNavigate();
  const adminName = "Admin";
  
  useEffect(() => {
    const token = localStorage.getItem('token'); 
    if (!token) {
      navigate('/admin'); 
    }
    setActivePath(location.pathname);
  }, [location.pathname]);

const closeAllDropdowns = () => {
  setOpenUserManagement(false);
  setOpenAssistanceService(false);
  setOpenPromoterManagement(false);
  setOpenPromoterReceipts(false);
  setOpenPromoterReports(false);
};

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const toggleUserManagement = () => {
      closeAllDropdowns();
    setOpenUserManagement(!openUserManagement);
  };

  const toggleAssistanceService = () => {
      closeAllDropdowns();
    setOpenAssistanceService(!openAssistanceService);
  };

  const togglePromoterManagement = () => {
      closeAllDropdowns();
    setOpenPromoterManagement(!openPromoterManagement);
  };
  const toggleReceiptsManagement = () => {
      closeAllDropdowns();
    setOpenPromoterReceipts(!openPromoterReceipts);
  };
  const toggleReportManagement = () => {
      closeAllDropdowns();
    setOpenPromoterReports(!openPromoterReports);
  };
  
  const navigateUserTable = () => {
    navigate('/admin/user-table');
  };
  const handleDashboard=()=>{
      closeAllDropdowns();
    navigate('/admin/dashboard');
  }
  const navigateUserUpgrade=()=>{
    navigate('/admin/userData');
  }
  
  const navigateRenewals=()=>{
    navigate('/admin/renewals');
  }
  const navigateresetpass=()=>{
    navigate('/admin/resetpass');
  }
  const navigateImageVerify=()=>{
    navigate('/admin/imageverify');
  }
  const navigatePendingdata=()=>{
    navigate('/admin/pendingdata');
  }
  const navigateSuccessdata=()=>{
    navigate('/admin/successdata');
  }
  const navigatePromoterdata=()=>{
    navigate('/admin/promotersdata');
  }
  const navigatePaytopromoters=()=>{
    navigate('/admin/paytopromoters');
  }
  const navigatePromotersEarn=()=>{
    navigate('/admin/promoterearn');
  }
  const navigatePromotersData=()=>{
    navigate('/admin/promoters');
  }
  const navigatePromotersUsers=()=>{
    navigate('/admin/promotersusers');
  }
  const navigateOnlineTransaction=()=>{
    navigate('/admin/onlinetransaction');
  }
  const navigateAssistanceData=()=>{
    navigate('/admin/assistance');
  }
  const navigateReceiptsvocher=()=>{
    navigate('/admin/receiptsvocher');
  }

  const navigateUserReports=()=>{
    navigate('/admin/userreports');
  }
  const navigateRenewalReports=()=>{
    navigate('/admin/renewalreports');
  }
  const navigateReceiptsReportsdata=()=>{
    navigate('/admin/receiptsreports');
  }
  const navigateNotification=()=>{
      closeAllDropdowns();
    navigate('/admin/notification');
  }
  
  // Add this new function
  const navigateIncompletePayments = () => {
    closeAllDropdowns();
    navigate('/admin/incomplete-payments');
  }
  
  // Check if a path is active
  const isActive = (path) => {
    return activePath === path;
  };

  // Profile dialog handlers
  const handleProfileDialogOpen = () => {
    setProfileDialogOpen(true);
  };

  const handleProfileDialogClose = () => {
    setProfileDialogOpen(false);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
const handleLogoutDialogOpen = () => {
  setLogoutDialogOpen(true);
  handleMenuClose(); 
};

const handleLogoutDialogClose = () => {
  setLogoutDialogOpen(false);
};

const handleConfirmLogout = () => {
  localStorage.removeItem('token');
  navigate('/');
  setLogoutDialogOpen(false);
};
  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setUserProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setUserProfile((prevProfile) => ({
      ...prevProfile,
      profilePicture: URL.createObjectURL(file),
    }));
  };

  return (
    <div>
    <div className={`Dash-app-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      {/* Navbar */}
      <nav className="Dashnavbar">
        <div className="Dashmenu">
          <IconButton onClick={toggleSidebar}>
            <FaBars style={{ color: '#fff', fontSize: '1.8rem' }} />
          </IconButton>
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}><h2 className="navtxt">Admin Dashboard</h2></Link>
        </div>
        <div className="nav-right">
        <Badge color="error" variant="dot">
        <IoMdNotifications fontSize={40} cursor={'pointer'}/>
        </Badge>
         
        <IconButton onClick={handleMenuOpen}>
            <Avatar alt="Admin Profile" src="/path-to-profile-pic.jpg" style={{background:'black'}}/>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem 
              onClick={handleLogoutDialogOpen}
            >
              Logout
            </MenuItem>
          </Menu>
          <Typography style={{ color: '#fff', marginRight: '10px',fontSize:'22px',fontWeight:'bold',fontFamily:'Outfit sans-serif' }}>
            {adminName}
          </Typography>
         
        </div>
      </nav>
    </div>
        {/* Dynamic Sidebar */}
        <Box
          className={`sidebar ${isSidebarOpen ? 'open' : ''}`}
          sx={{
            width: { xs: 260, md: 260 },
            flexShrink: 0,
            overflowY: 'auto',
          }}
        >
          <DynamicSidebar
            config={adminSidebarConfig}
            activePath={activePath}
            onItemClick={(item) => {
              if (item.id === 'admin-profile') {
                handleProfileDialogOpen();
              }
            }}
            width="100%"
          />
        </Box>

        {/* Logout Confirmation Dialog */}
<Dialog open={logoutDialogOpen} onClose={handleLogoutDialogClose}>
  <DialogTitle>Confirm Logout</DialogTitle>
  <DialogContent>
    <Typography>
    Are you sure you want to logout from your account?
    </Typography>
  </DialogContent>
  <DialogActions>
    <Button 
      onClick={handleLogoutDialogClose} 
      color="primary"
    >
      Cancel
    </Button>
    <Button 
      onClick={handleConfirmLogout} 
      color="error" 
      variant="contained"
    >
      Logout
    </Button>
  </DialogActions>
</Dialog>

         {/* Profile Dialog */}
      <Dialog open={profileDialogOpen} onClose={handleProfileDialogClose}>
      <DialogTitle color='black' fontWeight={700} display={'flex'} 
      justifyContent={'center'} mt={1} fontSize={24}>Edit Profile</DialogTitle>
      <DialogContent>
        <TextField
          label="Name"
          name="name"
          value={userProfile.name}
          onChange={handleProfileChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          name="email"
          value={userProfile.email}
          onChange={handleProfileChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Phone"
          name="phone"
          value={userProfile.phone}
          onChange={handleProfileChange}
          fullWidth
          margin="normal"
        />
        <Button
          variant="contained"
          component="label"
          style={{
            marginTop: "10px",
            textTransform: "capitalize",
            background: "#34495e",
          }}

        >
          Upload Profile Picture
          <input
            type="file"
            hidden
            onChange={handleImageUpload}
          />
        </Button>

        {userProfile.profilePicture && (
          <img
            src={userProfile.profilePicture}
            alt="Profile Preview"
            style={{ marginTop: "10px", width: "100%", borderRadius: "10px" }}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={handleProfileDialogClose}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleProfileDialogClose} 
          color="success"
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>

        {/* Main Content */}
        <div
          className="main-content"
          style={{
            paddingLeft: isSidebarOpen ? '280px' : '0px',
            paddingTop: isSidebarOpen ? '10px' : '10px',
            transition: 'padding-left 0.3s ease',
          }}
        >
          <Outlet />
        </div>
      </div>
    
  );
}

export default AdminDashboard;