import { useEffect, useState } from "react";
import PaginationDataTable from "../../common/PaginationDataTable";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
} from "@mui/material";
import { FaSearch } from "react-icons/fa";
import {
  customStyles,
  getImageVerificationColumns,
} from "../../../utils/DataTableColumnsProvider";
import { useGetPromoterImageVerification, useUpgradePromoterUserStatus } from "../../api/Promoter";
import { LoadingTextSpinner } from "../../../utils/common";
import { toast } from "react-toastify";
import TokenService from '../../token/tokenService';


const PromoterImageVerification = () => {
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 50 });
  
  const decodedToken = TokenService.decodeToken();
  const promoterId = decodedToken?.promoter_id || decodedToken?.username;

  const { data, isPending: isLoading, isError, error, mutate: fetchUsers } = useGetPromoterImageVerification();

  const users = data?.content || [];
  const [localUsers, setLocalUsers] = useState(users);
  const [search, setSearch] = useState("");
  const upgradeUserMutation = useUpgradePromoterUserStatus();

  useEffect(() => {
    if (promoterId) {
      fetchUsers({ promoter_id: promoterId, page: paginationModel.page, pageSize: paginationModel.pageSize });
    }
  }, [paginationModel.page, paginationModel.pageSize, promoterId]);

  useEffect(() => {
    if (users.length > 0) {
      setLocalUsers(users);
    }
  }, [users]);

  useEffect(() => {
    if (isError) {
      toast.error(error.message);
    }
  }, [isError, error]);

  const handleStatusUpdate = async (regno, currentStatus) => {
    try {
      const newStatus = currentStatus === "active" ? "pending" : "active";
      await upgradeUserMutation.mutateAsync(
        {
          regno,
          image_verification: newStatus,
        },
        {
          onSuccess: () => {
            setLocalUsers((prevUsers) =>
              prevUsers.map((user) =>
                user.registration_no === regno
                  ? { ...user, image_verification: newStatus }
                  : user
              )
            );
            fetchUsers({ promoter_id: promoterId, page: paginationModel.page, pageSize: paginationModel.pageSize });
          },
          onError: (error) => {
            console.error(error.message);
          },
        }
      );
    } catch (err) {
      console.error(err.message);
    }
  };

  // Handle Search
  const filteredRows = localUsers.filter((data) => {
    const isAdmin = data?.user_role?.toLowerCase() === "admin";
    const matchesSearch =
      search === "" ||
      data.registration_no?.toString().includes(search.toString()) ||
      data.first_name?.toLowerCase().includes(search.toLowerCase()) ||
      data.username?.toLowerCase().includes(search.toLowerCase()) ||
      data.gender?.toLowerCase().includes(search.toLowerCase()) ||
      data.user_role?.toLowerCase().includes(search.toLowerCase()) ||
      data.image_verification?.toLowerCase().includes(search.toLowerCase());
    return matchesSearch && !isAdmin;
  });

  return (
    <Box p={{ xs: 2, sm: 4, md: 6 }} mt={{ xs: 2, md: 6 }}>
      {/* Header & Controls */}
      <Typography
        variant="h4"
        fontWeight={600}
        color="#34495e"
        fontFamily={"Outfit sans-serif"}
        sx={{ textAlign: { xs: "center", sm: "left" }, mb: "10px" }}
      >
        My Users - Image Verification
      </Typography>

      <Box display="flex" alignItems="center" gap={2} mb={3}>
        {/* Search Field */}
        <TextField
          placeholder="Search record"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FaSearch />
              </InputAdornment>
            ),
          }}
          sx={{ width: { xs: "100%", sm: "auto", md: "auto" } }}
          variant="outlined"
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
        noDataComponent={<Typography padding={3} textAlign="center">No pending images found for your users.</Typography>}
        progressComponent={<LoadingTextSpinner />}
      />
    </Box>
  );
};

export default PromoterImageVerification;
