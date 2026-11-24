import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, ThemeProvider, CssBaseline, CircularProgress } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './App.css';
import './components/common/Loader.css';
import ProfileProvider from './components/usecontext/ProfileProvider';
import { ToastContainer } from 'react-toastify';
import ProtectedRoute from './components/roterProtector/RouterProtector';
import Register from './components/register/Register';
import MembershipPlan from './components/membershipplan/MembershipPlan';
import PromotersDashboard from './components/PromotersDash/PromotersDashboard';
import AdminProfileDialog from './components/Adminprofile/AdminProfile';

import ProfilePage from './components/PromotersDash/ProfilePage/ProfilePage';
import ReferInvitePage from './components/PromotersDash/RefferInvite/RefferInvitePage';

import Pending from './components/PromotersDash/myReferals/Pending';
import Success from './components/PromotersDash/myReferals/Success';
import DashboardContent from './components/PromotersDash/dashboardContent/DashboardContent';
import sidebarData from './components/PromotersDash/sidebar/data';
import Expired from './components/PromotersDash/myReferals/Expired';
import InActive from './components/PromotersDash/myReferals/InActive';
import TeamUsers from './components/PromotersDash/myReferals/TeamUsers';
import AssistancePending from './components/PromotersDash/myReferals/AssistancePending';
import AssistanceSuccess from './components/PromotersDash/myReferals/AssistanceSuccess';
import ActivationPending from './components/activationPending/activationPending';
import ScrollToTop from './components/common/scrollToTop';
import NotFoundPage from './components/notFound/NotFoundPage';
import ErrorBoundary from './components/common/ErrorBoundary';
import CookieConsentBanner from './components/common/CookieConsentBanner';
import royalTheme from './theme/theme';

// Legal and Compliance pages
const PrivacyPolicy = lazy(() => import('./components/legal/PrivacyPolicy'));
const TermsAndConditions = lazy(() => import('./components/legal/TermsAndConditions'));
const CookiePolicy = lazy(() => import('./components/legal/CookiePolicy'));
const RefundPolicy = lazy(() => import('./components/legal/RefundPolicy'));
const DataCollectionDisclosure = lazy(() => import('./components/legal/DataCollectionDisclosure'));

// Create a query client with default options
const queryClient = new QueryClient();

