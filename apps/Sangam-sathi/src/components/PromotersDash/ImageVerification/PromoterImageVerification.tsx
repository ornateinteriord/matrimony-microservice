import React, { useEffect, useState, useMemo } from "react";
import PaginationDataTable from "../../common/PaginationDataTable";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Paper,
  Tabs,
  Tab,
  IconButton,
  Button,
  Tooltip,
  Chip,
  Stack,
} from "@mui/material";
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  Refresh as RefreshIcon,
  HourglassEmpty as HourglassEmptyIcon,
  CheckCircle as CheckCircleIcon,
  PeopleAlt as PeopleAltIcon,
} from "@mui/icons-material";
import {
  customStyles,
  getImageVerificationColumns,
} from "../../../utils/DataTableColumnsProvider";
import {
  useGetPromoterImageVerification,
  useUpgradePromoterUserStatus,
} from "../../api/Promoter";
import { LoadingTextSpinner } from "../../../utils/common";
import { toast } from "react-toastify";
import TokenService from "../../token/tokenService";

const PromoterImageVerification: React.FC = () => {
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 50 });
  const [activeTab, setActiveTab] = useState<"pending" | "active" | "all">("pending");
  const [search, setSearch] = useState("");

  const decodedToken = TokenService.decodeToken();
  const promoterId = decodedToken?.promoter_id || decodedToken?.username;

  const {
    data,
    isPending: isLoading,
    isError,
    error,
    mutate: fetchUsers,
  } = useGetPromoterImageVerification();

  const users = data?.content || [];
  const [localUsers, setLocalUsers] = useState(users);
  const upgradeUserMutation = useUpgradePromoterUserStatus();

  // Fetch users when pagination, activeTab, or promoterId changes
  useEffect(() => {
    if (promoterId) {
      fetchUsers({
        promoter_id: promoterId,
        page: paginationModel.page,
        pageSize: paginationModel.pageSize,
        status: activeTab,
      });
    }
  }, [paginationModel.page, paginationModel.pageSize, activeTab, promoterId]);

  // Keep local users in sync with API response
  useEffect(() => {
    setLocalUsers(users);
  }, [users]);

  // Display error toast if API fails
  useEffect(() => {
    if (isError && error) {
      toast.error(error.message || "Failed to load image verification users");
    }
  }, [isError, error]);

  const handleRefresh = () => {
    if (promoterId) {
      fetchUsers({
        promoter_id: promoterId,
        page: paginationModel.page,
        pageSize: paginationModel.pageSize,
        status: activeTab,
      });
      toast.info("Refreshed user list");
    }
  };

  const handleStatusUpdate = async (regno: string, currentStatus?: string) => {
    if (!regno) return;
    const isAct = (currentStatus || "").toLowerCase() === "active";
    const newStatus = isAct ? "pending" : "active";
    const statusLabel = newStatus === "active" ? "Active" : "Pending";

    // Optimistically update local users state
    setLocalUsers((prevUsers) =>
      prevUsers.map((user) => {
        const isMatch = user.registration_no === regno || user.ref_no === regno;
        return isMatch ? { ...user, image_verification: newStatus } : user;
      })
    );

    try {
      await upgradeUserMutation.mutateAsync(
        {
          regno,
          image_verification: newStatus,
        },
        {
          onSuccess: (res) => {
            toast.success(
              res?.message || `User ${regno} image verification status updated to ${statusLabel}!`
            );
            // Re-fetch to ensure sync with backend
            if (promoterId) {
              fetchUsers({
                promoter_id: promoterId,
                page: paginationModel.page,
                pageSize: paginationModel.pageSize,
                status: activeTab,
              });
            }
          },
          onError: (err) => {
            toast.error(err?.message || `Failed to update status for user ${regno}`);
            // Revert by re-fetching
            if (promoterId) {
              fetchUsers({
                promoter_id: promoterId,
                page: paginationModel.page,
                pageSize: paginationModel.pageSize,
                status: activeTab,
              });
            }
          },
        }
      );
    } catch (err: any) {
      toast.error(err?.message || "Failed to update image verification status");
    }
  };

  // Filter rows based on search input
  const filteredRows = useMemo(() => {
    return localUsers.filter((item) => {
      const isAdmin = item?.user_role?.toLowerCase() === "admin";
      if (isAdmin) return false;

      if (!search.trim()) return true;

      const q = search.toLowerCase();
      const regNo = (item.registration_no || item.ref_no || "").toString().toLowerCase();
      const firstName = (item.first_name || "").toLowerCase();
      const lastName = (item.last_name || "").toLowerCase();
      const username = (item.username || "").toLowerCase();
      const email = (item.email_id || "").toLowerCase();
      const gender = (item.gender || "").toLowerCase();
      const userRole = (item.user_role || item.type_of_user || "").toLowerCase();
      const imgStatus = (item.image_verification || "").toLowerCase();

      return (
        regNo.includes(q) ||
        firstName.includes(q) ||
        lastName.includes(q) ||
        username.includes(q) ||
        email.includes(q) ||
        gender.includes(q) ||
        userRole.includes(q) ||
        imgStatus.includes(q)
      );
    });
  }, [localUsers, search]);

  return (
    <Box sx={{ width: "100%", maxWidth: "100%", p: { xs: 1.5, sm: 2.5, md: 3 } }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          gap: 1.5,
          mb: 3,
        }}
      >
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: "#0f172a",
              fontFamily: "Outfit sans-serif",
              letterSpacing: "-0.02em",
            }}
          >
            My Users - Image Verification
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#64748b",
              fontFamily: "Outfit sans-serif",
              mt: 0.5,
            }}
          >
            Verify and manage profile photo approvals for your referred users
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} alignItems="center">
          <Tooltip title="Refresh list">
            <IconButton
              onClick={handleRefresh}
              disabled={isLoading}
              sx={{
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                backgroundColor: "#ffffff",
                "&:hover": { backgroundColor: "#f8fafc" },
              }}
            >
              <RefreshIcon fontSize="small" sx={{ color: "#475569" }} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>

      {/* Main Card */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: "12px",
          border: "1px solid #e2e8f0",
          backgroundColor: "#ffffff",
        }}
      >
        {/* Filter Tabs */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "stretch", sm: "center" },
            gap: 2,
            mb: 2.5,
            borderBottom: "1px solid #f1f5f9",
            pb: 1.5,
          }}
        >
          <Tabs
            value={activeTab}
            onChange={(_, val) => {
              setActiveTab(val);
              setPaginationModel((prev) => ({ ...prev, page: 0 }));
            }}
            sx={{
              "& .MuiTabs-indicator": {
                backgroundColor: "#0F172A",
                height: 3,
                borderRadius: "3px 3px 0 0",
              },
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 600,
                fontSize: "14px",
                fontFamily: "Outfit sans-serif",
                color: "#64748b",
                minHeight: 44,
                px: 2,
                "&.Mui-selected": {
                  color: "#0F172A",
                },
              },
            }}
          >
            <Tab
              value="pending"
              label="Pending Verification"
              icon={<HourglassEmptyIcon fontSize="small" sx={{ color: activeTab === "pending" ? "#d97706" : undefined }} />}
              iconPosition="start"
            />
            <Tab
              value="active"
              label="Active / Verified"
              icon={<CheckCircleIcon fontSize="small" sx={{ color: activeTab === "active" ? "#10b981" : undefined }} />}
              iconPosition="start"
            />
            <Tab
              value="all"
              label="All Referred Users"
              icon={<PeopleAltIcon fontSize="small" />}
              iconPosition="start"
            />
          </Tabs>

          {/* Search Box */}
          <TextField
            placeholder="Search by name, reg no, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: "#94a3b8" }} />
                </InputAdornment>
              ),
              endAdornment: search ? (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearch("")} edge="end">
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ) : null,
            }}
            sx={{
              minWidth: { xs: "100%", sm: 280, md: 320 },
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                backgroundColor: "#f8fafc",
                fontSize: "14px",
                fontFamily: "Outfit sans-serif",
                "& fieldset": {
                  borderColor: "#e2e8f0",
                },
                "&:hover fieldset": {
                  borderColor: "#cbd5e1",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#0F172A",
                },
              },
            }}
          />
        </Box>

        {/* Data Table */}
        <PaginationDataTable
          columns={getImageVerificationColumns(upgradeUserMutation, handleStatusUpdate)}
          data={filteredRows}
          customStyles={customStyles}
          isLoading={isLoading}
          totalRows={data?.totalRecords || 0}
          paginationModel={paginationModel}
          setPaginationModel={setPaginationModel}
          rowsPerPageOptions={[6, 10, 15, 20, 50]}
          noDataComponent={
            <Box p={5} textAlign="center">
              <Typography variant="body1" sx={{ color: "#64748b", fontWeight: 500, fontFamily: "Outfit sans-serif" }}>
                {search
                  ? `No records found matching "${search}"`
                  : activeTab === "pending"
                  ? "No pending image verifications found for your referred users."
                  : activeTab === "active"
                  ? "No active/verified images found in this view."
                  : "No referred users found."}
              </Typography>
            </Box>
          }
          progressComponent={<LoadingTextSpinner />}
        />
      </Paper>
    </Box>
  );
};

export default PromoterImageVerification;
