import React from "react";
import { Box, Tabs, Tab } from "@mui/material";
import AboutPop from "../Userprofile/viewAll/popupContent/abouPop/AboutPop";
import FamilyPop from "../Userprofile/viewAll/popupContent/familyPop/FamilyPop";
import EducationPop from "../Userprofile/viewAll/popupContent/educationPop/EducationPop";
import LifeStylePop from "../Userprofile/viewAll/popupContent/lifeStylePop/LifeStylePop";
import PreferencePop from "../Userprofile/viewAll/popupContent/preferencePop/PreferencePop";

const RenderContents = ({ selectedCardDetails, userDetails, handleChange }) => {
  if (!userDetails) return null;

  const renderContent = () => {
    switch (selectedCardDetails.details) {
      case 0:
        return <AboutPop userDetails={userDetails} />;
      case 1:
        return <FamilyPop userDetails={userDetails} />;
      case 2:
        return <EducationPop userDetails={userDetails} />;
      case 3:
        return <LifeStylePop userDetails={userDetails} />;
      case 4:
        return <PreferencePop userDetails={userDetails} />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ flex: 2, minWidth: "300px" }}>
      <Tabs
        value={selectedCardDetails.details}
        onChange={handleChange}
        centered
        textColor="primary"
        indicatorColor="primary"
        sx={{ mb: 1 }}
      >
        <Tab label="About" />
        <Tab label="Family" />
        <Tab label="Education" />
        <Tab label="LifeStyle" />
        <Tab label="Preference" />
      </Tabs>

      <Box sx={{ padding: 0, backgroundColor: "#f9f9f9", borderRadius: 2 }}>
        {renderContent()}
      </Box>
    </Box>
  );
};

export default RenderContents;