// Lazy loading components
const HeroSlider = lazy(() => import('./components/hero/HeroSlider'));
const Connect = lazy(() => import('./components/howWorks/Connect'));
const Members = lazy(() => import('./components/members/Member'));
const AboutUs = lazy(() => import('./components/Aboutus/AboutUs'));
const ContactUs = lazy(() => import('./components/contactus/ContactUs'));
const AdminDashboard = lazy(() => import('./components/Admin/AdminDashboard'));
const UserTable = lazy(() => import('./components/Admin/UserManagement/UserTable'));
const UserData = lazy(() => import('./components/Admin/userData/UserData'));
const Dashboard = lazy(() => import('./components/Admin/dashboard/Dashboard'));
const RenewalsData = lazy(() => import('./components/Admin/renewalsdata/RenewalsData'));
const ResetPassword = lazy(() => import('./components/Admin/resetpassword/ResetPassword'));
const ImageVerificationData = lazy(() => import('./components/Admin/imageVarify/ImageVerificationdata'));
const PendingData = lazy(() => import('./components/Admin/pendinData/PendingData'));
const SuccessData = lazy(() => import('./components/Admin/successData/SuccessData'));
const PromotersUsersData = lazy(() => import('./components/Admin/PromotersUserData/PromotersUserData'));
const PayToPromoterData = lazy(() => import('./components/Admin/PromoterManagement/PayToPromoterData'));
const PromotersEarningsData = lazy(() => import('./components/Admin/PromotersEarnings/PromotersEarningsData'));
const PromotersData = lazy(() => import('./components/Admin/PromoterData/PromotersData'));
const PromotersUsers = lazy(() => import('./components/Admin/PromotersUsers/PromotersUsers'));
const OnlineTransactionData = lazy(() => import('./components/Admin/Receipts/OnlineTransactiondata'));
const AssistanceOnlineTransactionData = lazy(() => import('./components/Admin/Receipts/AssistanceOnlineTransactionData'));
const ReceiptVoucher = lazy(() => import('./components/Admin/Receipts/ReceiptVocher'));
const UserReports = lazy(() => import('./components/Admin/Reports/UserReports'));
const RenewalsReportsData = lazy(() => import('./components/Admin/Reports/RenewalsReportsData'));
const ReceiptsReportsData = lazy(() => import('./components/Admin/Reports/ReceiptsReportsData'));
const UserNavBar = lazy(() => import('./components/Userprofile/User/UserNavBar'));
const NotificationData = lazy(() => import('./components/Admin/notificationDta/NotificationData'));
const Servieces = lazy(() => import('./components/servieces/Servieces'));
const MyMatches = lazy(() => import('./components/Userprofile/myMatches/MyMatches'));
const MyInterest = lazy(() => import('./components/Userprofile/myIntrest/MyIntrest'));
const ViewAll = lazy(() => import('./components/Userprofile/viewAll/ViewAll'));
const Search = lazy(() => import('./components/Userprofile/search/Search'));
const UserDashboard = lazy(() => import('./components/Userprofile/userdDashboard/UserDashboard'));
const Profile = lazy(() => import('./components/Userprofile/profile/Profile'));
const CompleteProfile = lazy(() => import('./components/Userprofile/CompleteProfile/CompleteProfile'));
const SentInterests = lazy(() => import('./components/PromotersDash/UserInterests/SentInterests'));
const ReceivedInterests = lazy(() => import('./components/PromotersDash/UserInterests/ReceivedInterests'));
const SearchProfiles = lazy(() => import('./components/PromotersDash/SearchProfiles/SearchProfiles'));
const MyReferrals = lazy(() => import('./components/PromotersDash/myReferals/MyReferrals'));
const PromoterImageVerification = lazy(() => import('./components/PromotersDash/ImageVerification/PromoterImageVerification'));
const PromoterLogin = lazy(() => import('./components/PromotersDash/Auth/PromoterLogin'));
const PromoterRegister = lazy(() => import('./components/PromotersDash/Auth/PromoterRegister'));

export const LoadingComponent = () => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "50vh",
        width: "100%",
        py: 8,
      }}
    >
      <CircularProgress
        size={44}
        thickness={3.6}
        sx={{
          color: "#0F172A",
        }}
      />
    </Box>
  );
};

