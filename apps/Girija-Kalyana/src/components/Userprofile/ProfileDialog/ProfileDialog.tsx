import React, { useEffect, useState } from "react";
import {
  Box,
  Dialog,
  DialogContent,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { get } from "../../api/authHooks";
import TokenService from "../../token/tokenService";
import MembershipDialog from "../MembershipDailog/MembershipDailog";
import { membershipOptions } from "../MembershipDailog/MemberShipPlans";
import { useExpressInterest } from "../../api/User";
import ProfileView from "../profile/ProfileView";

interface ProfileDialogProps {
  openDialog: boolean;
  setOpenDialog: (open: boolean) => void;
  selectedUser: any;
  currentTab?: number;
  setCurrentTab?: (tab: number) => void;
  isLoading?: boolean;
  isRequestTab?: boolean;
  renderDialogContent?: any;
}

const ProfileDialog: React.FC<ProfileDialogProps> = ({
  openDialog,
  setOpenDialog,
  selectedUser,
  isLoading = false,
  isRequestTab = false,
}) => {
  const [localInterestStatus, setLocalInterestStatus] = useState("none");
  const [isStatusLoading, setIsStatusLoading] = useState(false);
  const [membershipDialogOpen, setMembershipDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  const loggedInUserRole = TokenService.getRole();
  const loggedInUserId = TokenService.getRegistrationNo();
  const expressInterestMutation = useExpressInterest();

  const fetchStatus = async () => {
    if (!loggedInUserRole || !loggedInUserId || !selectedUser?.registration_no) {
      setLocalInterestStatus("none");
      setIsStatusLoading(false);
      return;
    }
    setIsStatusLoading(true);
    try {
      const response = await get(
        `/api/user/interest/status/${loggedInUserId}/${selectedUser.registration_no}`
      );
      const payload = response.data;
      const status = payload?.status ?? "none";
      setLocalInterestStatus(status);
    } catch (error) {
      console.error("Error fetching interest status:", error);
    } finally {
      setIsStatusLoading(false);
    }
  };

  useEffect(() => {
    if (openDialog && loggedInUserRole && loggedInUserId && selectedUser?.registration_no) {
      fetchStatus();
    }
  }, [openDialog, loggedInUserRole, loggedInUserId, selectedUser?.registration_no]);

  const handleSendInterest = () => {
    expressInterestMutation.mutate(
      {
        sender: loggedInUserId,
        recipient: selectedUser.registration_no,
        message: "Expressed interest in you",
      },
      {
        onSuccess: () => {
          setLocalInterestStatus("pending");
          fetchStatus();
        },
        onError: (error) => {
          console.error("Error expressing interest:", error);
          fetchStatus();
        },
      }
    );
  };

  const handleButtonClick = () => {
    if (loggedInUserRole === "FreeUser") {
      setSelectedPlan(membershipOptions[1]);
      setMembershipDialogOpen(true);
    } else {
      handleSendInterest();
    }
  };

  const handleConfirmPayment = () => {
    setMembershipDialogOpen(false);
  };

  return (
    <>
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        fullWidth
        maxWidth="lg"
        sx={{
          "& .MuiDialog-paper": {
            margin: { xs: "8px", sm: "20px" },
            width: { xs: "calc(100% - 16px)", sm: "calc(100% - 40px)" },
            maxWidth: "1100px",
            maxHeight: { xs: "calc(100% - 16px)", sm: "calc(100% - 40px)" },
            borderRadius: "6px",
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          },
        }}
      >
        <DialogContent
          sx={{
            p: { xs: 1.5, sm: 3 },
            background: "#f8fafc",
            overflowY: "auto",
            position: "relative",
          }}
        >
          {/* Close button */}
          <IconButton
            onClick={() => setOpenDialog(false)}
            aria-label="Close Profile"
            sx={{
              position: "absolute",
              top: 14,
              right: 14,
              zIndex: 20,
              background: "rgba(255,255,255,0.9)",
              boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
              "&:hover": { background: "#ffffff" },
            }}
          >
            <CloseIcon sx={{ fontSize: 20, color: "#700F2B" }} />
          </IconButton>

          <ProfileView
            userProfile={selectedUser}
            isOwner={loggedInUserId === selectedUser?.registration_no}
            onSendInterest={!isRequestTab && loggedInUserId !== selectedUser?.registration_no ? handleButtonClick : undefined}
            interestStatus={localInterestStatus}
            isInterestLoading={isLoading || isStatusLoading || expressInterestMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      <MembershipDialog
        open={membershipDialogOpen}
        onClose={() => setMembershipDialogOpen(false)}
        selectedPlan={selectedPlan}
        onConfirm={handleConfirmPayment}
      />
    </>
  );
};

export default ProfileDialog;
