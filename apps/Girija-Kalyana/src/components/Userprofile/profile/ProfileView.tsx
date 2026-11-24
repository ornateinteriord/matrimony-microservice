import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Chip,
  Grid,
  Avatar,
  Paper,
  Divider,
  Tooltip,
  Dialog,
  IconButton,
} from "@mui/material";
import {
  Edit as EditIcon,
  Verified as VerifiedIcon,
  LocationOn as LocationIcon,
  School as SchoolIcon,
  Favorite as FavoriteIcon,
  FamilyRestroom as FamilyIcon,
  Psychology as AstroIcon,
  Restaurant as DietIcon,
  Phone as PhoneIcon,
  Person as PersonIcon,
  PhotoLibrary as PhotoLibraryIcon,
  Close as CloseIcon,
  NavigateBefore as NavigateBeforeIcon,
  NavigateNext as NavigateNextIcon,
} from "@mui/icons-material";

interface ProfileViewProps {
  userProfile: any;
  isOwner?: boolean;
  onEdit?: () => void;
  onSendInterest?: () => void;
  interestStatus?: string;
  isInterestLoading?: boolean;
}

const DetailRow: React.FC<{ label: string; value?: string | number | null; icon?: React.ReactNode }> = ({
  label,
  value,
  icon,
}) => {
  const displayValue = value && String(value).trim() !== "" ? String(value) : "Not Specified";
  return (
    <Box sx={{ display: "flex", alignItems: "flex-start", py: 1, borderBottom: "1px solid #f1f5f9" }}>
      {icon && (
        <Box sx={{ color: "#64748b", mr: 1.5, mt: 0.3, display: "flex", alignItems: "center" }}>
          {icon}
        </Box>
      )}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 500, display: "block", textTransform: "uppercase", fontSize: "0.7rem", letterSpacing: "0.5px" }}>
          {label}
        </Typography>
        <Typography variant="body2" sx={{ color: "#1e293b", fontWeight: 600, fontSize: "0.9rem", mt: 0.2, wordBreak: "break-word" }}>
          {displayValue}
        </Typography>
      </Box>
    </Box>
  );
};

const SectionCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({
  title,
  icon,
  children,
}) => (
  <Paper
    elevation={0}
    sx={{
      p: 2.5,
      mb: 3,
      borderRadius: "6px",
      border: "1px solid #e2e8f0",
      backgroundColor: "#ffffff",
      boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
      width: "100%",
      boxSizing: "border-box",
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center", mb: 2, pb: 1, borderBottom: "2px solid #f1f5f9" }}>
      <Box sx={{ color: "#700F2B", mr: 1.5, display: "flex", alignItems: "center" }}>{icon}</Box>
      <Typography variant="h6" sx={{ fontSize: "1.05rem", fontWeight: 700, color: "#0f172a" }}>
        {title}
      </Typography>
    </Box>
    {children}
  </Paper>
);

export const ProfileView: React.FC<ProfileViewProps> = ({
  userProfile,
  isOwner = true,
  onEdit,
  onSendInterest,
  interestStatus = "none",
  isInterestLoading = false,
}) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  if (!userProfile) {
    return (
      <Paper sx={{ p: 4, textAlign: "center", borderRadius: "6px", border: "1px solid #e2e8f0" }}>
        <Typography variant="body1" sx={{ color: "#64748b" }}>
          Profile information not available.
        </Typography>
      </Paper>
    );
  }

  // Build list of all profile images
  const allPhotos: string[] = Array.isArray(userProfile.images) && userProfile.images.length > 0
    ? userProfile.images
    : userProfile.image ? [userProfile.image] : [];

  const handleOpenLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev > 0 ? prev - 1 : allPhotos.length - 1));
  };

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev < allPhotos.length - 1 ? prev + 1 : 0));
  };

  const role = (userProfile.user_role || userProfile.type_of_user || "FreeUser").toLowerCase();
  const isPremium = role.includes("premium");
  const isSilver = role.includes("silver");
  const tierName = isPremium ? "Premium Member" : isSilver ? "Silver Member" : "Free Member";

  const fullName = userProfile.full_name || userProfile.fullname || `${userProfile.first_name || ""} ${userProfile.last_name || ""}`.trim() || "Matrimony Member";
  const regNo = userProfile.registration_no || userProfile.ref_no || "N/A";
  const location = [userProfile.city, userProfile.state, userProfile.country].filter(Boolean).join(", ") || "Location Not Specified";

  return (
    <Box sx={{ maxWidth: 1200, width: "100%", mx: "auto", pb: 5 }}>
      {/* Hero Header Card */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: "6px",
          border: "1px solid #e2e8f0",
          backgroundColor: "#ffffff",
          overflow: "hidden",
          mb: 3,
          boxShadow: "0 1px 3px rgba(15, 23, 42, 0.04)",
        }}
      >
        <Box
          sx={{
            height: 80,
            background: "#700F2B",
            position: "relative",
          }}
        />

        <Box sx={{ px: { xs: 2.5, md: 4 }, pb: 3, pt: 0, position: "relative" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "center", sm: "flex-end" },
              mt: -7,
              mb: 2,
              gap: 3,
            }}
          >
            <Box
              sx={{ position: "relative", cursor: allPhotos.length > 0 ? "pointer" : "default" }}
              onClick={() => allPhotos.length > 0 && handleOpenLightbox(0)}
              title={allPhotos.length > 0 ? "Click to view photo gallery" : ""}
            >
              <Avatar
                src={userProfile.image}
                alt={fullName}
                sx={{
                  width: { xs: 110, sm: 130 },
                  height: { xs: 110, sm: 130 },
                  border: "4px solid #ffffff",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
                  backgroundColor: "#f1f5f9",
                  fontSize: "3rem",
                  color: "#64748b",
                }}
              >
                {fullName.charAt(0)}
              </Avatar>
              {userProfile.image_verification === "active" && (
                <Tooltip title="Photo Verified">
                  <VerifiedIcon
                    sx={{
                      position: "absolute",
                      bottom: 8,
                      right: 8,
                      color: "#16a34a",
                      backgroundColor: "#ffffff",
                      borderRadius: "50%",
                      fontSize: 24,
                    }}
                  />
                </Tooltip>
              )}
            </Box>

            <Box sx={{ flex: 1, textAlign: { xs: "center", sm: "left" } }}>
              <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1, justifyContent: { xs: "center", sm: "flex-start" } }}>
                <Typography variant="h5" sx={{ fontWeight: 800, color: "#0f172a" }}>
                  {fullName}
                </Typography>
                <Chip
                  label={`ID: ${regNo}`}
                  size="small"
                  sx={{ backgroundColor: "#f1f5f9", color: "#475569", fontWeight: 600, fontSize: "0.75rem", borderRadius: "4px" }}
                />
                <Chip
                  label={tierName}
                  size="small"
                  sx={{
                    backgroundColor: isPremium ? "#fef3c7" : isSilver ? "#e0f2fe" : "#f1f5f9",
                    color: isPremium ? "#92400e" : isSilver ? "#0369a1" : "#475569",
                    fontWeight: 700,
                    fontSize: "0.75rem",
                    borderRadius: "4px",
                  }}
                />
              </Box>

              <Typography variant="body2" sx={{ color: "#64748b", mt: 0.5, display: "flex", alignItems: "center", justifyContent: { xs: "center", sm: "flex-start" }, gap: 0.5 }}>
                <LocationIcon sx={{ fontSize: 16 }} /> {location}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", gap: 1.5, mt: { xs: 2, sm: 0 } }}>
              {isOwner ? (
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={onEdit}
                  sx={{
                    backgroundColor: "#700F2B",
                    "&:hover": { backgroundColor: "#590a21" },
                    textTransform: "none",
                    fontWeight: 600,
                    px: 3,
                    borderRadius: "4px",
                  }}
                >
                  Edit Profile
                </Button>
              ) : (
                onSendInterest && (
                  <Button
                    variant="contained"
                    startIcon={<FavoriteIcon />}
                    onClick={onSendInterest}
                    disabled={isInterestLoading || interestStatus === "pending" || interestStatus === "accepted"}
                    sx={{
                      backgroundColor: interestStatus === "accepted" ? "#16a34a" : "#700F2B",
                      "&:hover": { backgroundColor: "#590a21" },
                      textTransform: "none",
                      fontWeight: 600,
                      px: 3,
                      borderRadius: "4px",
                    }}
                  >
                    {interestStatus === "accepted" ? "Connected" : interestStatus === "pending" ? "Interest Sent" : "Send Interest"}
                  </Button>
                )
              )}
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Quick Key Attributes Grid */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, 1fr)",
                sm: "repeat(3, 1fr)",
                md: "repeat(6, 1fr)",
              },
              gap: 2,
              width: "100%",
            }}
          >
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="caption" sx={{ color: "#64748b" }}>Age / Height</Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, color: "#1e293b", wordBreak: "break-word" }}>
                {userProfile.age ? `${userProfile.age} yrs` : "—"} {userProfile.height ? `• ${userProfile.height}` : ""}
              </Typography>
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="caption" sx={{ color: "#64748b" }}>Religion / Caste</Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, color: "#1e293b", wordBreak: "break-word" }}>
                {userProfile.religion || "Hindu"} {userProfile.caste ? `• ${userProfile.caste}` : ""}
              </Typography>
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="caption" sx={{ color: "#64748b" }}>Mother Tongue</Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, color: "#1e293b", wordBreak: "break-word" }}>
                {userProfile.mother_tounge || userProfile.mother_tongue || "—"}
              </Typography>
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="caption" sx={{ color: "#64748b" }}>Education</Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, color: "#1e293b", wordBreak: "break-word" }}>
                {userProfile.educational_qualification || "—"}
              </Typography>
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="caption" sx={{ color: "#64748b" }}>Occupation</Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, color: "#1e293b", wordBreak: "break-word" }}>
                {userProfile.occupation || "—"}
              </Typography>
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="caption" sx={{ color: "#64748b" }}>Marital Status</Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, color: "#1e293b", wordBreak: "break-word" }}>
                {userProfile.marital_status || "Unmarried"}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Photo Gallery Section: If multiple photos available or visitor viewing */}
      {allPhotos.length > 0 && (
        <SectionCard title={`Photo Gallery (${allPhotos.length})`} icon={<PhotoLibraryIcon />}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, 1fr)",
                sm: "repeat(3, 1fr)",
                md: "repeat(4, 1fr)",
              },
              gap: 2,
              width: "100%",
            }}
          >
            {allPhotos.map((photoUrl, pIdx) => {
              const isPrimary = photoUrl === userProfile.image;
              return (
                <Box
                  key={`gallery-thumb-${pIdx}`}
                  onClick={() => handleOpenLightbox(pIdx)}
                  sx={{
                    height: 180,
                    borderRadius: "6px",
                    overflow: "hidden",
                    border: isPrimary ? "2px solid #700F2B" : "1px solid #e2e8f0",
                    cursor: "pointer",
                    position: "relative",
                    backgroundColor: "#f1f5f9",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
                    },
                    transition: "transform 0.2s, box-shadow 0.2s",
                  }}
                >
                  <img
                    src={photoUrl}
                    alt={`${fullName} photo ${pIdx + 1}`}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  {isPrimary && (
                    <Chip
                      label="Primary Photo"
                      size="small"
                      sx={{
                        position: "absolute",
                        bottom: 8,
                        left: 8,
                        backgroundColor: "#700F2B",
                        color: "#ffffff",
                        fontSize: "0.68rem",
                        height: 20,
                        fontWeight: 700,
                        borderRadius: "4px",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
                      }}
                    />
                  )}
                </Box>
              );
            })}
          </Box>
        </SectionCard>
      )}

      {/* Main Details Grid: 2 balanced columns on desktop, 1 column on mobile */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 3,
          alignItems: "start",
          width: "100%",
        }}
      >
        {/* Left Column */}
        <Box sx={{ display: "flex", flexDirection: "column", minWidth: 0, width: "100%" }}>
          <SectionCard title="Personal Information" icon={<PersonIcon />}>
            <DetailRow label="Full Name" value={fullName} />
            <DetailRow label="Gender" value={userProfile.gender} />
            <DetailRow label="Date of Birth" value={userProfile.date_of_birth ? new Date(userProfile.date_of_birth).toLocaleDateString() : null} />
            <DetailRow label="Age" value={userProfile.age ? `${userProfile.age} Years` : null} />
            <DetailRow label="Height" value={userProfile.height} />
            <DetailRow label="Marital Status" value={userProfile.marital_status} />
            <DetailRow label="Mother Tongue" value={userProfile.mother_tounge || userProfile.mother_tongue} />
            <DetailRow label="Profile Created For" value={userProfile.profilefor} />
            <DetailRow label="Blood Group" value={userProfile.bloodgroup} />
            <DetailRow label="Body Type & Complexion" value={[userProfile.body_type, userProfile.skin_type].filter(Boolean).join(" • ")} />
          </SectionCard>

          <SectionCard title="Religious & Horoscope Details" icon={<AstroIcon />}>
            <DetailRow label="Religion" value={userProfile.religion} />
            <DetailRow label="Caste" value={userProfile.caste} />
            <DetailRow label="Sub Caste" value={userProfile.subcaste} />
            <DetailRow label="Gotra" value={userProfile.gotra} />
            <DetailRow label="Rashi (Moon Sign)" value={userProfile.rashi} />
            <DetailRow label="Nakshatra" value={userProfile.nakshatra} />
            <DetailRow label="Sun Sign" value={userProfile.sunsign} />
          </SectionCard>

          <SectionCard title="Lifestyle & Habits" icon={<DietIcon />}>
            <DetailRow label="Dietary Habits" value={userProfile.diet} />
            <DetailRow label="Smoking" value={userProfile.smoke} />
            <DetailRow label="Drinking" value={userProfile.drink} />
            <DetailRow label="Any Other Info" value={userProfile.any_other_info} />
          </SectionCard>
        </Box>

        {/* Right Column */}
        <Box sx={{ display: "flex", flexDirection: "column", minWidth: 0, width: "100%" }}>
          <SectionCard title="Education & Career" icon={<SchoolIcon />}>
            <DetailRow label="Highest Qualification" value={userProfile.educational_qualification} />
            <DetailRow label="Occupation / Designation" value={userProfile.occupation} />
            <DetailRow label="Monthly / Annual Income" value={userProfile.income_per_month} />
            <DetailRow label="Work Location / Country" value={userProfile.occupation_country} />
          </SectionCard>

          <SectionCard title="Family Background" icon={<FamilyIcon />}>
            {Array.isArray(userProfile.parents) && userProfile.parents.length > 0 ? (
              userProfile.parents.map((p: any, idx: number) => (
                <React.Fragment key={`parent-view-${idx}`}>
                  <DetailRow
                    label={`${p.relation || "Parent"}'s Name`}
                    value={p.name}
                  />
                  {(p.contact || p.mobile_no) && (
                    <DetailRow
                      label={`${p.relation || "Parent"}'s Contact`}
                      value={p.contact || p.mobile_no}
                    />
                  )}
                </React.Fragment>
              ))
            ) : (
              <>
                <DetailRow label="Father's / Guardian's Name" value={userProfile.parent_name || userProfile.name_of_parent} />
                {userProfile.father_contact && <DetailRow label="Father's Contact" value={userProfile.father_contact} />}
                {userProfile.mother_contact && <DetailRow label="Mother's Contact" value={userProfile.mother_contact} />}
              </>
            )}
            <DetailRow
              label="Brothers"
              value={`Married: ${Number(userProfile.brother_elder_married || 0) + Number(userProfile.brother_younger_married || 0)}, Unmarried: ${Number(userProfile.brother_elder_unmarried || 0) + Number(userProfile.brother_younger_unmarried || 0)}`}
            />
            <DetailRow
              label="Sisters"
              value={`Married: ${Number(userProfile.sister_elder_married || 0) + Number(userProfile.sister_younger_married || 0)}, Unmarried: ${Number(userProfile.sister_elder_unmarried || 0) + Number(userProfile.sister_younger_unmarried || 0)}`}
            />
          </SectionCard>

          <SectionCard title="Partner Preferences" icon={<FavoriteIcon />}>
            <DetailRow
              label="Preferred Age Range"
              value={userProfile.from_age_preference && userProfile.to_age_preference ? `${userProfile.from_age_preference} - ${userProfile.to_age_preference} Years` : null}
            />
            <DetailRow
              label="Preferred Height Range"
              value={userProfile.from_height_preference && userProfile.to_height_preference ? `${userProfile.from_height_preference} to ${userProfile.to_height_preference}` : null}
            />
            <DetailRow label="Caste Preference" value={userProfile.caste_preference} />
            <DetailRow label="Education Preference" value={userProfile.education_preference} />
            <DetailRow label="Marital Status Preference" value={userProfile.maritalstatus_preference} />
            <DetailRow label="Preferred Location / Country" value={userProfile.occupation_country_preference} />
          </SectionCard>

          <SectionCard title="Contact Information" icon={<PhoneIcon />}>
            <DetailRow
              label="Mobile Number"
              value={
                Array.isArray(userProfile.mobile_numbers) && userProfile.mobile_numbers.length > 0
                  ? userProfile.mobile_numbers.filter(Boolean).join(", ")
                  : (userProfile.mobile_no || userProfile.contactinfo)
              }
            />
            <DetailRow label="Email Address" value={userProfile.email_id || userProfile.username} />
            <DetailRow label="Residential Address" value={userProfile.address} />
            <DetailRow label="City & State" value={[userProfile.city, userProfile.state].filter(Boolean).join(", ")} />
            <DetailRow label="Pincode" value={userProfile.pincode} />
          </SectionCard>
        </Box>
      </Box>

      {/* Lightbox Modal for Photo Gallery */}
      <Dialog
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: "#0f172a",
            borderRadius: "6px",
            overflow: "hidden",
            position: "relative",
            boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
          },
        }}
      >
        <IconButton
          onClick={() => setLightboxOpen(false)}
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            color: "#ffffff",
            backgroundColor: "rgba(0,0,0,0.6)",
            "&:hover": { backgroundColor: "rgba(0,0,0,0.9)" },
            zIndex: 10,
          }}
        >
          <CloseIcon />
        </IconButton>

        <Box sx={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 380, maxHeight: "80vh", p: 2 }}>
          {allPhotos.length > 1 && (
            <IconButton
              onClick={handlePrevPhoto}
              sx={{
                position: "absolute",
                left: 16,
                color: "#ffffff",
                backgroundColor: "rgba(0,0,0,0.6)",
                "&:hover": { backgroundColor: "rgba(0,0,0,0.9)" },
                zIndex: 5,
              }}
            >
              <NavigateBeforeIcon fontSize="large" />
            </IconButton>
          )}

          {allPhotos[lightboxIndex] && (
            <img
              src={allPhotos[lightboxIndex]}
              alt={`${fullName} full view`}
              style={{
                maxWidth: "100%",
                maxHeight: "75vh",
                objectFit: "contain",
                borderRadius: "4px",
              }}
            />
          )}

          {allPhotos.length > 1 && (
            <IconButton
              onClick={handleNextPhoto}
              sx={{
                position: "absolute",
                right: 16,
                color: "#ffffff",
                backgroundColor: "rgba(0,0,0,0.6)",
                "&:hover": { backgroundColor: "rgba(0,0,0,0.9)" },
                zIndex: 5,
              }}
            >
              <NavigateNextIcon fontSize="large" />
            </IconButton>
          )}
        </Box>

        <Box sx={{ py: 1.5, px: 3, backgroundColor: "rgba(0,0,0,0.75)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="body2" sx={{ color: "#e2e8f0", fontWeight: 600 }}>
            {fullName} — Photo {lightboxIndex + 1} of {allPhotos.length}
          </Typography>
          {allPhotos[lightboxIndex] === userProfile.image && (
            <Chip label="Primary Profile Photo" size="small" sx={{ backgroundColor: "#D4AF37", color: "#000", fontWeight: 700, borderRadius: "4px" }} />
          )}
        </Box>
      </Dialog>
    </Box>
  );
};

export default ProfileView;