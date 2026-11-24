import { useEffect, useState } from "react";
import {
  Box,
  Divider,
  Stack,
  Typography,
  Pagination,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { toast } from "react-toastify";
import TokenService from "../../token/tokenService";
import HomeUserTable from "../../userupgrade/HomeUserTable";
import { LoadingComponent, } from "../../../App";
import { isSilverOrPremiumUser, LoadingTextSpinner } from "../../../utils/common";
import ProfileDialog from "../ProfileDialog/ProfileDialog";
import UserCard from "../../common/UserCard";
import { useGetConnections, useGetMemberDetails } from "../../api/User";

const UserDashboard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const itemsPerPage = 8; 
 const theme = useTheme();
const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const registerNo = TokenService.getRegistrationNo();

  const {
    data: userProfile,
    isLoading: isLoadingProfile,
    isError: isProfileError,
    error: profileError,
  } = useGetMemberDetails(registerNo);

  const {
    mutate: fetchConnections,
    data: connectionsData = {},
    isPending: isLoadingConnections,
    isError: isConnectionsError,
    error: connectionsError,
  } = useGetConnections();

useEffect(() => {
  fetchConnections({ 
    page: currentPage, 
    pageSize: itemsPerPage, 
    userId: registerNo 
  });
}, [currentPage, registerNo, fetchConnections]);

// Check for pending payment verification when component mounts
useEffect(() => {
  const clearPaymentState = () => {
    // Clear any existing processing flags
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('processing_')) {
        localStorage.removeItem(key);
      }
    });
  };
  
  const checkPendingPayment = () => {
    // Check if user returned from payment by looking at URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const orderIdFromUrl = urlParams.get('order_id');
    const paymentStatus = urlParams.get('payment_status');
    
    // Handle case where user returned from Cashfree with literal placeholders
    // This happens when Cashfree doesn't properly replace the placeholders
    if (orderIdFromUrl && (orderIdFromUrl.includes('{order_id}') || orderIdFromUrl === '{order_id}' || 
        orderIdFromUrl.includes('KTAqpwFjFCDenUW6j_Yo1xEJv9-Y5Ng_42YTJk9YQt4N0EW7yy3nOgEpayment'))) {
      console.log('User returned from Cashfree with malformed order_id, clearing URL and redirecting to clean dashboard');
      // Clear URL parameters and redirect to clean dashboard
      window.history.replaceState({}, document.title, '/user/userDashboard');
      toast.info('Payment processing. If not redirected automatically, please refresh the page.');
      return;
    }
    
    // Handle case where user returned from Cashfree with literal placeholders in payment_status
    if (paymentStatus && (paymentStatus.includes('{payment_status}') || paymentStatus === '{payment_status}')) {
      console.log('User returned from Cashfree with malformed payment_status, treating as successful');
      // Clear URL parameters and process as successful payment
      window.history.replaceState({}, document.title, `/user/userDashboard?order_id=${orderIdFromUrl}&payment_status=SUCCESS`);
      // Reload to trigger the proper payment verification flow
      window.location.reload();
      return;
    }
    
    // Handle case where user returned from payment-redirect endpoint
    if (window.location.pathname.includes('/payment-redirect') && orderIdFromUrl) {
      console.log('User returned from payment-redirect endpoint');
      // The backend has already processed the payment, just verify it
      processPaymentVerification(orderIdFromUrl, 'SUCCESS');
      return;
    }
    
    // Handle case where user returned from Cashfree without completing payment
    if (orderIdFromUrl && !paymentStatus) {
      console.log('User returned from Cashfree without completing payment');
      toast.info('Payment was not completed. If you wish to proceed with payment, please try again.');
      
      // Clear URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Clear pending order data
      localStorage.removeItem('pendingOrderId');
      const orderTimestampKey = `orderTimestamp_${orderIdFromUrl}`;
      if (localStorage.getItem(orderTimestampKey)) {
        localStorage.removeItem(orderTimestampKey);
      }
      
      return;
    }
    
    // Only verify payment if:
    // 1. There's an order_id in URL with payment_status=success (indicating legitimate return)
    // 2. OR there's a pendingOrderId in localStorage with recent timestamp
    const pendingOrderId = localStorage.getItem('pendingOrderId');
    const orderTimestamp = localStorage.getItem(`orderTimestamp_${pendingOrderId}`);
    
    // Check if pendingOrderId is recent (within last 30 minutes)
    const isRecentOrder = orderTimestamp && 
      (Date.now() - parseInt(orderTimestamp)) < (30 * 60 * 1000);
    
    // Only proceed with verification if payment was actually successful
    if ((orderIdFromUrl && (paymentStatus === 'SUCCESS' || paymentStatus === 'success')) || (pendingOrderId && isRecentOrder)) {
      const orderId = orderIdFromUrl || pendingOrderId;
      processPaymentVerification(orderId, paymentStatus);
    } else {
      // Handle case where payment was attempted but failed
      if (orderIdFromUrl && paymentStatus && paymentStatus !== 'SUCCESS' && paymentStatus !== 'success') {
        console.log('User returned with failed payment status:', paymentStatus);
        toast.info('Payment was not completed. If you wish to proceed with payment, please try again.');
        
        // Report as incomplete payment
        reportIncompletePayment.mutate({
          orderId: orderIdFromUrl,
          description: `User returned with payment status: ${paymentStatus}`
        });
        
        // Clear URL parameters
        window.history.replaceState({}, document.title, window.location.pathname);
        return;
      }
      
      // Clear old/stale data if no valid pending payment found
      if (pendingOrderId && !isRecentOrder) {
        console.log('Clearing stale order data:', pendingOrderId);
        localStorage.removeItem('pendingOrderId');
        localStorage.removeItem(`orderTimestamp_${pendingOrderId}`);
      }
      
      // Clear URL parameters if they exist but no payment_status
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has('order_id') && !urlParams.has('payment_status')) {
        console.log('Clearing URL parameters without payment status');
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  };
  
  // Function to process payment verification
  const processPaymentVerification = (orderId, paymentStatus) => {
    // Validate order ID
    if (!orderId || orderId.includes('{') || orderId.includes('}')) {
      console.log('Invalid order ID, redirecting to clean dashboard');
      window.history.replaceState({}, document.title, '/user/userDashboard');
      toast.info('Payment processing. If not redirected automatically, please refresh the page.');
      return;
    }
    
    // Check if we're already processing this order to prevent infinite calls
    const processingKey = `processing_${orderId}`;
    if (localStorage.getItem(processingKey)) {
      console.log('Payment verification already in progress for:', orderId);
      return;
    }
    
    console.log('Found legitimate pending payment order:', orderId);
    
    // Mark as processing
    localStorage.setItem(processingKey, 'true');
    
    // Verify the payment
    verifyPayment.mutate(
      { orderId },
      {
        onSuccess: (response) => {
          console.log('Payment verification response:', response);
          
          // Clear processing flag
          localStorage.removeItem(processingKey);
          
          if (response.success) {
            // Clear pending order from localStorage
            localStorage.removeItem('pendingOrderId');
            localStorage.removeItem(`orderTimestamp_${orderId}`);
            // Clear URL parameters
            window.history.replaceState({}, document.title, window.location.pathname);
            // Refresh user profile to get updated subscription status
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          } else if (response.orderStatus === 'PAID' && response.paymentStatus === 'SUCCESS') {
            // Already processed successfully
            toast.info("Payment already processed successfully.");
            
            // Clear pending order from localStorage
            localStorage.removeItem('pendingOrderId');
            localStorage.removeItem(`orderTimestamp_${orderId}`);
            // Clear URL parameters
            window.history.replaceState({}, document.title, window.location.pathname);
            // Refresh user profile to get updated subscription status
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          } else if (response.orderStatus === 'PAID' && response.paymentStatus === 'NOT_ATTEMPTED') {
            // Special case: Order is PAID but payment status is NOT_ATTEMPTED
            // Report as incomplete payment and retry
            toast.info("Payment verification in progress...");
            
            // Report as incomplete payment
            reportIncompletePayment.mutate({
              orderId,
              description: "Order marked as PAID but payment status is NOT_ATTEMPTED"
            });
            
            // Retry verification after 3 seconds
            setTimeout(() => {
              retryPayment.mutate({ orderId });
            }, 3000);
          } else if (response.orderStatus === 'PAID' && response.paymentStatus === 'PENDING') {
            // Payment is processing, show message and retry after delay
            toast.info(response.message || "Payment is being processed. Checking again in a moment...");
            
            // Report as incomplete payment
            reportIncompletePayment.mutate({
              orderId,
              description: "Order marked as PAID but payment status is PENDING"
            });
            
            // Retry verification after 5 seconds
            setTimeout(() => {
              retryPayment.mutate({ orderId });
            }, 5000);
          } else if (response.orderStatus === 'PAID') {
            // Order is PAID but payment status is not SUCCESS - this might be a timing issue
            toast.info(response.message || "Payment verification in progress...");
            
            // Report as incomplete payment
            reportIncompletePayment.mutate({
              orderId,
              description: `Order marked as PAID but payment status is ${response.paymentStatus || 'unknown'}`
            });
            
            // Retry verification after 3 seconds
            setTimeout(() => {
              retryPayment.mutate({ orderId });
            }, 3000);
          } else {
            // Payment not completed or failed
            toast.info(response.message || 'Payment was not completed. If you wish to proceed with payment, please try again.');
            
            // Report as incomplete payment
            reportIncompletePayment.mutate({
              orderId,
              description: `Payment verification failed: ${response.message || 'Unknown error'}`
            });
            
            // Clear pending order even on error to avoid infinite retries
            localStorage.removeItem('pendingOrderId');
            localStorage.removeItem(`orderTimestamp_${orderId}`);
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        },
        onError: (error) => {
          console.error('Payment verification failed:', error);
          
          // Clear processing flag
          localStorage.removeItem(processingKey);
          
          // Report as incomplete payment
          if (orderId && !orderId.includes('{') && !orderId.includes('}')) {
            reportIncompletePayment.mutate({
              orderId,
              description: `Payment verification failed: ${error?.response?.data?.error || error.message}`
            });
          }
          
          // Show error message
          toast.error('Payment verification failed. Please contact support if the issue persists.');
          
          // Clear pending order even on error to avoid infinite retries
          localStorage.removeItem('pendingOrderId');
          localStorage.removeItem(`orderTimestamp_${orderId}`);
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
    );
  };
  
  // Only clear stale processing state, don't verify payments
  clearPaymentState();
}, []); // Empty dependency array to run only once


  useEffect(() => {
    if (isProfileError) toast.error(profileError.message);
    if (isConnectionsError) toast.error(connectionsError.message);
  }, [isProfileError, profileError, isConnectionsError, connectionsError]);

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
        backgroundColor: "#700F2B",
        borderRadius: "6px",
        border: "1px solid #881337",
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
              <span style={{ color: '#fbbf24' }}>{userProfile?.full_name || userProfile?.fullname || `${userProfile?.first_name || "User"} ${userProfile?.last_name || ""}`.trim()}</span>
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography sx={{
                color: "#881337",
                fontSize: "0.78rem",
                fontWeight: 700,
                backgroundColor: "#fbbf24",
                padding: "3px 10px",
                borderRadius: "4px",
                letterSpacing: "0.5px"
              }}>
                ID: {userProfile?.registration_no}
              </Typography>
              <Typography sx={{ color: "#fecdd3", fontSize: "0.85rem" }}>
                {userProfile?.city ? `${userProfile.city}, ` : ""}{userProfile?.state || ""}
              </Typography>
            </Box>
          </Box>

          {/* Quick Stats Card */}
          <Box sx={{
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "8px",
            padding: "14px 20px",
            display: "flex",
            alignItems: "center",
            gap: 3,
            width: { xs: "100%", sm: "auto" }
          }}>
            <Box sx={{ textAlign: "center", px: 1 }}>
              <Typography sx={{ color: "#fecdd3", fontSize: "0.72rem", textTransform: "uppercase", fontWeight: 700, mb: 0.2 }}>Interests Sent</Typography>
              <Typography sx={{ color: "#ffffff", fontSize: "1.3rem", fontWeight: 800 }}>{connectionsData?.totalRecords || 0}</Typography>
            </Box>
            <Divider orientation="vertical" flexItem sx={{ borderColor: "rgba(255,255,255,0.2)" }} />
            <Box sx={{ textAlign: "center", px: 1 }}>
              <Typography sx={{ color: "#fecdd3", fontSize: "0.72rem", textTransform: "uppercase", fontWeight: 700, mb: 0.2 }}>Membership Tier</Typography>
              <Typography sx={{ color: "#fbbf24", fontSize: "1.1rem", fontWeight: 800 }}>
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
    sx={{fontSize:{ xs: "22px" },color:'#34495E',textAlign:{xs:'left',md:'left'} }} 
  >
    Interested Profiles
  </Typography>
          </Box>
<Box
  sx={{
    display: "grid",
    justifySelf: "center",
    alignSelf: "center",
    mr: 2,
    gridTemplateColumns: {
      xs: "1fr",
      sm: "repeat(2, 1fr)",
      md: "repeat(3, 1fr)",
      lg: "repeat(4, 1fr)",
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