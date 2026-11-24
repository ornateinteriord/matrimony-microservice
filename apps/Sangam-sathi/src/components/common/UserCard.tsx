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

interface UserCardProps {
  profile?: any;
  connection?: any;
  onViewMore?: (profile?: any) => void;
  onCancelRequest?: (interestId?: any) => void;
  onRemoveConnection?: (interestId?: any) => void;
  interestId?: any;
  showCancelButton?: boolean;
  onResponse?: (regNo?: any, accepted?: boolean) => void;
  showResponseButtons?: boolean;
  showRemoveButton?: boolean;
}

const UserCard: React.FC<UserCardProps> = ({
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
  const isPremium = isSilverOrPremiumUser(profile?.type_of_user || profile?.type_of_use);

  return (
    <Card
      sx={{
        width: "100%",
        maxWidth: { xs: 280, sm: 280, md: 300, lg: 320 },
        height: 460,
        borderRadius: "6px",
        boxShadow: "0 1px 3px rgba(15,23,42,0.06)",
        overflow: "hidden",
        transition: "all 0.2s ease",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: "0 4px 12px rgba(15,23,42,0.12)",
        },
        display: "flex",
        flexDirection: "column",
        position: "relative",
        background: "#ffffff",
        border: "1px solid #e2e8f0",
      }}
    >
      {/* Top 60% Full Bleed Image */}
      <Box sx={{
        width: '100%',
        height: '55%',
        position: 'relative',
        background: '#F1F5F9',
        overflow: 'hidden'
      }}>
        {profile?.image ? (
          <img
            src={profile.image}
            alt={profile?.first_name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <Box sx={{
            width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '5rem', fontWeight: 800, color: '#94A3B8'
          }}>
            {profile?.first_name?.charAt(0) || '?'}
          </Box>
        )}

        {/* Solid Overlay for text */}
        <Box sx={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          background: 'rgba(15, 23, 42, 0.88)',
          p: 1.5,
          zIndex: 1
        }}>
          <Typography sx={{ fontWeight: 800, fontSize: "1.15rem", color: "#ffffff", lineHeight: 1.2, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {profile?.full_name || profile?.fullname || `${profile?.first_name || ""} ${profile?.last_name || ""}`.trim() || "User"}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
            <Typography sx={{ fontSize: "0.75rem", color: "#D97706", fontWeight: 700, background: "rgba(217,119,6,0.18)", px: 1, py: 0.2, borderRadius: "4px" }}>
              {age || "N/A"} yrs
            </Typography>
            <Typography sx={{ fontSize: "0.75rem", color: "#cbd5e1" }}>• {profile?.religion || "Hindu"} {profile?.caste ? `• ${profile.caste}` : ""}</Typography>
          </Box>
        </Box>

        {/* Badges Overlay */}
        <Box sx={{ position: 'absolute', top: 12, left: 12, right: 12, display: 'flex', justifyContent: 'space-between', zIndex: 2 }}>
          {isPremium ? (
            <Chip
              label="★ PREMIUM"
              size="small"
              sx={{
                fontWeight: 700, fontSize: "0.6rem", letterSpacing: "0.5px",
                background: "#D97706",
                color: "#ffffff", border: "none",
                borderRadius: "4px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.2)", height: 22,
              }}
            />
          ) : <Box />}

          {connection && (
            <Box sx={{
              backgroundColor: connection?.direction === "sent" ? "rgba(255,255,255,0.9)" : "#D97706",
              color: connection?.direction === "sent" ? "#0F172A" : "#ffffff",
              borderRadius: "4px", width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "12px", fontWeight: "bold", boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
            }} title={connection?.direction === "sent" ? "Request Sent" : "Request Received"}>
              {connection?.direction === "sent" ? "↑" : "↓"}
            </Box>
          )}
        </Box>
      </Box>

      <CardContent
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          flex: 1,
          px: 2.5,
          pt: 2.5,
          pb: "16px !important",
        }}
      >
        {/* Minimal Info Strip */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2, mb: 1.5 }}>
          {/* Occupation */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box sx={{ width: 28, height: 28, borderRadius: '8px', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FaBriefcase size={12} color="#64748B" />
            </Box>
            <Typography variant="body2" sx={{ color: "#334155", fontSize: "0.85rem", fontWeight: 500 }}>
              {profile?.occupation || "Not specified"}
            </Typography>
          </Box>

          {/* Location */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box sx={{ width: 28, height: 28, borderRadius: '8px', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FaMapMarkerAlt size={12} color="#64748B" />
            </Box>
            <Typography variant="body2" sx={{ color: "#334155", fontSize: "0.85rem", fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {[profile?.city, profile?.state, profile?.country].filter(Boolean).join(", ") || "Location not specified"}
            </Typography>
          </Box>
        </Box>

        {/* Stats row */}
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-around",
            background: "#F8FAFC",
            borderRadius: "8px",
            border: "1px solid #E2E8F0",
            py: 1,
            px: 0.5,
            mb: 1.5,
            mt: 1.5,
          }}
        >
          <ProfileInfo label="Height" value={profile?.height || "N/A"} />
          <Divider orientation="vertical" flexItem sx={{ borderColor: "#E2E8F0" }} />
          <ProfileInfo label="Religion" value={profile?.religion || "N/A"} />
          <Divider orientation="vertical" flexItem sx={{ borderColor: "#E2E8F0" }} />
          <ProfileInfo label="Caste" value={profile?.caste || "N/A"} />
        </Box>

        {/* Floating Action Buttons */}
        <Box
          display="flex"
          justifyContent="center"
          gap={1.5}
          width="100%"
          mt="auto"
          flexWrap="wrap"
        >
          {showResponseButtons && (
            <Box sx={{ display: "flex", gap: 1.5, width: "100%", mb: 1 }}>
              <Button
                fullWidth
                variant="outlined"
                sx={{
                  color: "#64748B",
                  borderColor: "#E2E8F0",
                  fontWeight: 600,
                  textTransform: "none",
                  borderRadius: "4px",
                  fontSize: "0.85rem",
                  flex: 1,
                  "&:hover": {
                    background: "#F1F5F9",
                    borderColor: "#CBD5E1",
                    color: "#0F172A"
                  },
                }}
                onClick={(e) => { e.stopPropagation(); onResponse(profile?.registration_no, false) }}
              >
                Pass
              </Button>
              <Button
                fullWidth
                variant="contained"
                sx={{
                  backgroundColor: "#0F172A",
                  color: "#fff",
                  fontWeight: 600,
                  textTransform: "none",
                  borderRadius: "4px",
                  fontSize: "0.85rem",
                  flex: 1,
                  "&:hover": {
                    backgroundColor: "#1E293B",
                  },
                }}
                onClick={(e) => { e.stopPropagation(); onResponse(profile?.registration_no, true) }}
              >
                Accept
              </Button>
            </Box>
          )}

          {/* View More */}
          <Button
            fullWidth
            variant="contained"
            onClick={(e) => { e.stopPropagation(); onViewMore(profile) }}
            sx={{
              backgroundColor: showResponseButtons ? "#F1F5F9" : "#0F172A",
              color: showResponseButtons ? "#0F172A" : "#fff",
              "&:hover": {
                backgroundColor: showResponseButtons ? "#E2E8F0" : "#1E293B",
              },
              fontWeight: 600,
              borderRadius: "4px",
              py: 1,
              textTransform: "none",
              fontSize: "0.9rem",
              boxShadow: showResponseButtons ? "none" : "0 2px 4px rgba(15,23,42,0.12)",
            }}
          >
            View Profile
          </Button>

          {showRemoveButton && (
            <Button
              fullWidth
              variant="outlined"
              onClick={() => onRemoveConnection(interestId)}
              sx={{
                flex: 1,
                borderRadius: "4px",
                py: 0.9,
                textTransform: "none",
                fontWeight: 600,
                fontSize: { xs: "0.78rem", sm: "0.82rem" },
                color: "#d32f2f",
                borderColor: "rgba(211,47,47,0.4)",
                "&:hover": {
                  background: "rgba(211,47,47,0.06)",
                  borderColor: "#d32f2f",
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
              onClick={(e) => { e.stopPropagation(); onCancelRequest(interestId) }}
              sx={{
                flex: 1,
                borderRadius: "4px",
                py: 0.9,
                textTransform: "none",
                fontWeight: 600,
                fontSize: { xs: "0.78rem", sm: "0.82rem" },
                color: "#64748B",
                borderColor: "#E2E8F0",
                "&:hover": {
                  background: "#F1F5F9",
                  borderColor: "#CBD5E1",
                },
              }}
            >
              Cancel Request
            </Button>
          )}
        </Box>
      </CardContent>
    </Card >
  );
};

export default UserCard;

export const ProfileInfo = ({ label, value }) => (
  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", px: 0.5, flex: 1, width: 0 }}>
    <Typography
      variant="caption"
      sx={{ fontWeight: 700, color: "#64748B", fontSize: "0.68rem", letterSpacing: "0.5px", textTransform: "uppercase", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", width: "100%", textAlign: "center" }}
    >
      {label}
    </Typography>
    <Typography variant="body2" sx={{ color: "#0F172A", fontWeight: 600, fontSize: "0.85rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", width: "100%", textAlign: "center" }} title={value}>
      {value}
    </Typography>
  </Box>
);
