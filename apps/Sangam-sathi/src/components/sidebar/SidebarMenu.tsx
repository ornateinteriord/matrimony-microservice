import React from "react";
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Box, Typography, Chip } from "@mui/material";
import {
  FaUser,
  FaUsers,
  FaHeart,
  FaSearch,
  FaSignOutAlt,
} from "react-icons/fa";
import { FaUsersViewfinder } from "react-icons/fa6";
import { Dashboard as DashboardIcon } from "@mui/icons-material";
import { NavItemConfig, SidebarConfig } from "../../types/navigation";

export interface SidebarMenuProps {
  selectedItem?: string;
  handleDashboardClick?: () => void;
  handleProfileClick?: () => void;
  handleMatchesClick?: () => void;
  handleInterestClick?: () => void;
  handleViewAllClick?: () => void;
  handleSearchClick?: () => void;
  handleOpenLogoutDialog?: () => void;
  userProfile?: {
    first_name?: string;
    last_name?: string;
    type_of_user?: string;
  };
}

export const createUserSidebarConfig = (handlers: {
  onDashboard?: () => void;
  onProfile?: () => void;
  onMatches?: () => void;
  onInterest?: () => void;
  onViewAll?: () => void;
  onSearch?: () => void;
  onLogout?: () => void;
}): SidebarConfig => ({
  brandTitle: "Sangam Sathi",
  homePath: "/user/userdashboard",
  items: [
    {
      id: "dashboard",
      title: "Dashboard",
      path: "/user/userdashboard",
      icon: DashboardIcon,
    },
    {
      id: "profile",
      title: "My Profile",
      path: "/user/profile",
      icon: FaUser,
    },
    {
      id: "matches",
      title: "My Matches",
      path: "/user/MyMatches",
      icon: FaUsers,
    },
    {
      id: "interest",
      title: "My Interest",
      path: "/user/myintrest",
      icon: FaHeart,
    },
    {
      id: "viewall",
      title: "View All",
      path: "/user/viewAll",
      icon: FaUsersViewfinder,
    },
    {
      id: "search",
      title: "Search",
      path: "/user/search",
      icon: FaSearch,
    },
    {
      id: "logout",
      title: "Logout",
      path: "",
      icon: FaSignOutAlt,
    },
  ],
});

const SidebarMenu: React.FC<SidebarMenuProps> = ({
  selectedItem,
  handleDashboardClick,
  handleProfileClick,
  handleMatchesClick,
  handleInterestClick,
  handleViewAllClick,
  handleSearchClick,
  handleOpenLogoutDialog,
  userProfile,
}) => {
  const handlerMap: Record<string, (() => void) | undefined> = {
    Dashboard: handleDashboardClick,
    "My Profile": handleProfileClick,
    "My Matches": handleMatchesClick,
    "My Interest": handleInterestClick,
    "View All": handleViewAllClick,
    Search: handleSearchClick,
    Logout: handleOpenLogoutDialog,
  };

  const config = createUserSidebarConfig({
    onDashboard: handleDashboardClick,
    onProfile: handleProfileClick,
    onMatches: handleMatchesClick,
    onInterest: handleInterestClick,
    onViewAll: handleViewAllClick,
    onSearch: handleSearchClick,
    onLogout: handleOpenLogoutDialog,
  });

  return (
    <Box sx={{ overflow: "auto", height: "100%", backgroundColor: "#0B192C", color: "#FFFFFF" }}>
      <List sx={{ pt: 1 }}>
        <ListItem sx={{ display: "block", textAlign: "center", pb: 2 }}>
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="h6"
              textTransform="capitalize"
              sx={{ fontSize: "1.25rem", fontWeight: 700, color: "#FFFFFF" }}
            >
              {userProfile?.first_name || "User"}
            </Typography>
            <Chip
              label={userProfile?.type_of_user || "FreeUser"}
              size="small"
              sx={{
                mt: 1,
                fontSize: "0.75rem",
                backgroundColor:
                  userProfile?.type_of_user === "PremiumUser" || userProfile?.type_of_user === "SilverUser"
                    ? "#D97706"
                    : "#64748B",
                color: "#FFFFFF",
                fontWeight: "bold",
                borderRadius: "4px",
              }}
            />
          </Box>
        </ListItem>

        {config.items.map((item: NavItemConfig) => {
          const isSelected = selectedItem === item.title;
          const clickHandler = handlerMap[item.title];
          const IconComp = item.icon as React.ComponentType<{ style?: React.CSSProperties }>;

          return (
            <ListItem key={item.id} disablePadding sx={{ my: 0.5 }}>
              <ListItemButton
                onClick={clickHandler}
                sx={{
                  mx: 1,
                  borderRadius: "4px",
                  py: 1,
                  backgroundColor: isSelected ? "rgba(217, 119, 6, 0.16)" : "transparent",
                  borderLeft: isSelected ? "3px solid #D97706" : "3px solid transparent",
                  color: isSelected ? "#D97706" : "#FFFFFF",
                  "&:hover": {
                    backgroundColor: "rgba(217, 119, 6, 0.1)",
                    color: "#D97706",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: isSelected ? "#D97706" : "rgba(255, 255, 255, 0.85)" }}>
                  {IconComp && <IconComp style={{ fontSize: "1.1rem" }} />}
                </ListItemIcon>
                <ListItemText
                  primary={item.title}
                  primaryTypographyProps={{
                    fontSize: "0.95rem",
                    fontWeight: isSelected ? 700 : 500,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

export default SidebarMenu;
