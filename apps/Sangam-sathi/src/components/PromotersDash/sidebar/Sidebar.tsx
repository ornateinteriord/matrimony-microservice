import React, { useState } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Drawer,
  Toolbar,
} from '@mui/material';
import {
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
  Event,
  Settings,
  Lock,
  Notifications,
  Email,
  Logout,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import defaultSidebarData, { promoterSidebarConfig } from './data';

interface SidebarProps {
  isMobile?: boolean;
  open?: boolean;
  toggleDrawer?: () => void;
  sidebarData?: typeof defaultSidebarData;
}

const Sidebar: React.FC<SidebarProps> = ({
  isMobile = false,
  open = true,
  toggleDrawer,
  sidebarData = defaultSidebarData,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});

  const handleItemClick = (text: string, hasSubItems = false, path?: string) => {
    if (hasSubItems) {
      setOpenSubmenus((prev) => ({
        ...prev,
        [text]: !prev[text],
      }));
    } else if (path) {
      navigate(path);
    }
  };

  const handleSubItemClick = (parentText: string, subItem: { text: string; path?: string }) => {
    if (subItem.path) {
      navigate(subItem.path);
    }
  };

  const getIconComponent = (iconName: string, props = {}) => {
    const iconComponents: Record<string, React.ComponentType<any>> = {
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
    };

    const IconComponent = iconComponents[iconName];
    return IconComponent ? <IconComponent {...props} /> : null;
  };

  const isPathActive = (path?: string) => {
    if (!path) return false;
    return location.pathname === path;
  };

  const renderSubItems = (subItems: { text: string; path?: string }[], parentText: string) => (
    <Collapse in={openSubmenus[parentText]} timeout="auto" unmountOnExit>
      <List component="div" disablePadding>
        {subItems.map((item, index) => {
          const active = isPathActive(item.path);
          return (
            <ListItem key={index} disablePadding sx={{ my: 0.25 }}>
              <ListItemButton
                onClick={() => handleSubItemClick(parentText, item)}
                sx={{
                  pl: 4,
                  py: 0.6,
                  borderRadius: '4px',
                  mx: 1,
                  backgroundColor: active ? 'rgba(212, 175, 55, 0.2)' : 'transparent',
                  borderLeft: active ? '3px solid #D4AF37' : '3px solid transparent',
                  color: active ? '#D4AF37' : '#FFFFFF',
                  '&:hover': {
                    backgroundColor: 'rgba(212, 175, 55, 0.12)',
                    color: '#D4AF37',
                  },
                }}
              >
                <ListItemText
                  primary={item.text}
                  sx={{
                    color: 'inherit',
                  }}
                  primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: active ? 700 : 500 }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Collapse>
  );

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'persistent'}
      open={open}
      onClose={toggleDrawer}
      sx={{
        width: 250,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 250,
          boxSizing: 'border-box',
          backgroundColor: '#0B192C',
          color: '#FFFFFF',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto', py: 1 }}>
        <List sx={{ mt: '10px' }}>
          {sidebarData.menuItems.map((item, index) => {
            const hasSub = Boolean(item.subItems && item.subItems.length > 0);
            const active = isPathActive(item.path);
            const isOpen = Boolean(openSubmenus[item.text]);

            return (
              <Box key={index}>
                <ListItem disablePadding sx={{ my: 0.3 }}>
                  <ListItemButton
                    onClick={() => handleItemClick(item.text, hasSub, item.path)}
                    sx={{
                      cursor: 'pointer',
                      px: 2,
                      py: 0.9,
                      mx: 1,
                      borderRadius: '6px',
                      backgroundColor: active ? 'rgba(212, 175, 55, 0.2)' : 'transparent',
                      borderLeft: active ? '3px solid #D4AF37' : '3px solid transparent',
                      color: active ? '#D4AF37' : '#FFFFFF',
                      '&:hover': {
                        backgroundColor: 'rgba(212, 175, 55, 0.12)',
                        color: '#D4AF37',
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 35, color: active ? '#D4AF37' : 'rgba(255, 255, 255, 0.85)' }}>
                      {getIconComponent(item.icon)}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      sx={{ color: 'inherit' }}
                      primaryTypographyProps={{ fontSize: '0.95rem', fontWeight: active ? 700 : 500 }}
                    />
                    {hasSub && (
                      <ArrowDropDownIcon
                        sx={{
                          color: active ? '#D4AF37' : '#FFFFFF',
                          transform: isOpen ? 'rotate(180deg)' : 'none',
                          transition: 'transform 0.3s',
                        }}
                      />
                    )}
                  </ListItemButton>
                </ListItem>

                {hasSub && item.subItems && (
                  <Box sx={{ ml: 1 }}>
                    {renderSubItems(item.subItems, item.text)}
                  </Box>
                )}
              </Box>
            );
          })}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
