import React, { useState } from "react";
import {
  Box,
  Tab,
  Tabs,
  Snackbar,
  Alert,
  Typography,
  Paper,
  Button,
  useMediaQuery,
  useTheme,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import TokenService from "../../token/tokenService";
import { useGetMemberDetails } from "../../api/User";
import ProfileView from "./ProfileView";

import About from "../profile/about/About";
import Education from "../profile/eduction/Education";
import FamilyReligious from "../profile/familyReligious/FamilyReligious";
import LifeStyle from "../profile/lifeStyle/LifeStyle";
import Others from "../profile/others/Others";
import ParentsPrefer from "../profile/parentPreference/ParentsPrefer";
import Photos from "../profile/photo/Photos";
import PrivacySettings from "../profile/privacySettings/PrivacySettings";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(0);
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const registerNo = TokenService.getRegistrationNo();
  const { data: userProfile, isLoading, refetch } = useGetMemberDetails(registerNo);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleSaved = () => {
    setOpen(true);
    refetch();
  };

  const renderContent = () => {
    switch (value) {
      case 0:
        return <About render={handleSaved} />;
      case 1:
        return <FamilyReligious render={handleSaved} />;
      case 2:
        return <Education render={handleSaved} />;
      case 3:
        return <Photos />;
      case 4:
        return <LifeStyle render={handleSaved} />;
      case 5:
        return <ParentsPrefer />;
      case 6:
        return <PrivacySettings />;
      default:
        return null;
    }
  };

  const tabs = [
    "About & Personal",
    "Family & Religious",
    "Education & Career",
    "Photos",
    "LifeStyle",
    "Partner's Preference",
    "Privacy Settings",
  ];

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  // DEFAULT MODE: Modern Bio-Data Profile View
  if (!isEditing) {
    return (
      <Box sx={{ p: { xs: 1.5, sm: 3 } }}>
        <ProfileView
          userProfile={userProfile}
          isOwner={true}
          onEdit={() => setIsEditing(true)}
        />
      </Box>
    );
  }

  // EDIT MODE: Sectioned form editor with clean back action
  return (
    <Box
      sx={{
        borderRadius: 2,
        p: { xs: 1.5, sm: 3 },
        maxWidth: 1100,
        mx: "auto",
        width: "100%",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          mb: 3,
          borderRadius: "10px",
          border: "1px solid #e2e8f0",
          backgroundColor: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => setIsEditing(false)}
            variant="outlined"
            sx={{
              borderColor: "#cbd5e1",
              color: "#334155",
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "6px",
              "&:hover": { borderColor: "#94a3b8", backgroundColor: "#f8fafc" },
            }}
          >
            Back to Bio-Data View
          </Button>
          <Typography variant="h6" sx={{ fontSize: "1.1rem", fontWeight: 700, color: "#0f172a" }}>
            Edit Profile
          </Typography>
        </Box>

        <Typography variant="caption" sx={{ color: "#64748b" }}>
          Changes saved here update your matrimonial bio-data instantly.
        </Typography>
      </Paper>

      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={() => setOpen(false)} severity="success" variant="filled" sx={{ width: "100%" }}>
          Profile Section Updated Successfully
        </Alert>
      </Snackbar>

      <Box sx={{ mb: 2.5, borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="profile edit tabs"
          sx={{
            "& .MuiTabs-indicator": { backgroundColor: "#b45309" },
            "& .MuiTab-root": {
              fontWeight: 600,
              fontSize: "0.85rem",
              textTransform: "none",
              color: "#64748b",
              "&.Mui-selected": { color: "#b45309" },
            },
          }}
        >
          {tabs.map((tab) => (
            <Tab key={tab} label={tab} />
          ))}
        </Tabs>
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3.5 },
          borderRadius: "10px",
          border: "1px solid #e2e8f0",
          backgroundColor: "#ffffff",
          minHeight: 400,
        }}
      >
        {renderContent()}
      </Paper>
    </Box>
  );
};

export default Profile;
