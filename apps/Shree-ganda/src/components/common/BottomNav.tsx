import React from 'react';
import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  People as MatchesIcon,
  Favorite as FavoriteIcon,
  Search as SearchIcon,
  ManageSearch as ViewAllIcon,
  Person as PersonIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';

export interface MobileTabItem {
  id: string;
  label: string;
  path: string;
  icon?: React.ReactNode;
}

export const DEFAULT_MOBILE_TABS: MobileTabItem[] = [
  { id: 'home', label: 'Matches', path: '/user/MyMatches', icon: <MatchesIcon /> },
  { id: 'interests', label: 'Interests', path: '/user/myintrest', icon: <FavoriteIcon /> },
  { id: 'search', label: 'Search', path: '/user/search', icon: <SearchIcon /> },
  { id: 'viewAll', label: 'View All', path: '/user/viewAll', icon: <ViewAllIcon /> },
  { id: 'profile', label: 'Profile', path: '/user/profile', icon: <PersonIcon /> },
];

export interface BottomNavProps {
  tabs?: MobileTabItem[];
  onChange?: (tab: MobileTabItem) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  tabs = DEFAULT_MOBILE_TABS,
  onChange,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();

  if (!isMobile) {
    return null;
  }

  // Find active tab index
  const activeIndex = tabs.findIndex(
    (t) =>
      location.pathname === t.path ||
      (t.path !== '/' && location.pathname.startsWith(t.path))
  );

  const handleChange = (_event: React.SyntheticEvent, newIndex: number) => {
    const selectedTab = tabs[newIndex];
    if (selectedTab) {
      if (onChange) {
        onChange(selectedTab);
      }
      navigate(selectedTab.path);
    }
  };

  return (
    <Paper
      elevation={8}
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1300,
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid rgba(197, 160, 89, 0.3)',
        boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.08)',
        // Gesture-based safe area padding
        paddingBottom: 'env(safe-area-inset-bottom, 12px)',
        width: '100%',
      }}
    >
      <BottomNavigation
        showLabels
        value={activeIndex >= 0 ? activeIndex : 0}
        onChange={handleChange}
        sx={{
          height: 60,
          backgroundColor: 'transparent',
          '& .MuiBottomNavigationAction-root': {
            minWidth: 0,
            padding: '6px 0',
            color: '#5C4033',
            transition: 'color 0.2s ease, transform 0.2s ease',
            '&.Mui-selected': {
              color: '#78350F',
              fontWeight: 700,
            },
            '& .MuiBottomNavigationAction-label': {
              fontSize: '0.72rem',
              fontWeight: 600,
              mt: 0.3,
              '&.Mui-selected': {
                fontSize: '0.75rem',
                fontWeight: 700,
              },
            },
            '& .MuiSvgIcon-root': {
              fontSize: '1.35rem',
            },
          },
        }}
      >
        {tabs.map((tab) => (
          <BottomNavigationAction
            key={tab.id}
            label={tab.label}
            icon={tab.icon || <HomeIcon />}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
};

export default BottomNav;