const App = () => {
  return (
    <ThemeProvider theme={royalTheme}>
      <CssBaseline />
      <ProfileProvider>
        <QueryClientProvider client={queryClient}>
          <Suspense fallback={<LoadingComponent />}>
            <Router>
              <ScrollToTop />
              <div className="app-wrapper" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <ErrorBoundary>
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<><HeroSlider /><Connect /><Members /></>} />
                    <Route path="/service" element={<Servieces />} />
                    <Route path="/about" element={<AboutUs />} />
                    <Route path="/contact" element={<ContactUs />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/membership" element={<MembershipPlan />} />
                    <Route path="/promoter/login" element={<PromoterLogin />} />
                    <Route path="/promoter-login" element={<PromoterLogin />} />
                    <Route path="/promoter/register" element={<PromoterRegister />} />
                    <Route path="/promoter-register" element={<PromoterRegister />} />

                    {/* Legal & Compliance Routes */}
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/terms" element={<TermsAndConditions />} />
                    <Route path="/cookie-policy" element={<CookiePolicy />} />
                    <Route path="/refund-policy" element={<RefundPolicy />} />
                    <Route path="/data-disclosure" element={<DataCollectionDisclosure />} />

                    {/* Admin Routes */}
                    <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
                      <Route path="/admin" element={<AdminDashboard />}>
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="user-table" element={<UserTable />} />
                        <Route path="userData" element={<UserData />} />
                        <Route path="renewals" element={<RenewalsData />} />
                        <Route path="resetpass" element={<ResetPassword />} />
                        <Route path="pendingdata" element={<PendingData />} />
                        <Route path="successdata" element={<SuccessData />} />
                        <Route path="promotersdata" element={<PromotersUsersData />} />
                        <Route path="paytopromoters" element={<PayToPromoterData />} />
                        <Route path="promoterearn" element={<PromotersEarningsData />} />
                        <Route path="imageverify" element={<ImageVerificationData />} />
                        <Route path="promoters" element={<PromotersData />} />
                        <Route path="promotersusers" element={<PromotersUsers />} />
                        <Route path="onlinetransaction" element={<OnlineTransactionData />} />
                        <Route path="assistance" element={<AssistanceOnlineTransactionData />} />
                        <Route path="receiptsvocher" element={<ReceiptVoucher />} />
                        <Route path="userreports" element={<UserReports />} />
                        <Route path="renewalreports" element={<RenewalsReportsData />} />
                        <Route path="receiptsreports" element={<ReceiptsReportsData />} />
                        <Route path="notification" element={<NotificationData />} />
                      </Route>
                    </Route>

                    {/* Promoter Routes */}
                    <Route path="/promoter/*" element={<Navigate to="/PromotAdmin" replace />} />
                    <Route path="/promoter" element={<Navigate to="/PromotAdmin" replace />} />
                    <Route element={<ProtectedRoute allowedRoles={["promoter"]} />}>
                      <Route path="/PromotAdmin" element={<PromotersDashboard />}>
                        <Route index element={<DashboardContent sidebarData={sidebarData} />} />
                        <Route path="admin-profile" element={<AdminProfileDialog open={true} onClose={() => {}} />} />
                        <Route path="profilepage" element={<ProfilePage />} />
                        <Route path="refer" element={<ReferInvitePage />} />
                        <Route path="my-referrals" element={<MyReferrals />} />
                        <Route path="pending" element={<Pending />} />
                        <Route path="success" element={<Success />} />
                        <Route path="expired" element={<Expired />} />
                        <Route path="inactive" element={<InActive />} />
                        <Route path="team-users" element={<TeamUsers />} />
                        <Route path="assistance-pending" element={<AssistancePending />} />
                        <Route path="assistance-success" element={<AssistanceSuccess />} />
                        <Route path="interests/sent" element={<SentInterests />} />
                        <Route path="interests/received" element={<ReceivedInterests />} />
                        <Route path="search-profiles" element={<SearchProfiles />} />
                        <Route path="image-verification" element={<PromoterImageVerification />} />
                      </Route>
                    </Route>

                    {/* User Routes */}
                    <Route element={<ProtectedRoute allowedRoles={["FreeUser", "PremiumUser", "SilverUser"]} />}>
                      <Route path="/user/complete-profile" element={<CompleteProfile />} />
                      <Route path="/user" element={<UserNavBar />}>
                        <Route index element={<Navigate to="userDashboard" replace />} />
                        <Route path="userDashboard" element={<UserDashboard />} />
                        <Route path="userdashboard" element={<Navigate to="userDashboard" replace />} />
                        <Route path="dashboard" element={<Navigate to="userDashboard" replace />} />
                        <Route path="profile" element={<Profile />} />
                        <Route path="MyMatches" element={<MyMatches />} />
                        <Route path="mymatches" element={<Navigate to="MyMatches" replace />} />
                        <Route path="myintrest" element={<MyInterest />} />
                        <Route path="myinterest" element={<Navigate to="myintrest" replace />} />
                        <Route path="viewAll" element={<ViewAll />} />
                        <Route path="viewall" element={<Navigate to="viewAll" replace />} />
                        <Route path="search" element={<Search />} />
                      </Route>
                    </Route>

                    {/* 404 Route */}
                    <Route path="activation-pending" element={<ActivationPending />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </ErrorBoundary>
              </div>
              <CookieConsentBanner />
            </Router>

            <ToastContainer position="top-right" autoClose={5000} />
          </Suspense>
        </QueryClientProvider>
      </ProfileProvider>
    </ThemeProvider>
  );
};

export default App;
