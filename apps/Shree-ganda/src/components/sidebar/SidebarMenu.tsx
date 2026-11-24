import React from "react";
import { Box, Typography, Chip, Avatar } from "@mui/material";
import DynamicSidebar from "../common/DynamicSidebar";
import { SidebarConfig, NavItemConfig } from "../../types/navigation";

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
    type_of_user?: string;
    image?: string;
  };
  onClose?: () => void;
}

export const USER_SIDEBAR_CONFIG: SidebarConfig = {
  brandTitle: "Shree Ganda",
  homePath: "/user/MyMatches",
  items: [
    {
      id: "dashboard",
      title: "Dashboard",
      path: "/user/userDashboard",
      icon: "Dashboard",
    },
    {
      id: "profile",
      title: "My Profile",
      path: "/user/profile",
      icon: "Person",
    },
    {
      id: "matches",
      title: "My Matches",
      path: "/user/MyMatches",
      icon: "Group",
    },
    {
      id: "interests",
      title: "My Interest",
      path: "/user/myintrest",
      icon: "Favorite",
    },
    {
      id: "viewAll",
      title: "View All",
      path: "/user/viewAll",
      icon: "ManageSearch",
    },
    {
      id: "search",
      title: "Search",
      path: "/user/search",
      icon: "Search",
    },
    {
      id: "logout",
      title: "Logout",
      path: "",
      icon: "Logout",
    },
  ],
};

const SidebarMenu: React.FC<SidebarMenuProps> = ({
  handleDashboardClick,
  handleProfileClick,
  handleMatchesClick,
  handleInterestClick,
  handleViewAllClick,
  handleSearchClick,
  handleOpenLogoutDialog,
  userProfile,
  onClose,
}) => {
  const handleItemClick = (item: NavItemConfig) => {
    switch (item.id) {
      case "dashboard":
        if (handleDashboardClick) handleDashboardClick();
        break;
      case "profile":
        if (handleProfileClick) handleProfileClick();
        break;
      case "matches":
        if (handleMatchesClick) handleMatchesClick();
        break;
      case "interests":
        if (handleInterestClick) handleInterestClick();
        break;
      case "viewAll":
        if (handleViewAllClick) handleViewAllClick();
        break;
      case "search":
        if (handleSearchClick) handleSearchClick();
        break;
      case "logout":
        if (handleOpenLogoutDialog) handleOpenLogoutDialog();
        break;
      default:
        break;
    }
  };

  const header = (
    <Box
      sx={{
        backgroundColor: "#8B1E1E",
        color: "#FFFFFF",
        p: 2.5,
        textAlign: "center",
        borderBottom: "1px solid rgba(197, 160, 89, 0.4)",
      }}
    >
      <Avatar
        src={userProfile?.image}
        sx={{
          width: 56,
          height: 56,
          mx: "auto",
          mb: 1,
          border: "2px solid #C5A059",
          bgcolor: "#C5A059",
          color: "#2D1810",
          fontWeight: 700,
        }}
      >
        {userProfile?.first_name ? userProfile.first_name[0].toUpperCase() : "U"}
      </Avatar>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          fontSize: "1.1rem",
          textTransform: "capitalize",
          color: "#FFFFFF",
        }}
      >
        {userProfile?.first_name || "Member"}
      </Typography>
      <Chip
        label={userProfile?.type_of_user || "FreeUser"}
        size="small"
        sx={{
          mt: 1,
          fontSize: "0.75rem",
          fontWeight: 700,
          backgroundColor:
            userProfile?.type_of_user === "PremiumUser"
              ? "#C5A059"
              : userProfile?.type_of_user === "SilverUser"
              ? "#E2E8F0"
              : "#FDFBF7",
          color: "#2D1810",
        }}
      />
    </Box>
  );

  return (
    <DynamicSidebar
      config={USER_SIDEBAR_CONFIG}
      headerContent={header}
      onItemClick={handleItemClick}
      onClose={onClose}
    />
  );
};

export default SidebarMenu;
