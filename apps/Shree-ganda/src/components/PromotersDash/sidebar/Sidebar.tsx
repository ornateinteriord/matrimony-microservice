import React from 'react';
import { Drawer, Box } from '@mui/material';
import DynamicSidebar from '../../common/DynamicSidebar';
import { SidebarConfig } from '../../../types/navigation';
import { useNavigate } from 'react-router-dom';

export const PROMOTER_SIDEBAR_CONFIG: SidebarConfig = {
  brandTitle: 'Shree Ganda Promoter',
  homePath: '/PromotAdmin',
  items: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      path: '/PromotAdmin',
      icon: 'Dashboard',
    },
    {
      id: 'profile',
      title: 'My Profile',
      path: '/PromotAdmin/profilepage',
      icon: 'Person',
    },
    {
      id: 'refer',
      title: 'Refer / Invite',
      path: '/PromotAdmin/refer',
      icon: 'Share',
    },
    {
      id: 'referrals',
      title: 'My Referrals',
      path: '/PromotAdmin/my-referrals',
      icon: 'Groups',
      children: [
        { id: 'pending', title: 'Pending', path: '/PromotAdmin/pending', icon: 'Pending' },
        { id: 'success', title: 'Success', path: '/PromotAdmin/success', icon: 'HowToReg' },
        { id: 'expired', title: 'Expired', path: '/PromotAdmin/expired', icon: 'Autorenew' },
        { id: 'inactive', title: 'Inactive', path: '/PromotAdmin/inactive', icon: 'Person' },
        { id: 'team', title: 'Team Users', path: '/PromotAdmin/team-users', icon: 'Groups' },
      ],
    },
    {
      id: 'logout',
      title: 'Logout',
      path: '/promoter/login',
      icon: 'Logout',
    },
  ],
};

interface SidebarProps {
  isMobile?: boolean;
  open?: boolean;
  toggleDrawer?: () => void;
  sidebarData?: any;
}

const Sidebar: React.FC<SidebarProps> = ({
  isMobile,
  open,
  toggleDrawer,
}) => {
  const navigate = useNavigate();

  const handleItemClick = (item: any) => {
    if (item.id === 'logout') {
      localStorage.removeItem('promoter_token');
      localStorage.removeItem('token');
      navigate('/promoter/login');
      if (isMobile && toggleDrawer) {
        toggleDrawer();
      }
    }
  };

  const content = (
    <Box sx={{ width: 260, height: '100%' }}>
      <DynamicSidebar
        config={PROMOTER_SIDEBAR_CONFIG}
        onItemClick={handleItemClick}
        onClose={isMobile ? toggleDrawer : undefined}
      />
    </Box>
  );

  return isMobile ? (
    <Drawer
      variant="temporary"
      anchor="left"
      open={open}
      onClose={toggleDrawer}
      ModalProps={{ keepMounted: true }}
      sx={{
        '& .MuiDrawer-paper': {
          width: 260,
          boxSizing: 'border-box',
          backgroundColor: '#FDFBF7',
        },
      }}
    >
      {content}
    </Drawer>
  ) : (
    <Box
      sx={{
        width: 260,
        flexShrink: 0,
        height: '100vh',
        position: 'sticky',
        top: 0,
      }}
    >
      {content}
    </Box>
  );
};

export default Sidebar;
