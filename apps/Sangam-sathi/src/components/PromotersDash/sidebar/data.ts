import { SidebarConfig, NavItemConfig } from '../../../types/navigation';

export const promoterSidebarConfig: SidebarConfig = {
  brandTitle: "Sangam Sathi",
  homePath: "/PromotAdmin",
  items: [
    {
      id: "promoter-dashboard",
      title: "Dashboard",
      path: "/PromotAdmin",
      icon: "Dashboard",
    },
    {
      id: "promoter-profile",
      title: "My Profile",
      path: "/PromotAdmin/profilepage",
      icon: "Person",
    },
    {
      id: "promoter-refer",
      title: "Refer / Invite",
      path: "/PromotAdmin/refer",
      icon: "Share",
    },
    {
      id: "promoter-referrals",
      title: "My Referrals",
      path: "/PromotAdmin/my-referrals",
      icon: "Groups",
    },
    {
      id: "promoter-assistance",
      title: "Assistance Services",
      path: "/PromotAdmin/assistance-pending",
      icon: "SupportAgent",
      children: [
        { id: "assistance-pending", title: "Pending", path: "/PromotAdmin/assistance-pending", icon: "Pending" },
        { id: "assistance-success", title: "Success", path: "/PromotAdmin/assistance-success", icon: "CheckCircle" },
      ],
    },
    {
      id: "promoter-earnings",
      title: "My Earnings",
      path: "",
      icon: "AttachMoney",
      children: [
        { id: "earnings-reg", title: "Registration Earnings", path: "", icon: "HowToReg" },
        { id: "earnings-assist", title: "Assistance Earnings", path: "", icon: "SupportAgent" },
        { id: "earnings-renewal", title: "Renewal Earnings", path: "", icon: "Autorenew" },
      ],
    },
    {
      id: "promoter-interests",
      title: "User Interests",
      path: "/PromotAdmin/interests/sent",
      icon: "Favorite",
      children: [
        { id: "interests-sent", title: "Sent", path: "/PromotAdmin/interests/sent", icon: "Send" },
        { id: "interests-received", title: "Received", path: "/PromotAdmin/interests/received", icon: "Inbox" },
      ],
    },
    {
      id: "promoter-search",
      title: "Search Profile",
      path: "/PromotAdmin/search-profiles",
      icon: "Search",
    },
    {
      id: "promoter-verify",
      title: "Image Verification",
      path: "/PromotAdmin/image-verification",
      icon: "ImageSearch",
    },
    {
      id: "promoter-boost",
      title: "Boosted Profiles",
      path: "",
      icon: "TrendingUp",
    },
    {
      id: "promoter-logout",
      title: "Logout",
      path: "",
      icon: "Logout",
    },
  ],
};

const sidebarData = {
  title: "Sangam Sathi",
  menuItems: [
    {
      text: "Dashboard",
      icon: "Dashboard",
      path: "/PromotAdmin"
    },
    {
      text: "My Profile",
      icon: "Person",
      path: "/PromotAdmin/profilepage"
    },
    {
      text: "Refer / Invite",
      icon: "Share",
      path: "/PromotAdmin/refer"
    },
    {
      text: "My Referrals",
      icon: "Groups",
      path: "/PromotAdmin/my-referrals"
    },
    {
      text: "Assistance Services",
      icon: "SupportAgent",
      subItems: [
        { text: "Pending", path: "/PromotAdmin/assistance-pending" },
        { text: "Success", path: "/PromotAdmin/assistance-success" }
      ],
    },
    {
      text: "My Earnings",
      icon: "AttachMoney",
      subItems: [
        { text: "Registration Earnings" },
        { text: "Assistence Earnings" },
        { text: "Renewal Earnings" },
      ],
    },
    {
      text: "User Interests",
      icon: "Favorite",
      subItems: [
        { text: "Sent", path: "/PromotAdmin/interests/sent" },
        { text: "Received", path: "/PromotAdmin/interests/received" }
      ],
    },
    {
      text: "Search Profile",
      icon: "Search",
      path: "/PromotAdmin/search-profiles"
    },
    {
      text: "Image Verification",
      icon: "ImageSearch",
      path: "/PromotAdmin/image-verification"
    },
    {
      text: "Boosted Profiles",
      icon: "TrendingUp",
    },
    {
      text: "Logout",
      icon: "Logout",
    },
  ],
  users: [
    {
      title: "Registration Earnings",
      value: "236",
      color: "#4caf50",
      icon: "HowToReg",
    },
    {
      title: "Assistance Earnings",
      value: "9",
      color: "#2196f3",
      icon: "SupportAgent",
    },
    {
      title: "Renewal Earnings",
      value: "0",
      color: "#ff9800",
      icon: "Autorenew",
    },
    {
      title: "My Total Earnings",
      value: "24700.0",
      color: "#0B192C",
      icon: "AttachMoney",
    },
    {
      title: "Padd Amount",
      value: "19000.0",
      color: "#f44336",
      icon: "AccountBalanceWallet",
    },
    {
      title: "Pending Amount",
      value: "5700.0",
      color: "#607d8b",
      icon: "Pending",
    },
  ],
};

export default sidebarData;
