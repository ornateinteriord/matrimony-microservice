// data.js
const sidebarData = {
  title: "Sangam ❤️ Sathi",
  menuItems: [
    {
      text: "Dashboard",
      icon: "Dashboard",
      path:"/PromotAdmin"
    },
    {
      text: "My Profile",
      icon: "Person",
      path:"/PromotAdmin/profilepage"
    },
    {
      text: "Refer / Invite",
      icon: "Share",
       path:"/PromotAdmin/refer"
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
      color: "#9c27b0",
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
