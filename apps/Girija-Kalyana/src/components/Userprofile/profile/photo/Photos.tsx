import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Button,
  Typography,
  DialogTitle,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  Chip,
  IconButton,
  CircularProgress,
  Paper,
  Alert,
} from "@mui/material";
import {
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  CloudUpload as UploadIcon,
  Add as AddIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import toast from "react-hot-toast";
import axios from "axios";
import { get } from "../../../api/authHooks";
import {
  useGetMemberDetails,
  useUpdateProfile,
} from "../../../api/User";
import TokenService from "../../../token/tokenService";

const uploadSingleToImageKit = async (file: File, username?: string): Promise<string> => {
  // 1. Get fresh signature for this file from backend
  const authRes: any = await get("/image-kit-auth");
  const { signature, expire, token, publicKey } = authRes?.data || authRes;
  if (!signature || !expire || !token) {
    throw new Error("Missing ImageKit authorization credentials from server");
  }

  // 2. Prepare form data
  const data = new FormData();
  data.append("file", file);
  data.append("fileName", `${username || "photo"}_${Date.now()}_${file.name.replace(/\s+/g, "_")}`);
  data.append("publicKey", publicKey || (import.meta as any).env.VITE_IMAGEKIT_PUBLIC_KEY);
  data.append("signature", signature);
  data.append("expire", expire);
  data.append("token", token);
  data.append("folder", "/profile-images");

  // 3. Upload to ImageKit API
  const uploadRes = await axios.post(
    "https://upload.imagekit.io/api/v1/files/upload",
    data
  );

  if (uploadRes.data && uploadRes.data.url) {
    return uploadRes.data.url;
  }
  throw new Error("No URL returned from ImageKit");
};

const Photos: React.FC = () => {
  const registerNo = TokenService.getRegistrationNo();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: userProfile, refetch: getMember, isLoading } = useGetMemberDetails(registerNo);
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();

  const [imageList, setImageList] = useState<string[]>([]);
  const [primaryImage, setPrimaryImage] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgressMsg, setUploadProgressMsg] = useState<string>("");
  const [uploadErrors, setUploadErrors] = useState<{ fileName: string; reason: string }[]>([]);
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

    const fileList = Array.from(files);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setIsUploading(true);
    setUploadErrors([]);
    setUploadProgressMsg(`Uploading ${fileList.length} photo(s)...`);

    // Use Promise.allSettled to process each image independently
    const results = await Promise.allSettled(
      fileList.map(async (file) => {
        if (!file.type.match(/^image\//)) {
          throw new Error(`Invalid format (${file.type || "unknown"}). Only images are supported.`);
        }
        if (file.size > 10 * 1024 * 1024) {
          throw new Error(`Size ${(file.size / (1024 * 1024)).toFixed(1)}MB exceeds 10MB limit.`);
        }
        const url = await uploadSingleToImageKit(file, userProfile?.registration_no);
        return { file, url };
      })
    );

    setIsUploading(false);
    setUploadProgressMsg("");

    const succeededUrls: string[] = [];
    const failedList: { fileName: string; reason: string }[] = [];

    results.forEach((res, index) => {
      const file = fileList[index];
      if (res.status === "fulfilled") {
        succeededUrls.push(res.value.url);
      } else {
        const err = res.reason;
        const errorMsg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Upload failed";
        failedList.push({
          fileName: file.name,
          reason: errorMsg,
        });
      }
    });

    // If any succeeded, display them immediately in the gallery
    if (succeededUrls.length > 0) {
      setImageList((prev) => {
        const next = [...prev, ...succeededUrls];
        if (!primaryImage && next.length > 0) {
          setPrimaryImage(next[0]);
        }
        return next;
      });

      if (failedList.length === 0) {
        toast.success(`Successfully uploaded ${succeededUrls.length} photo(s). Remember to click 'Save Changes'.`);
      } else {
        toast.success(`Uploaded ${succeededUrls.length} photo(s) successfully.`);
      }
    }

    // If any failed, show detailed reasons
    if (failedList.length > 0) {
      setUploadErrors(failedList);
      failedList.forEach((item) => {
        toast.error(`"${item.fileName}": ${item.reason}`, { duration: 6000 });
      });
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
        <CircularProgress sx={{ color: "#700F2B" }} />
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
              multiple
              style={{ display: "none" }}
            />
            <Button
              variant="outlined"
              startIcon={isUploading ? <CircularProgress size={16} /> : <AddIcon />}
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading || isUpdating}
              sx={{
                borderColor: "#700F2B",
                color: "#700F2B",
                borderRadius: "4px",
                fontWeight: 600,
                textTransform: "none",
                fontSize: "0.85rem",
                "&:hover": {
                  borderColor: "#590b22",
                  backgroundColor: "rgba(112, 15, 43, 0.05)",
                },
              }}
            >
              {isUploading ? "Uploading..." : "Add Photos"}
            </Button>

            <Button
              variant="contained"
              onClick={handleSaveAll}
              disabled={isUpdating || isUploading || imageList.length === 0}
              sx={{
                backgroundColor: "#700F2B",
                color: "#ffffff",
                borderRadius: "4px",
                fontWeight: 600,
                textTransform: "none",
                fontSize: "0.85rem",
                "&:hover": { backgroundColor: "#590b22" },
              }}
            >
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Uploading progress notification */}
      {isUploading && (
        <Alert
          severity="info"
          icon={<CircularProgress size={18} sx={{ color: "#700F2B" }} />}
          sx={{ mb: 2.5, borderRadius: "6px" }}
        >
          {uploadProgressMsg || "Uploading photos to ImageKit... Please wait."}
        </Alert>
      )}

      {/* Upload errors list */}
      {uploadErrors.length > 0 && (
        <Alert
          severity="error"
          onClose={() => setUploadErrors([])}
          sx={{ mb: 2.5, borderRadius: "6px" }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
            {uploadErrors.length} photo(s) failed to upload:
          </Typography>
          <Box component="ul" sx={{ pl: 2.5, m: 0, fontSize: "0.85rem" }}>
            {uploadErrors.map((err, i) => (
              <li key={i}>
                <strong>{err.fileName}</strong>: {err.reason}
              </li>
            ))}
          </Box>
        </Alert>
      )}

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
            transition: "all 0.2s ease",
            "&:hover": {
              borderColor: "#700F2B",
              backgroundColor: "#f1f5f9",
            },
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          <UploadIcon sx={{ fontSize: 48, color: "#94a3b8", mb: 1 }} />
          <Typography variant="h6" sx={{ color: "#475569", fontWeight: 600, fontSize: "1rem" }}>
            No photos added yet
          </Typography>
          <Typography variant="body2" sx={{ color: "#94a3b8", mt: 0.5 }}>
            Click here to select and upload multiple portrait photos at once (Max size 10MB per image)
          </Typography>
        </Paper>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(3, 1fr)",
              sm: "repeat(4, 1fr)",
              md: "repeat(5, 1fr)",
              lg: "repeat(6, 1fr)",
            },
            gap: 2,
            width: "100%",
          }}
        >
          {imageList.map((photoUrl, idx) => {
            const isPrimary = primaryImage === photoUrl;

            return (
              <Box
                key={`photo-${idx}`}
                sx={{
                  position: "relative",
                  aspectRatio: "1 / 1",
                  borderRadius: "8px",
                  overflow: "hidden",
                  border: isPrimary ? "3px solid #700F2B" : "1px solid #cbd5e1",
                  boxShadow: isPrimary ? "0 4px 12px rgba(112, 15, 43, 0.2)" : "0 1px 3px rgba(0,0,0,0.08)",
                  backgroundColor: "#f1f5f9",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  },
                }}
              >
                <img
                  src={photoUrl}
                  alt={`Photo ${idx + 1}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />

                {/* Primary Photo Badge */}
                {isPrimary && (
                  <Chip
                    icon={<StarIcon sx={{ fontSize: "12px !important", color: "#ffffff !important" }} />}
                    label="Primary"
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 6,
                      left: 6,
                      backgroundColor: "#700F2B",
                      color: "#ffffff",
                      fontWeight: 700,
                      fontSize: "0.65rem",
                      height: 20,
                      borderRadius: "4px",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                      zIndex: 2,
                    }}
                  />
                )}

                {/* Cross / Delete Icon on Top-Right Side of Image */}
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePromptDelete(idx);
                  }}
                  sx={{
                    position: "absolute",
                    top: 6,
                    right: 6,
                    backgroundColor: "rgba(15, 23, 42, 0.75)",
                    color: "#ffffff",
                    width: 26,
                    height: 26,
                    p: 0,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: "#ef4444",
                      color: "#ffffff",
                      transform: "scale(1.1)",
                    },
                    boxShadow: "0 2px 4px rgba(0,0,0,0.35)",
                    zIndex: 2,
                  }}
                  title="Remove photo"
                >
                  <CloseIcon sx={{ fontSize: 16 }} />
                </IconButton>

                {/* Bottom Action for Non-Primary Photos */}
                {!isPrimary && (
                  <Box
                    onClick={() => handleSetPrimary(photoUrl)}
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      py: 0.5,
                      px: 0.5,
                      backgroundColor: "rgba(15, 23, 42, 0.72)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 0.5,
                      transition: "background-color 0.2s ease",
                      "&:hover": { backgroundColor: "rgba(15, 23, 42, 0.95)" },
                      zIndex: 2,
                    }}
                    title="Click to make primary profile photo"
                  >
                    <StarBorderIcon sx={{ fontSize: 13, color: "#ffffff" }} />
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#ffffff",
                        fontSize: "0.68rem",
                        fontWeight: 600,
                        userSelect: "none",
                      }}
                    >
                      Set Primary
                    </Typography>
                  </Box>
                )}
              </Box>
            );
          })}

          {/* Add More Photo Tile in Grid */}
          <Box
            onClick={() => !isUploading && fileInputRef.current?.click()}
            sx={{
              aspectRatio: "1 / 1",
              borderRadius: "8px",
              border: "2px dashed #cbd5e1",
              backgroundColor: "#f8fafc",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: isUploading ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
              "&:hover": {
                borderColor: "#700F2B",
                backgroundColor: "#f1f5f9",
              },
            }}
          >
            {isUploading ? (
              <CircularProgress size={24} sx={{ color: "#700F2B" }} />
            ) : (
              <>
                <AddIcon sx={{ fontSize: 28, color: "#64748b", mb: 0.5 }} />
                <Typography variant="caption" sx={{ color: "#475569", fontWeight: 600, fontSize: "0.75rem" }}>
                  Add More
                </Typography>
              </>
            )}
          </Box>
        </Box>
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
