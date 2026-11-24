import React, { useEffect, useState } from 'react';
import './AdminDashboard.css';
import {  FaUser, FaUsers, FaServer, FaReceipt, FaBars, FaChevronDown, FaChevronUp, FaDashcube, FaIdBadge } from 'react-icons/fa';
import { TbMessageReportFilled } from 'react-icons/tb';
import { IoIosNotifications } from 'react-icons/io';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Collapse, List, ListItem, ListItemButton, ListItemIcon, ListItemText, IconButton, Typography, Menu, MenuItem, Avatar, Badge, Dialog, DialogTitle, DialogContent, TextField, Button, DialogActions } from '@mui/material';
import { SidebarConfig, NavItemConfig } from '../../types/navigation';
import { IoMdNotifications } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { getAllUserCounts, getAllUserImageVerification } from '../api/Admin';

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
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});

  const adminSidebarConfig: SidebarConfig = {
    brandTitle: "Admin Panel",
    homePath: "/admin/dashboard",
    items: [
      { id: "profile", title: "Profile", path: "/admin/profile", icon: CgProfile },
      { id: "dashboard", title: "Dashboard", path: "/admin/dashboard", icon: FaDashcube },
      {
        id: "user-management",
        title: "User Management",
        path: "",
        icon: FaUser,
        children: [
          { id: "user-table", title: "User Table", path: "/admin/user-table", icon: FaUser },
          { id: "userData", title: "User Upgrade", path: "/admin/userData", icon: FaUser },
          { id: "renewals", title: "Renewal", path: "/admin/renewals", icon: FaUser },
          { id: "resetpass", title: "Password", path: "/admin/resetpass", icon: FaUser },
          { id: "imageverify", title: "Image Verification", path: "/admin/imageverify", icon: FaUser },
        ],
      },
      {
        id: "assistance-service",
        title: "Assistance Service",
        path: "",
        icon: FaServer,
        children: [
          { id: "pendingdata", title: "Pending", path: "/admin/pendingdata", icon: FaServer },
          { id: "successdata", title: "Success", path: "/admin/successdata", icon: FaServer },
          { id: "promotersdata", title: "Promoter User", path: "/admin/promotersdata", icon: FaServer },
        ],
      },
      {
        id: "promoter-management",
        title: "Promoter Management",
        path: "",
        icon: FaUsers,
        children: [
          { id: "promoters", title: "Promoters", path: "/admin/promoters", icon: FaUsers },
          { id: "promotersusers", title: "Promoter Users", path: "/admin/promotersusers", icon: FaUsers },
          { id: "promoterearn", title: "Promoter Earnings", path: "/admin/promoterearn", icon: FaUsers },
          { id: "paytopromoters", title: "Pay to Promoters", path: "/admin/paytopromoters", icon: FaUsers },
        ],
      },
      {
        id: "receipts",
        title: "Receipts",
        path: "",
        icon: FaReceipt,
        children: [
          { id: "onlinetransaction", title: "Online Transaction", path: "/admin/onlinetransaction", icon: FaReceipt },
          { id: "assistance", title: "Assistance Online Transaction", path: "/admin/assistance", icon: FaReceipt },
          { id: "receiptsvocher", title: "Receipt Voucher", path: "/admin/receiptsvocher", icon: FaReceipt },
        ],
      },
      {
        id: "reports",
        title: "Reports",
        path: "",
        icon: TbMessageReportFilled,
        children: [
          { id: "userreports", title: "Users", path: "/admin/userreports", icon: TbMessageReportFilled },
          { id: "renewalreports", title: "Renewals", path: "/admin/renewalreports", icon: TbMessageReportFilled },
          { id: "receiptsreports", title: "Receipts", path: "/admin/receiptsreports", icon: TbMessageReportFilled },
        ],
      },
      { id: "notification", title: "Notifications", path: "/admin/notification", icon: IoIosNotifications },
    ],
  };
  const location = useLocation();
  
  const navigate = useNavigate();
  const adminName = "Admin";
  const [imageVerificationCount, setImageVerificationCount] = useState(0);
  const [lastViewedCount, setLastViewedCount] = useState(() => parseInt(localStorage.getItem('lastViewedImageVerifications') || '0', 10));
  const { mutate: fetchImageVerification } = getAllUserImageVerification();

  
  useEffect(() => {
    const token = localStorage.getItem('token'); 
    if (!token) {
      navigate('/admin'); 
    }
    setActivePath(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    fetchImageVerification(
      { page: 0, pageSize: 1 },
      {
        onSuccess: (response) => {
          if (response?.success) {
            setImageVerificationCount(response.totalRecords || 0);
          }
        },
        onError: (err) => {
          console.error("Failed to fetch image verification count", err);
        }
      }
    );
  }, []);

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
    localStorage.setItem('lastViewedImageVerifications', imageVerificationCount.toString());
    setLastViewedCount(imageVerificationCount);
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
        <Badge badgeContent={Math.max(0, imageVerificationCount - lastViewedCount)} color="error" max={99} onClick={navigateImageVerify}>
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
        {/* Dynamic Data-Driven Sidebar */}
        <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`} style={{
          overflowY: 'auto',
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none',
          backgroundColor: '#0B192C',
        }}>
          <List sx={{ width: '100%', py: 1 }}>
            {adminSidebarConfig.items.map((item) => {
              const hasChildren = Boolean(item.children && item.children.length > 0);
              const isSubOpen = Boolean(openSubmenus[item.id]);
              const itemActive = item.path ? isActive(item.path) : false;
              const IconComponent = item.icon;

              return (
                <React.Fragment key={item.id}>
                  <ListItem disablePadding sx={{ my: 0.25 }}>
                    <ListItemButton
                      onClick={() => {
                        if (item.id === 'profile') {
                          handleProfileDialogOpen();
                        } else if (hasChildren) {
                          setOpenSubmenus(prev => ({ ...prev, [item.id]: !prev[item.id] }));
                        } else if (item.path) {
                          navigate(item.path);
                        }
                      }}
                      sx={{
                        mx: 1,
                        borderRadius: '6px',
                        py: 0.9,
                        backgroundColor: (itemActive || (hasChildren && isSubOpen)) ? 'rgba(212, 175, 55, 0.2)' : 'transparent',
                        borderLeft: itemActive ? '3px solid #D4AF37' : '3px solid transparent',
                        color: (itemActive || (hasChildren && isSubOpen)) ? '#D4AF37' : '#FFFFFF',
                        '&:hover': {
                          backgroundColor: 'rgba(212, 175, 55, 0.12)',
                          color: '#D4AF37',
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 32, color: (itemActive || (hasChildren && isSubOpen)) ? '#D4AF37' : 'rgba(255, 255, 255, 0.85)' }}>
                        {IconComponent && <IconComponent style={{ fontSize: '1.1rem' }} />}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.title}
                        primaryTypographyProps={{
                          fontSize: '0.92rem',
                          fontWeight: itemActive ? 700 : 500,
                        }}
                      />
                      {hasChildren && (isSubOpen ? <FaChevronUp style={{ fontSize: '0.8rem' }} /> : <FaChevronDown style={{ fontSize: '0.8rem' }} />)}
                    </ListItemButton>
                  </ListItem>

                  {hasChildren && item.children && (
                    <Collapse in={isSubOpen} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding sx={{ pl: 2 }}>
                        {item.children.map((sub) => {
                          const subActive = sub.path ? isActive(sub.path) : false;
                          return (
                            <ListItem key={sub.id} disablePadding sx={{ my: 0.2 }}>
                              <ListItemButton
                                onClick={() => {
                                  if (sub.path) navigate(sub.path);
                                }}
                                sx={{
                                  borderRadius: '4px',
                                  py: 0.6,
                                  color: subActive ? '#D4AF37' : 'rgba(255, 255, 255, 0.75)',
                                  backgroundColor: subActive ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
                                  borderLeft: subActive ? '2px solid #D4AF37' : '2px solid transparent',
                                  '&:hover': {
                                    color: '#D4AF37',
                                    backgroundColor: 'rgba(212, 175, 55, 0.08)',
                                  },
                                }}
                              >
                                <ListItemText
                                  primary={sub.title}
                                  primaryTypographyProps={{
                                    fontSize: '0.88rem',
                                    fontWeight: subActive ? 700 : 400,
                                  }}
                                />
                              </ListItemButton>
                            </ListItem>
                          );
                        })}
                      </List>
                    </Collapse>
                  )}
                </React.Fragment>
              );
            })}
          </List>
        </aside>

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