import React from "react";
import { Box, Typography, Chip } from "@mui/material";
import DynamicSidebar from "../common/DynamicSidebar";
import { SidebarConfig } from "../../types/navigation";

export interface SidebarMenuProps {
  selectedItem?: string;
  handleDashboardClick?: () => void;
  handleProfileClick?: () => void;
  handleMatchesClick?: () => void;
  handleInterestClick?: () => void;
  handleViewAllClick?: () => void;
  handleSearchClick?: () => void;
  handleOpenLogoutDialog?: () => void;
  userProfile?: any;
}

const userSidebarConfig: SidebarConfig = {
  brandTitle: "Girija Kalyana",
  homePath: "/user/userDashboard",
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
      icon: "Favorite",
    },
    {
      id: "interest",
      title: "My Interest",
      path: "/user/myintrest",
      icon: "Favorite",
    },
    {
      id: "view-all",
      title: "View All",
      path: "/user/viewAll",
      icon: "People",
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
}) => {
  const handleItemClick = (item: any) => {
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
      case "interest":
        if (handleInterestClick) handleInterestClick();
        break;
      case "view-all":
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
    <Box sx={{ textAlign: "center", py: 1 }}>
      <Typography
        variant="h6"
        textTransform="capitalize"
        sx={{ fontWeight: 700, color: "#700F2B" }}
      >
        {userProfile?.first_name || "Member"}
      </Typography>
      <Chip
        label={userProfile?.type_of_user || "FreeUser"}
        size="small"
        sx={{
          mt: 1,
          fontSize: "0.75rem",
          backgroundColor:
            userProfile?.type_of_user === "PremiumUser" ||
            userProfile?.type_of_user === "SilverUser"
              ? "#B45309"
              : "#700F2B",
          color: "#ffffff",
          fontWeight: "bold",
          borderRadius: "4px",
        }}
      />
    </Box>
  );

  return (
    <DynamicSidebar
      config={userSidebarConfig}
      headerContent={header}
      onItemClick={handleItemClick}
      width="100%"
      variant="permanent"
    />
  );
};

export default SidebarMenu;
