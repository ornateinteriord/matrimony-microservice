import React from 'react';
import { Paper, BottomNavigation, BottomNavigationAction } from '@mui/material';
import {
  Search as SearchIcon,
  Favorite as FavoriteIcon,
  Person as PersonIcon,
  Handshake as HandshakeIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';

export interface BottomNavDestination {
  label: string;
  value: string;
  path: string;
  icon: React.ReactElement;
}

export const defaultBottomNavDestinations: BottomNavDestination[] = [
  { label: 'Matches', value: 'matches', path: '/user/MyMatches', icon: <FavoriteIcon /> },
  { label: 'Interests', value: 'interests', path: '/user/myintrest', icon: <HandshakeIcon /> },
  { label: 'Search', value: 'search', path: '/user/search', icon: <SearchIcon /> },
  { label: 'View All', value: 'viewall', path: '/user/viewAll', icon: <PeopleIcon /> },
  { label: 'Profile', value: 'profile', path: '/user/profile', icon: <PersonIcon /> },
];

export const BottomNav: React.FC<{ destinations?: BottomNavDestination[] }> = ({
  destinations = defaultBottomNavDestinations,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Find active value based on pathname
  const activeDest = destinations.find((d) =>
    location.pathname.toLowerCase().includes(d.path.toLowerCase())
  );
  const activeValue = activeDest ? activeDest.value : destinations[0].value;

  return (
    <Paper
      elevation={8}
      sx={{
        display: { xs: 'flex', md: 'none' },
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1200,
        backgroundColor: '#0F172A',
        borderTop: '1px solid rgba(217, 119, 6, 0.25)',
      }}
    >
      <BottomNavigation
        showLabels
        value={activeValue}
        onChange={(_, newValue) => {
          const dest = destinations.find((d) => d.value === newValue);
          if (dest) {
            navigate(dest.path);
          }
        }}
        sx={{
          width: '100%',
          backgroundColor: '#0F172A',
          height: '60px',
          '& .MuiBottomNavigationAction-root': {
            color: 'rgba(255, 255, 255, 0.7)',
            minWidth: 0,
            padding: '6px 0',
            '&.Mui-selected': {
              color: '#D4AF37', // Champagne Gold active accent
            },
            '& .MuiBottomNavigationAction-label': {
              fontSize: '0.72rem',
              fontWeight: 600,
              mt: 0.5,
              '&.Mui-selected': {
                fontSize: '0.75rem',
              },
            },
          },
        }}
      >
        {destinations.map((dest) => (
          <BottomNavigationAction
            key={dest.value}
            label={dest.label}
            value={dest.value}
            icon={dest.icon}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
};

export default BottomNav;
