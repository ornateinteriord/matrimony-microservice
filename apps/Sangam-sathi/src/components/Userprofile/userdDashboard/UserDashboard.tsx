import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Divider,
  Stack,
  Typography,
  Pagination,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { toast } from "react-toastify";
import TokenService from "../../token/tokenService";
import HomeUserTable from "../../userupgrade/HomeUserTable";
import { useGetConnections, useGetMemberDetails } from "../../api/User";
import { LoadingComponent, } from "../../../App";
import { isSilverOrPremiumUser, LoadingTextSpinner } from "../../../utils/common";
import ProfileDialog from "../ProfileDialog/ProfileDialog";
import UserCard from "../../common/UserCard";

const UserDashboard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const itemsPerPage = 8;
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const registerNo = TokenService.getRegistrationNo();
  const navigate = useNavigate();

  const {
    data: userProfile,
    isLoading: isLoadingProfile,
    isError: isProfileError,
    error: profileError,
  } = useGetMemberDetails(registerNo);

  const {
    mutate: fetchConnections,
    data: connectionsDataRaw = {},
    isPending: isLoadingConnections,
    isError: isConnectionsError,
    error: connectionsError,
  } = useGetConnections();
  const connectionsData: any = connectionsDataRaw || {};

  useEffect(() => {
    fetchConnections({
      page: currentPage,
      pageSize: itemsPerPage,
      userId: registerNo
    });
  }, [currentPage, registerNo, fetchConnections]);


  useEffect(() => {
    if (isProfileError) toast.error(profileError.message);
    if (isConnectionsError) toast.error(connectionsError.message);
  }, [isProfileError, profileError, isConnectionsError, connectionsError]);

  useEffect(() => {
    if (userProfile && userProfile.otherInfo === 'Pending') {
      navigate('/user/complete-profile');
    }
  }, [userProfile, navigate]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleOpenDialog = (user) => {
    setSelectedUser(user);
    setOpenDialog(true);
  };

  if (isLoadingProfile) return <LoadingComponent />;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        padding: {
          xs: "10px 9px",
          sm: "10px 16px",
          md: "10px ",
        },
        mt: "0",
      }}
    >
      <Box sx={{
        width: "100%",
        mb: 3,
        mt: 1,
        backgroundColor: "#0F172A",
        borderRadius: "6px",
        border: "1px solid #1e293b",
        padding: { xs: "16px 20px", sm: "24px 28px" },
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        position: "relative",
      }}>
        <Box sx={{
          display: "flex", flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "flex-start", md: "center" },
          justifyContent: "space-between",
          gap: 2.5
        }}>
          {/* Welcome Text */}
          <Box sx={{ flex: 1 }}>
            <Typography
              variant={isSmallScreen ? "h5" : "h4"}
              fontWeight="700"
              color="#ffffff"
              sx={{
                fontSize: { xs: "1.4rem", sm: "1.8rem" },
                letterSpacing: "-0.3px",
                mb: 1
              }}
            >
              Welcome back,{" "}
              <span style={{ color: '#D4AF37' }}>{userProfile?.full_name || userProfile?.fullname || `${userProfile?.first_name || "User"} ${userProfile?.last_name || ""}`.trim()}</span>
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography sx={{
                color: "#0f172a",
                fontSize: "0.78rem",
                fontWeight: 700,
                backgroundColor: "#D4AF37",
                padding: "3px 10px",
                borderRadius: "4px",
                letterSpacing: "0.5px"
              }}>
                ID: {userProfile?.registration_no}
              </Typography>
              <Typography sx={{ color: "#94a3b8", fontSize: "0.85rem" }}>
                {userProfile?.city ? `${userProfile.city}, ` : ""}{userProfile?.state || ""}
              </Typography>
            </Box>
          </Box>

          {/* Quick Stats Card */}
          <Box sx={{
            backgroundColor: "rgba(255, 255, 255, 0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "8px",
            padding: "14px 20px",
            display: "flex",
            alignItems: "center",
            gap: 3,
            width: { xs: "100%", sm: "auto" }
          }}>
            <Box sx={{ textAlign: "center", px: 1 }}>
              <Typography sx={{ color: "#94a3b8", fontSize: "0.72rem", textTransform: "uppercase", fontWeight: 700, mb: 0.2 }}>Interests Sent</Typography>
              <Typography sx={{ color: "#ffffff", fontSize: "1.3rem", fontWeight: 800 }}>{connectionsData?.totalRecords || 0}</Typography>
            </Box>
            <Divider orientation="vertical" flexItem sx={{ borderColor: "rgba(255,255,255,0.1)" }} />
            <Box sx={{ textAlign: "center", px: 1 }}>
              <Typography sx={{ color: "#94a3b8", fontSize: "0.72rem", textTransform: "uppercase", fontWeight: 700, mb: 0.2 }}>Membership Tier</Typography>
              <Typography sx={{ color: "#D4AF37", fontSize: "1.1rem", fontWeight: 800 }}>
                {isSilverOrPremiumUser(userProfile?.type_of_user) ? 'Premium' : 'Free Member'}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <Stack spacing={3}>
        {!isSilverOrPremiumUser(userProfile?.type_of_user) && (
          <Box sx={{
            width: "100%",
            overflowX: isSmallScreen ? "auto" : "visible",
          }}>
            <HomeUserTable />
          </Box>
        )}

        <Box>
          <Box
            gap={isSmallScreen ? 1 : 0}
            mb={2}
          >
            <Typography
              variant="h5"
              sx={{ fontSize: { xs: "22px" }, color: '#000', textAlign: { xs: 'left', md: 'left' } }}
            >
              Interested Profiles
            </Typography>
          </Box>
          <Box
            sx={{
              display: "grid",
              width: "100%",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
              },
              gap: { xs: 2, sm: 3 },
              minHeight: 300,
            }}
          >
            {isLoadingConnections ? (
              <Box sx={{ gridColumn: "1 / -1", textAlign: "center" }}>
                <LoadingTextSpinner />
              </Box>
            ) : connectionsData?.connections?.length > 0 ? (
              connectionsData.connections.map((connection) => (
                <UserCard
                  key={connection._id}
                  profile={connection.profile}
                  connection={connection}
                  onViewMore={handleOpenDialog}
                />
              ))
            ) : (
              <Box sx={{ gridColumn: "1 / -1" }}>
                <Typography
                  sx={{
                    color: "#212121",
                    fontSize: "17px",
                    fontWeight: "bold",
                    textAlign: "center",
                    width: "100%",
                  }}
                >
                  No connections yet. Send or accept interest requests to see connections here.
                </Typography>
              </Box>
            )}
          </Box>

          <Box display="flex" justifyContent="end" mt={3}>
            <Pagination
              count={Math.ceil((connectionsData?.totalRecords || 0) / itemsPerPage)}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              shape="rounded"
              size={isSmallScreen ? "small" : "medium"}
              sx={{
                visibility: connectionsData?.totalRecords > 0 ? 'visible' : 'hidden'
              }}
            />
          </Box>
        </Box>
      </Stack>

      {selectedUser && (
        <ProfileDialog
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
          selectedUser={selectedUser}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          isLoading={false}
        />
      )}
    </Box>
  );
};




export default UserDashboard;