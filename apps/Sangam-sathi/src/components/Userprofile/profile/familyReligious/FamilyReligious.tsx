import React, { useEffect, useState } from "react";
import {
  Box,
  Stack,
  Typography,
  Button,
  TextField,
  CircularProgress,
  Divider,
  Paper,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Add as AddIcon, DeleteOutline as DeleteIcon } from "@mui/icons-material";
import toast from "react-hot-toast";
import { useGetMemberDetails, useUpdateProfile } from "../../../api/User";
import TokenService from "../../../token/tokenService";
import { LoadingComponent } from "../../../../App";

const FamilyReligious = ({ render }: any) => {
  const registerNo = TokenService.getRegistrationNo();
  const [formData, setFormData] = useState<any>({
    religion: '',
    caste: '',
    subcaste: '',
    gotra: '',
    rashi: '',
    nakshatra: '',
    sunsign: '',
    name_of_parent: '',
    brother_younger_unmarried: '',
    brother_younger_married: '',
    brother_elder_unmarried: '',
    brother_elder_married: '',
    sister_younger_unmarried: '',
    sister_younger_married: '',
    sister_elder_unmarried: '',
    sister_elder_married: ''
  });

  const [parents, setParents] = useState<Array<{ relation: string; name: string; contact?: string; mobile_no?: string }>>([
    { relation: "Father", name: "", contact: "" },
    { relation: "Mother", name: "", contact: "" },
  ]);

  const { data: userProfile, isLoading, isError, error } = useGetMemberDetails(registerNo);
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();

  useEffect(() => {
    if (isError) {
      toast.error(error.message);
    }
  }, [isError, error]);

  useEffect(() => {
    if (userProfile) {
      setFormData({
        ...userProfile,
      });

      if (Array.isArray(userProfile.parents) && userProfile.parents.length > 0) {
        setParents(userProfile.parents);
      } else if (userProfile.parent_name || userProfile.name_of_parent) {
        setParents([
          { relation: userProfile.name_of_parent || "Father", name: userProfile.parent_name || "" },
          { relation: "Mother", name: "" }
        ]);
      }
    }
  }, [userProfile]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleParentChange = (index: number, field: "relation" | "name" | "contact", value: string) => {
    setParents((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleAddParent = () => {
    setParents((prev) => [...prev, { relation: "Other", name: "", contact: "" }]);
  };

  const handleRemoveParent = (index: number) => {
    if (parents.length <= 1) {
      toast.error("At least one parent entry is required");
      return;
    }
    setParents((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSave = () => {
    const primaryParent = parents[0] || { relation: "Father", name: "" };
    const payload = {
      ...formData,
      parents,
      name_of_parent: parents.map(p => p.relation).filter(Boolean).join(", ") || primaryParent.relation,
      parent_name: parents.map(p => p.name).filter(Boolean).join(", ") || primaryParent.name,
    };

    updateProfile(payload, {
      onSuccess: () => {
        toast.success("Details updated successfully");
      },
      onError: () => {
        toast.error("Failed to update details");
      }
    });
  };

  const handleReset = () => {
    if (userProfile) {
      setFormData({
        ...userProfile,
      });
      if (Array.isArray(userProfile.parents) && userProfile.parents.length > 0) {
        setParents(userProfile.parents);
      }
    }
  };

  return (
    <Box
      sx={{
        p: { xs: 0, sm: 3, md: 2 },
        borderRadius: "6px",
        maxWidth: "100%",
        mx: 'auto'
      }}
    >
      <Stack spacing={4}>
        {/* Religious Details */}
        <Box>
          <Typography variant="h6" fontWeight={700} gutterBottom mt={1} sx={{ color: "#0f172a", fontSize: "1.05rem" }}>
            Religious Details
          </Typography>

          <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }} gap={2}>
            {[
              { name: 'religion', label: 'Religion' },
              { name: 'caste', label: 'Caste' },
              { name: 'subcaste', label: 'Subcaste' },
              { name: 'gotra', label: 'Gotra' },
              { name: 'rashi', label: 'Rashi' },
              { name: 'nakshatra', label: 'Nakshatra' },
              { name: 'sunsign', label: 'Sun Sign' },
            ].map(({ name, label }) => (
              <TextField
                key={name}
                label={label}
                name={name}
                value={formData[name] || ''}
                onChange={handleChange}
                disabled={isUpdating}
                fullWidth
                size="small"
              />
            ))}
          </Box>
        </Box>

        <Divider />

        {/* Family Section */}
        <Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h6" fontWeight={700} sx={{ color: "#0f172a", fontSize: "1.05rem" }}>
              Parents & Guardians Details
            </Typography>
            <Button
              variant="outlined"
              size="small"
              startIcon={<AddIcon />}
              onClick={handleAddParent}
              sx={{
                borderColor: "#0F172A",
                color: "#0F172A",
                textTransform: "none",
                fontWeight: 600,
                borderRadius: "4px",
                "&:hover": { borderColor: "#1E293B", backgroundColor: "rgba(15, 23, 42, 0.04)" }
              }}
            >
              Add Parent / Guardian
            </Button>
          </Box>

          <Stack spacing={2} sx={{ mb: 3 }}>
            {parents.map((p, pIdx) => (
              <Paper
                key={`parent-edit-${pIdx}`}
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: "6px",
                  border: "1px solid #e2e8f0",
                  backgroundColor: "#f8fafc",
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 2,
                  alignItems: { xs: "stretch", sm: "center" }
                }}
              >
                <FormControl size="small" sx={{ minWidth: 160 }}>
                  <InputLabel id={`relation-label-ss-${pIdx}`}>Relation</InputLabel>
                  <Select
                    labelId={`relation-label-ss-${pIdx}`}
                    label="Relation"
                    value={p.relation}
                    onChange={(e) => handleParentChange(pIdx, "relation", e.target.value)}
                  >
                    <MenuItem value="Father">Father</MenuItem>
                    <MenuItem value="Mother">Mother</MenuItem>
                    <MenuItem value="Guardian">Guardian</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  label={`${p.relation || 'Parent'} Name`}
                  size="small"
                  value={p.name}
                  onChange={(e) => handleParentChange(pIdx, "name", e.target.value)}
                  placeholder={`Enter ${p.relation.toLowerCase()}'s full name`}
                  fullWidth
                />

                <TextField
                  label={`${p.relation || 'Parent'} Contact (Optional)`}
                  size="small"
                  value={p.contact || (p as any).mobile_no || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "" || /^\d{0,10}$/.test(val)) {
                      handleParentChange(pIdx, "contact", val);
                    }
                  }}
                  placeholder="10-digit number"
                  inputProps={{ maxLength: 10, pattern: "[0-9]*" }}
                  fullWidth
                />

                {parents.length > 1 && (
                  <IconButton
                    color="error"
                    size="small"
                    onClick={() => handleRemoveParent(pIdx)}
                    title="Remove parent"
                    sx={{ alignSelf: { xs: "flex-end", sm: "center" } }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                )}
              </Paper>
            ))}
          </Stack>

          <Typography variant="subtitle2" fontWeight={600} gutterBottom sx={{ color: "#475569", mb: 1.5 }}>
            Siblings Details
          </Typography>

          <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }} gap={2}>
            {[
              'brother_younger_unmarried',
              'brother_younger_married',
              'brother_elder_unmarried',
              'brother_elder_married',
              'sister_younger_unmarried',
              'sister_younger_married',
              'sister_elder_unmarried',
              'sister_elder_married',
            ].map((field) => (
              <TextField
                key={field}
                label={field.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                name={field}
                value={formData[field] || ''}
                onChange={handleChange}
                disabled={isUpdating}
                fullWidth
                size="small"
              />
            ))}
          </Box>
        </Box>
      </Stack>

      {/* Actions */}
      <Box
        display="flex"
        justifyContent={{ xs: 'space-evenly', sm: 'flex-end' }}
        gap={2}
        mt={4}
      >
        <Button
          variant="outlined"
          onClick={handleReset}
          disabled={isUpdating}
          fullWidth={true}
          sx={{ 
            color: "#475569",
            borderColor: "#cbd5e1",
            maxWidth: { xs: '160px', sm: 180 },
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: "4px",
            "&:hover": {
              backgroundColor: "#f8fafc",
              borderColor: "#94a3b8"
            }
          }}
        >
          Reset
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={isUpdating}
          fullWidth={true}
          sx={{ 
            maxWidth: { xs: '160px', sm: 200 },
            textTransform: 'none', 
            fontWeight: 600,
            borderRadius: "4px",
            backgroundColor: "#0F172A",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#1E293B"
            } 
          }}
          startIcon={isUpdating ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {isUpdating ? 'Saving...' : 'Save Changes'}
        </Button>
      </Box>

      {isLoading && <LoadingComponent/>}
    </Box>
  );
};

export default FamilyReligious;
