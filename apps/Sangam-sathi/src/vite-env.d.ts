/// <reference types="vite/client" />

import "@mui/material/Grid";

declare module "@mui/material/Grid" {
  interface GridBaseProps {
    item?: boolean;
    xs?: any;
    sm?: any;
    md?: any;
    lg?: any;
    xl?: any;
    mb?: any;
  }
}

declare module "@mui/material" {
  interface GridBaseProps {
    item?: boolean;
    xs?: any;
    sm?: any;
    md?: any;
    lg?: any;
    xl?: any;
    mb?: any;
  }
}
