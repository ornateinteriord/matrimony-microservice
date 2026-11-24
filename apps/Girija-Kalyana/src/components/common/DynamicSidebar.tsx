import React, { useState } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
  Chip,
  Divider,
} from "@mui/material";
import {
  ExpandLess,
  ExpandMore,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Share as ShareIcon,
  Search as SearchIcon,
  ManageSearch as ManageSearchIcon,
  ImageSearch as ImageSearchIcon,
  TrendingUp as TrendingUpIcon,
  Pending as PendingIcon,
  CheckCircle as CheckCircleIcon,
  TimerOff as TimerOffIcon,
  Groups as GroupsIcon,
  HowToReg as HowToRegIcon,
  SupportAgent as SupportAgentIcon,
  Autorenew as AutorenewIcon,
  AttachMoney as AttachMoneyIcon,
  AccountBalanceWallet as AccountBalanceWalletIcon,
  Favorite as FavoriteIcon,
  Logout as LogoutIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  Receipt as ReceiptIcon,
  Assessment as AssessmentIcon,
  Notifications as NotificationsIcon,
  LockReset as LockResetIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { NavItemConfig, SidebarConfig } from "../../types/navigation";

export interface DynamicSidebarProps {
  config: SidebarConfig;
  isOpen?: boolean;
  onClose?: () => void;
  variant?: "permanent" | "temporary" | "persistent";
  userRole?: string;
  activePath?: string;
  headerContent?: React.ReactNode;
  footerContent?: React.ReactNode;
  onItemClick?: (item: NavItemConfig) => void;
  width?: number | string;
}

// Icon mapper for string names to MUI icons
const ICON_MAP: Record<string, React.ReactElement> = {
  Dashboard: <DashboardIcon />,
  Person: <PersonIcon />,
  Share: <ShareIcon />,
  Search: <SearchIcon />,
  ManageSearch: <ManageSearchIcon />,
  ImageSearch: <ImageSearchIcon />,
  TrendingUp: <TrendingUpIcon />,
  Pending: <PendingIcon />,
  CheckCircle: <CheckCircleIcon />,
  TimerOff: <TimerOffIcon />,
  Groups: <GroupsIcon />,
  HowToReg: <HowToRegIcon />,
  SupportAgent: <SupportAgentIcon />,
  Autorenew: <AutorenewIcon />,
  AttachMoney: <AttachMoneyIcon />,
  AccountBalanceWallet: <AccountBalanceWalletIcon />,
  Favorite: <FavoriteIcon />,
  Logout: <LogoutIcon />,
  People: <PeopleIcon />,
  Settings: <SettingsIcon />,
  Receipt: <ReceiptIcon />,
  Assessment: <AssessmentIcon />,
  Notifications: <NotificationsIcon />,
  LockReset: <LockResetIcon />,
};

const renderIcon = (icon: NavItemConfig["icon"]) => {
  if (!icon) return <ChevronRightIcon />;
  if (typeof icon === "string") {
    return ICON_MAP[icon] || <ChevronRightIcon />;
  }
  const IconComp = icon as React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  return <IconComp />;
};

export const DynamicSidebar: React.FC<DynamicSidebarProps> = ({
  config,
  isOpen = true,
  onClose,
  variant = "permanent",
  userRole,
  activePath: customActivePath,
  headerContent,
  footerContent,
  onItemClick,
  width = 260,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});

  const currentPath = customActivePath || location.pathname;

  const toggleSubmenu = (id: string) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleItemClick = (item: NavItemConfig) => {
    if (item.children && item.children.length > 0) {
      toggleSubmenu(item.id);
      return;
    }

    if (onItemClick) {
      onItemClick(item);
    }

    if (item.path) {
      navigate(item.path);
    }

    if (variant === "temporary" && onClose) {
      onClose();
    }
  };

  // Filter items by role if roles specified
  const filteredItems = config.items.filter((item) => {
    if (!item.roles || item.roles.length === 0) return true;
    if (!userRole) return true;
    return item.roles.includes(userRole);
  });

  const sidebarBody = (
    <Box
      sx={{
        width,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#ffffff",
        borderRight: "1px solid rgba(217, 119, 6, 0.15)",
      }}
    >
      {/* Brand Header */}
      <Box
        sx={{
          p: 2.5,
          background: "#700F2B",
          color: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <Link
          to={config.homePath}
          style={{ textDecoration: "none", color: "inherit", width: "100%" }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              letterSpacing: "0.5px",
              color: "#ffffff",
            }}
          >
            {config.brandTitle}
          </Typography>
        </Link>
      </Box>

      {/* Optional Custom Header Content (e.g. user avatar/chip) */}
      {headerContent && (
        <Box sx={{ p: 2, borderBottom: "1px solid #f1f5f9" }}>
          {headerContent}
        </Box>
      )}

      {/* Navigation Items */}
      <Box sx={{ flex: 1, overflowY: "auto", py: 1 }}>
        <List disablePadding>
          {filteredItems.map((item) => {
            const hasChildren = Boolean(item.children && item.children.length > 0);
            const isSubmenuOpen = Boolean(openSubmenus[item.id]);
            const isActive =
              currentPath === item.path ||
              (hasChildren &&
                item.children?.some((child) => child.path === currentPath));

            return (
              <React.Fragment key={item.id}>
                <ListItem disablePadding sx={{ px: 1, my: 0.25 }}>
                  <ListItemButton
                    onClick={() => handleItemClick(item)}
                    sx={{
                      borderRadius: "8px",
                      py: 1,
                      px: 1.5,
                      backgroundColor: isActive
                        ? "rgba(136, 19, 55, 0.08)"
                        : "transparent",
                      color: isActive ? "#881337" : "#374151",
                      borderLeft: isActive
                        ? "3px solid #881337"
                        : "3px solid transparent",
                      "&:hover": {
                        backgroundColor: isActive
                          ? "rgba(136, 19, 55, 0.12)"
                          : "rgba(136, 19, 55, 0.04)",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 36,
                        color: isActive ? "#881337" : "#6b7280",
                      }}
                    >
                      {renderIcon(item.icon)}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.title}
                      primaryTypographyProps={{
                        fontSize: "0.9rem",
                        fontWeight: isActive ? 600 : 500,
                      }}
                    />

                    {item.badge !== undefined && (
                      <Chip
                        label={item.badge}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: "0.75rem",
                          backgroundColor: "#D97706",
                          color: "#ffffff",
                          fontWeight: 700,
                          mr: 0.5,
                        }}
                      />
                    )}

                    {hasChildren &&
                      (isSubmenuOpen ? (
                        <ExpandLess sx={{ color: "#6b7280" }} />
                      ) : (
                        <ExpandMore sx={{ color: "#6b7280" }} />
                      ))}
                  </ListItemButton>
                </ListItem>

                {/* Submenu */}
                {hasChildren && (
                  <Collapse in={isSubmenuOpen} timeout="auto" unmountOnExit>
                    <List disablePadding sx={{ pl: 3, pr: 1 }}>
                      {item.children!.map((child) => {
                        const isChildActive = currentPath === child.path;
                        return (
                          <ListItem key={child.id} disablePadding sx={{ my: 0.2 }}>
                            <ListItemButton
                              onClick={() => handleItemClick(child)}
                              sx={{
                                borderRadius: "6px",
                                py: 0.75,
                                px: 1.5,
                                backgroundColor: isChildActive
                                  ? "rgba(136, 19, 55, 0.08)"
                                  : "transparent",
                                color: isChildActive ? "#881337" : "#4b5563",
                                "&:hover": {
                                  backgroundColor: "rgba(136, 19, 55, 0.04)",
                                },
                              }}
                            >
                              <ListItemIcon
                                sx={{
                                  minWidth: 28,
                                  color: isChildActive ? "#881337" : "#9ca3af",
                                }}
                              >
                                {renderIcon(child.icon)}
                              </ListItemIcon>
                              <ListItemText
                                primary={child.title}
                                primaryTypographyProps={{
                                  fontSize: "0.85rem",
                                  fontWeight: isChildActive ? 600 : 400,
                                }}
                              />
                              {child.badge !== undefined && (
                                <Chip
                                  label={child.badge}
                                  size="small"
                                  sx={{
                                    height: 18,
                                    fontSize: "0.7rem",
                                    backgroundColor: "#D97706",
                                    color: "#ffffff",
                                  }}
                                />
                              )}
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
      </Box>

      {/* Footer Content */}
      {footerContent && (
        <Box sx={{ p: 2, borderTop: "1px solid #f1f5f9" }}>
          {footerContent}
        </Box>
      )}
    </Box>
  );

  if (variant === "temporary") {
    return (
      <Drawer
        anchor="left"
        open={isOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        PaperProps={{
          sx: { border: "none" },
        }}
      >
        {sidebarBody}
      </Drawer>
    );
  }

  return (
    <Box component="nav" sx={{ width, flexShrink: 0 }}>
      {sidebarBody}
    </Box>
  );
};

export default DynamicSidebar;
