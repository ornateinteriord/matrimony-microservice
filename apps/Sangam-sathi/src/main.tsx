import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider, CssBaseline } from "@mui/material";
import royalTheme from "./theme/theme";
import App from "./App";
import "./index.css";

const rootElement = document.getElementById("root");

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <ThemeProvider theme={royalTheme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </StrictMode>
  );
} else {
  console.error("Root element not found!");
}
