import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Button,
  Typography,
  Card,
  CardMedia,
  DialogTitle,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  Chip,
  IconButton,
  Grid,
  CircularProgress,
  Paper,
} from "@mui/material";
import {
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Delete as DeleteIcon,
  CloudUpload as UploadIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import toast from "react-hot-toast";
import {
  useGetMemberDetails,
  useImageKitUpload,
  useUpdateProfile,
} from "../../../api/User";
import TokenService from "../../../token/tokenService";

const Photos: React.FC = () => {
  const registerNo = TokenService.getRegistrationNo();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: userProfile, refetch: getMember, isLoading } = useGetMemberDetails(registerNo);
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();
  const imagekit = useImageKitUpload(userProfile?.registration_no);

  const [imageList, setImageList] = useState<string[]>([]);
  const [primaryImage, setPrimaryImage] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [deleteTargetIndex, setDeleteTargetIndex] = useState<number | null>(null);

  // Initialize photo list from profile
  useEffect(() => {
    if (userProfile) {
      const existingImages: string[] = Array.isArray(userProfile.images) && userProfile.images.length > 0
        ? userProfile.images
        : userProfile.image ? [userProfile.image] : [];

      setImageList(existingImages);
      setPrimaryImage(userProfile.image || existingImages[0] || "");
    }
  }, [userProfile]);

  const handleSelectFiles = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.match("image.*")) {
      toast.error("Please select a valid image file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    setIsUploading(true);

    imagekit.mutate(file, {
      onSuccess: (data) => {
        setIsUploading(false);
        if (data.url) {
          const newUrl = data.url;
          setImageList((prev) => {
            const next = [...prev, newUrl];
            if (!primaryImage) {
              setPrimaryImage(newUrl);
            }
            return next;
          });
          toast.success("Photo uploaded to gallery. Click 'Save Changes' to update your profile.");
        } else {
          toast.error("Failed to retrieve uploaded image URL");
        }
      },
      onError: (err) => {
        setIsUploading(false);
        toast.error("Failed to upload photo");
        console.error("Upload error:", err);
      },
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSetPrimary = (url: string) => {
    setPrimaryImage(url);
    toast.success("Marked as primary profile photo. Remember to click 'Save Changes'.");
  };

  const handlePromptDelete = (index: number) => {
    setDeleteTargetIndex(index);
  };

  const handleConfirmDelete = () => {
    if (deleteTargetIndex === null) return;
    const removedUrl = imageList[deleteTargetIndex];
    const updatedList = imageList.filter((_, idx) => idx !== deleteTargetIndex);
    setImageList(updatedList);

    if (primaryImage === removedUrl) {
      setPrimaryImage(updatedList[0] || "");
    }

    setDeleteTargetIndex(null);
    toast.success("Photo removed from gallery. Click 'Save Changes' to apply.");
  };

  const handleSaveAll = () => {
    if (imageList.length === 0) {
      toast.error("Please upload at least one profile photo");
      return;
    }

    const finalPrimary = primaryImage || imageList[0];

    updateProfile(
      {
        registerNo,
        image: finalPrimary,
        images: imageList,
        image_verification: "pending",
      },
      {
        onSuccess: () => {
          toast.success("Profile photos updated successfully");
          getMember();
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || "Failed to update profile photos");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress sx={{ color: "#0F172A" }} />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", py: { xs: 1, md: 3 }, px: { xs: 1, sm: 2 } }}>
      {/* Header Info */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: "6px",
          border: "1px solid #e2e8f0",
          backgroundColor: "#ffffff",
        }}
      >
        <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#0f172a", fontSize: "1.15rem" }}>
              Profile Photo Gallery
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748b", mt: 0.5, fontSize: "0.85rem" }}>
              Upload multiple photos of the bride/groom. Choose your primary photo to display on search results and profile cards.
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleSelectFiles}
              accept="image/*"
              style={{ display: "none" }}
            />
            <Button
              variant="outlined"
              startIcon={isUploading ? <CircularProgress size={16} /> : <AddIcon />}
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading || isUpdating}
              sx={{
                borderColor: "#0F172A",
                color: "#0F172A",
                borderRadius: "4px",
                fontWeight: 600,
                textTransform: "none",
                fontSize: "0.85rem",
                "&:hover": {
                  borderColor: "#1e293b",
                  backgroundColor: "rgba(15, 23, 42, 0.05)",
                },
              }}
            >
              {isUploading ? "Uploading..." : "Add Photo"}
            </Button>

            <Button
              variant="contained"
              onClick={handleSaveAll}
              disabled={isUpdating || isUploading || imageList.length === 0}
              sx={{
                backgroundColor: "#0F172A",
                color: "#ffffff",
                borderRadius: "4px",
                fontWeight: 600,
                textTransform: "none",
                fontSize: "0.85rem",
                "&:hover": { backgroundColor: "#1e293b" },
              }}
            >
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Gallery Grid */}
      {imageList.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: "center",
            borderRadius: "6px",
            border: "2px dashed #cbd5e1",
            backgroundColor: "#f8fafc",
            cursor: "pointer",
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          <UploadIcon sx={{ fontSize: 48, color: "#94a3b8", mb: 1 }} />
          <Typography variant="h6" sx={{ color: "#475569", fontWeight: 600, fontSize: "1rem" }}>
            No photos added yet
          </Typography>
          <Typography variant="body2" sx={{ color: "#94a3b8", mt: 0.5 }}>
            Click here to upload clear, high-resolution portrait photos (Max size 10MB)
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={2.5}>
          {imageList.map((photoUrl, idx) => {
            const isPrimary = primaryImage === photoUrl;

            return (
              <Grid item xs={12} sm={6} md={4} key={`photo-${idx}`}>
                <Card
                  sx={{
                    borderRadius: "6px",
                    border: isPrimary ? "2px solid #0F172A" : "1px solid #e2e8f0",
                    boxShadow: isPrimary ? "0 4px 12px rgba(15, 23, 42, 0.15)" : "0 1px 3px rgba(0,0,0,0.06)",
                    position: "relative",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* Photo Media */}
                  <Box sx={{ position: "relative", height: 260, backgroundColor: "#f1f5f9" }}>
                    <CardMedia
                      component="img"
                      src={photoUrl}
                      alt={`Photo ${idx + 1}`}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />

                    {/* Primary Badge */}
                    {isPrimary && (
                      <Chip
                        icon={<StarIcon sx={{ fontSize: "14px !important", color: "#ffffff !important" }} />}
                        label="Primary Photo"
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 10,
                          left: 10,
                          backgroundColor: "#0F172A",
                          color: "#ffffff",
                          fontWeight: 700,
                          fontSize: "0.72rem",
                          borderRadius: "4px",
                          boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
                        }}
                      />
                    )}

                    {/* Delete action */}
                    <IconButton
                      size="small"
                      onClick={() => handlePromptDelete(idx)}
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        color: "#ef4444",
                        "&:hover": { backgroundColor: "#ffffff", color: "#b91c1c" },
                        boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                      }}
                      title="Delete photo"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>

                  {/* Footer Card Action */}
                  <Box sx={{ p: 1.5, backgroundColor: "#ffffff", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 600 }}>
                      Photo {idx + 1} of {imageList.length}
                    </Typography>

                    {isPrimary ? (
                      <Typography variant="caption" sx={{ color: "#0F172A", fontWeight: 700 }}>
                        ★ Shown on Card
                      </Typography>
                    ) : (
                      <Button
                        size="small"
                        startIcon={<StarBorderIcon fontSize="small" />}
                        onClick={() => handleSetPrimary(photoUrl)}
                        sx={{
                          textTransform: "none",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          color: "#475569",
                          borderRadius: "4px",
                          py: 0.25,
                          px: 1,
                          "&:hover": { color: "#0F172A", backgroundColor: "rgba(15, 23, 42, 0.05)" },
                        }}
                      >
                        Set as Primary
                      </Button>
                    )}
                  </Box>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteTargetIndex !== null}
        onClose={() => setDeleteTargetIndex(null)}
        PaperProps={{ sx: { borderRadius: "6px", p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: "#1e293b", fontSize: "1.1rem" }}>
          Delete Photo?
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "#64748b", fontSize: "0.9rem" }}>
            Are you sure you want to remove this photo from your gallery? This will take effect once you click &apos;Save Changes&apos;.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setDeleteTargetIndex(null)}
            sx={{ textTransform: "none", color: "#64748b", fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmDelete}
            sx={{ textTransform: "none", fontWeight: 600, borderRadius: "4px" }}
          >
            Delete Photo
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Photos;