import React from "react";
import DynamicSidebar from "../../common/DynamicSidebar";
import { SidebarConfig, NavItemConfig } from "../../../types/navigation";

export interface PromoterSidebarProps {
  isMobile: boolean;
  open: boolean;
  toggleDrawer: () => void;
  sidebarData?: any;
}

const defaultPromoterConfig: SidebarConfig = {
  brandTitle: "Girija Kalyana",
  homePath: "/PromotAdmin",
  items: [
    {
      id: "dashboard",
      title: "Dashboard",
      path: "/PromotAdmin",
      icon: "Dashboard",
    },
    {
      id: "profile",
      title: "My Profile",
      path: "/PromotAdmin/profilepage",
      icon: "Person",
    },
    {
      id: "refer",
      title: "Refer / Invite",
      path: "/PromotAdmin/refer",
      icon: "Share",
    },
    {
      id: "my-referrals",
      title: "My Referrals",
      path: "/PromotAdmin/my-referrals",
      icon: "Groups",
    },
    {
      id: "assistance-services",
      title: "Assistance Services",
      path: "/PromotAdmin/pending",
      icon: "SupportAgent",
      children: [
        {
          id: "pending-assistance",
          title: "Pending",
          path: "/PromotAdmin/pending",
          icon: "Pending",
        },
        {
          id: "success-assistance",
          title: "Success",
          path: "/PromotAdmin/success",
          icon: "CheckCircle",
        },
      ],
    },
    {
      id: "team-users",
      title: "Team Users",
      path: "/PromotAdmin/team-users",
      icon: "Groups",
    },
    {
      id: "expired",
      title: "Expired Referrals",
      path: "/PromotAdmin/expired",
      icon: "TimerOff",
    },
    {
      id: "inactive",
      title: "Inactive Referrals",
      path: "/PromotAdmin/inactive",
      icon: "Person",
    },
    {
      id: "logout",
      title: "Logout",
      path: "/",
      icon: "Logout",
    },
  ],
};

const Sidebar: React.FC<PromoterSidebarProps> = ({
  isMobile,
  open,
  toggleDrawer,
  sidebarData,
}) => {
  // Convert custom sidebarData to SidebarConfig if provided
  const config: SidebarConfig = React.useMemo(() => {
    if (!sidebarData?.menuItems) return defaultPromoterConfig;

    const items: NavItemConfig[] = sidebarData.menuItems.map(
      (m: any, idx: number) => ({
        id: `item-${idx}-${m.text.toLowerCase().replace(/\s+/g, "-")}`,
        title: m.text,
        path: m.path || "",
        icon: m.icon || "ChevronRight",
        children: m.subItems?.map((s: any, sIdx: number) => ({
          id: `sub-${idx}-${sIdx}-${s.text.toLowerCase().replace(/\s+/g, "-")}`,
          title: s.text,
          path: s.path || `/PromotAdmin/${s.text.toLowerCase().replace(/\s+/g, "-")}`,
          icon: "ChevronRight",
        })),
      })
    );

    return {
      brandTitle: sidebarData.title?.trim() || "Girija Kalyana",
      homePath: "/PromotAdmin",
      items,
    };
  }, [sidebarData]);

  return (
    <DynamicSidebar
      config={config}
      isOpen={open}
      onClose={toggleDrawer}
      variant={isMobile ? "temporary" : "permanent"}
      width={240}
    />
  );
};

export default Sidebar;
