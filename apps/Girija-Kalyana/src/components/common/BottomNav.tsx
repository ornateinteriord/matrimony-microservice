import React from "react";
import { BottomNavigation, BottomNavigationAction, Paper, Box } from "@mui/material";
import {
  Favorite,
  Search,
  People,
  Person,
  VolunteerActivism,
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hook/UseAuth";

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  // If user is logged in, use authenticated routes, else fallback to public / login routes
  const homePath = isLoggedIn ? "/user/MyMatches" : "/";
  const interestPath = isLoggedIn ? "/user/myintrest" : "/register";
  const searchPath = isLoggedIn ? "/user/search" : "/about";
  const viewAllPath = isLoggedIn ? "/user/viewAll" : "/membership";
  const profilePath = isLoggedIn ? "/user/profile" : "/contact";

  // Determine active tab
  const getActiveTab = () => {
    const p = location.pathname.toLowerCase();
    if (p.includes("mymatches") || (p === "/" && !isLoggedIn)) return 0;
    if (p.includes("myintrest")) return 1;
    if (p.includes("search")) return 2;
    if (p.includes("viewall") || p.includes("membership")) return 3;
    if (p.includes("profile") || p.includes("contact")) return 4;
    return 0;
  };

  const activeTab = getActiveTab();

  // Don't show bottom nav inside admin or promoter routes
  if (
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/PromotAdmin")
  ) {
    return null;
  }

  return (
    <Box
      sx={{
        display: { xs: "block", md: "none" },
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1300,
      }}
    >
      <Paper
        elevation={8}
        sx={{
          borderTop: "1px solid rgba(217, 119, 6, 0.25)",
          borderRadius: 0,
          background: "#ffffff",
        }}
      >
        <BottomNavigation
          showLabels
          value={activeTab}
          sx={{
            height: 64,
            backgroundColor: "#ffffff",
            "& .MuiBottomNavigationAction-root": {
              minWidth: "auto",
              padding: "6px 0",
              color: "#6b7280",
              "&.Mui-selected": {
                color: "#700F2B",
                fontWeight: 700,
              },
            },
          }}
        >
          <BottomNavigationAction
            label="Matches"
            icon={<Favorite />}
            onClick={() => navigate(homePath)}
          />
          <BottomNavigationAction
            label="Interests"
            icon={<VolunteerActivism />}
            onClick={() => navigate(interestPath)}
          />
          <BottomNavigationAction
            label="Search"
            icon={<Search />}
            onClick={() => navigate(searchPath)}
          />
          <BottomNavigationAction
            label="View All"
            icon={<People />}
            onClick={() => navigate(viewAllPath)}
          />
          <BottomNavigationAction
            label="Profile"
            icon={<Person />}
            onClick={() => navigate(profilePath)}
          />
        </BottomNavigation>
      </Paper>
    </Box>
  );
};

export default BottomNav;
