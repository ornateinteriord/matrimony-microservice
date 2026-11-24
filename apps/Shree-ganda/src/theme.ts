import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: '"Outfit", "Montserrat", sans-serif',
    h1: {
      fontWeight: 700,
      color: "#2D1810",
    },
    h2: {
      fontWeight: 600,
      color: "#2D1810",
    },
    h3: {
      fontWeight: 600,
      color: "#2D1810",
    },
    h4: {
      fontWeight: 600,
      color: "#2D1810",
    },
    h5: {
      fontWeight: 600,
      color: "#2D1810",
    },
    h6: {
      fontWeight: 600,
      color: "#2D1810",
    },
    button: {
      fontWeight: 600,
      textTransform: "none",
    },
  },
  palette: {
    primary: {
      main: "#78350F", // Sandalwood Brown
      light: "#92400E",
      dark: "#451A03",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#991B1B", // Deep Sindoor Red
      light: "#B91C1C",
      dark: "#7F1D1D",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#FDFBF7", // Warm cream ivory
      paper: "#FFFFFF",
    },
    text: {
      primary: "#2D1810",
      secondary: "#5C4033",
    },
    success: {
      main: "#2E7D32",
    },
    error: {
      main: "#8B1E1E",
    },
    warning: {
      main: "#ED6C02",
    },
    info: {
      main: "#0288D1",
    },
  },
  shape: {
    borderRadius: 6,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "4px",
          textTransform: "none",
          fontWeight: 600,
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
        containedPrimary: {
          backgroundColor: "#78350F",
          color: "#FFFFFF",
          "&:hover": {
            backgroundColor: "#5c280b",
          },
        },
        containedSecondary: {
          backgroundColor: "#991B1B",
          color: "#FFFFFF",
          "&:hover": {
            backgroundColor: "#7f1d1d",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: "6px",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "6px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          border: "1px solid #E2E8F0",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: "6px",
        },
      },
    },
  },
});

export default theme;
