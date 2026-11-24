import { createTheme } from '@mui/material/styles';

export const sacredRosewoodTheme = createTheme({
  palette: {
    primary: {
      main: '#700F2B', // Sacred Rosewood/Burgundy
      light: '#881337',
      dark: '#4c0519',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#B45309', // Antique Temple Gold
      light: '#D97706',
      dark: '#78350F',
      contrastText: '#ffffff',
    },
    background: {
      default: '#FFFDF9', // Warm ivory tint
      paper: '#ffffff',
    },
    text: {
      primary: '#1f2937',
      secondary: '#4b5563',
    },
    success: {
      main: '#16a34a',
      contrastText: '#ffffff',
    },
    error: {
      main: '#dc2626',
    },
    warning: {
      main: '#d97706',
    },
    info: {
      main: '#0284c7',
    },
  },
  typography: {
    fontFamily: "'Outfit', 'Noto Serif', sans-serif",
    h1: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
      color: '#881337',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
      color: '#881337',
    },
    h3: {
      fontWeight: 600,
      color: '#881337',
    },
    h4: {
      fontWeight: 600,
      color: '#881337',
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 6,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        containedPrimary: {
          backgroundColor: '#700F2B',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#590a21',
          },
        },
        containedSecondary: {
          backgroundColor: '#B45309',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#92400e',
          },
        },
        outlinedPrimary: {
          borderColor: '#700F2B',
          color: '#700F2B',
          '&:hover': {
            borderColor: '#590a21',
            backgroundColor: 'rgba(112, 15, 43, 0.04)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06)',
          border: '1px solid #e2e8f0',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#700F2B',
          color: '#ffffff',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          borderTop: '1px solid #e2e8f0',
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          color: '#6b7280',
          '&.Mui-selected': {
            color: '#700F2B',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          fontWeight: 600,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '&.Mui-focused fieldset': {
              borderColor: '#881337',
            },
          },
        },
      },
    },
  },
});

export default sacredRosewoodTheme;
