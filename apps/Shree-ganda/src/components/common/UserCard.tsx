import React from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Typography,
} from "@mui/material";
import { FaBriefcase, FaMapMarkerAlt } from "react-icons/fa";
import { calculateAge, isSilverOrPremiumUser } from "../../utils/common";

const UserCard = ({
  profile,
  connection = null,
  onViewMore = () => { },
  onCancelRequest = () => { },
  onRemoveConnection = () => { },
  interestId = null,
  showCancelButton = false,
  onResponse = () => { },
  showResponseButtons = false,
  showRemoveButton = false,
}) => {
  const age = profile?.age || calculateAge(profile?.date_of_birth);

  return (
    <Card
      sx={{
        width: { xs: 280, sm: 280, md: 260, lg: 280 },
        borderRadius: "8px",
        boxShadow: "0 4px 16px rgba(180,83,9,0.08)",
        overflow: "hidden",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 24px rgba(180,83,9,0.16)",
        },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
        background: "#fff",
      }}
    >
      {/* Top accent strip */}
      <Box
        sx={{
          width: "100%",
          height: 48,
          background: "#78350F",
          position: "relative",
          flexShrink: 0,
        }}
      />
      {connection && (
        <Box
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            backgroundColor:
              connection?.direction === "sent" ? "#1976d2" : "#4caf50",
            color: "white",
            borderRadius: "50%",
            width: "24px",
            height: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "12px",
            fontWeight: "bold",
            border: "2px solid white",
            zIndex: 1,
          }}
          title={
            connection?.direction === "sent"
              ? "You sent this request"
              : "You accepted this request"
          }
        >
          {connection?.direction === "sent" ? "→" : "←"}
        </Box>
      )}

      {isSilverOrPremiumUser(profile?.type_of_user || profile?.type_of_use) && (
        <Chip
          label="PREMIUM"
          size="small"
          sx={{
            position: "absolute",
            top: 12,
            left: connection ? 12 : "auto",
            right: connection ? "auto" : 12,
            fontWeight: 500,
            fontSize: { xs: "0.6rem", sm: "0.7rem" },
            backgroundColor: "#FFD700",
            zIndex: 1,
          }}
        />
      )}

      <Box
        sx={{
          width: { xs: 100, sm: 110 },
          height: { xs: 100, sm: 110 },
          borderRadius: "50%",
          border: "3px solid #ffffff",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          mb: 1.5,
          mt: -5,
          position: "relative",
          zIndex: 2,
        }}
      >
        <Avatar
          src={profile?.image}
          alt={profile?.first_name}
          sx={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </Box>

      <CardContent
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          px: { xs: 1, sm: 2 },
          pt: 0,
          pb: 2,
          textAlign: "center",
        }}
      >
        <Typography fontWeight="500px" sx={{ color: "#000", mb: 0.5 }}>
          {profile?.full_name || profile?.fullname || `${profile?.first_name || ""} ${profile?.last_name || ""}`.trim() || "User"}
        </Typography>
        <Typography color="rgba(0, 0, 0, 0.6)">{age || "N/A"} yrs</Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            mb: 0.5,
          }}
        >
          <FaBriefcase size={16} color="#000" />
          <Typography variant="body2" color="#000" sx={{ lineHeight: 1.3 }}>
            {profile?.occupation || "Not specified"}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            mb: 1,
          }}
        >
          <FaMapMarkerAlt size={16} color="#000" />
          <Typography variant="body2" color="#000" sx={{ lineHeight: 1.3 }}>
            {[profile?.city, profile?.state, profile?.country]
              .filter(Boolean)
              .join(", ") || "Location not specified"}
          </Typography>
        </Box>

        <Divider
          sx={{ width: "100%", my: 1, height: "1px", borderColor: "#ccc" }}
        />

        <Box display="flex" justifyContent="space-around" width="100%" mb={1}>
          <ProfileInfo label="Heigh" font value={profile?.height || "N/A"} />
          <ProfileInfo label="Religion" value={profile?.religion || "N/A"} />
          <ProfileInfo label="Caste" value={profile?.caste || "N/A"} />
        </Box>

        <Box
          display="flex"
          justifyContent="center"
          gap={1}
          width="100%"
          mt="auto"
          flexWrap="wrap"
        >
          {showResponseButtons && (
            <Box sx={{ display: 'flex', gap: 1, width: '100%', mb: 1 }}>
              <Button
                fullWidth
                variant="outlined"
                sx={{
                  background: "#fff",
                  ":hover": {
                    background: "transparent"
                  },
                  color: "error.main",
                  fontWeight: 500,
                  borderColor: "error.main",
                  textTransform: "capitalize",
                  flex: 1
                }}
                onClick={() => onResponse(profile?.registration_no, false)}
              >
                Reject
              </Button>
              <Button
                fullWidth
                variant="contained"
                sx={{
                  backgroundColor: "transparent",
                  border: "1px solid #991b1b",
                  color: "#000",
                  textTransform: "capitalize",
                  flex: 1,
                  "&:hover": {
                    backgroundColor: "#991b1b",
                    color: "#fff",
                  }
                }}
                onClick={() => onResponse(profile?.registration_no, true)}
              >
                Accept
              </Button>
            </Box>
          )}

          <Button
            fullWidth
            variant="contained"
            onClick={() => onViewMore(profile)}
            sx={{
              backgroundColor: "#78350F",
              "&:hover": {
                backgroundColor: "#5c280b",
              },
              minWidth: "120px",
              borderRadius: "4px",
              py: 0.9,
              textTransform: "none",
              fontWeight: 600,
              fontSize: { xs: "0.82rem", sm: "0.9rem" },
            }}
          >
            View More
          </Button>

          {showRemoveButton && (
            <Button
              fullWidth
              variant="outlined"
              color="primary"
              onClick={() => onRemoveConnection(interestId)}
              sx={{
                flex: 1,
                borderRadius: 2,
                py: 1,
                textTransform: "none",
                fontWeight: 500,
                fontSize: { xs: "0.8rem", sm: "0.9rem" },
                backgroundColor: "#d32f2f",
                color: '#fff',
                "&:hover": {
                  backgroundColor: "#d32f2f",
                  color: '#fff',
                  borderColor: '#fff'
                },
              }}
            >
              Remove Connection
            </Button>
          )}

          {showCancelButton && (
            <Button
              fullWidth
              variant="outlined"
              color="primary"
              onClick={() => onCancelRequest(interestId)}
              sx={{
                flex: 1,
                borderRadius: 2,
                py: 1,
                textTransform: "none",
                fontWeight: 500,
                fontSize: { xs: "0.8rem", sm: "0.7rem" },
                "&:hover": { backgroundColor: "transparent" },
              }}
            >
              Cancel Request
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default UserCard;

export const ProfileInfo = ({ label, value }) => (
  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
    <Typography
      variant="body2"
      color="rgba(0, 0, 0, 0.6)"
      sx={{ fontWeight: 500, color: "#000" }}
    >
      {label}
    </Typography>
    <Typography variant="body2" color="rgba(0, 0, 0, 0.6)">
      {value}
    </Typography>
  </Box>
);
