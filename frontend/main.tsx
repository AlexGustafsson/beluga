import Auth0ProviderWithHistory from "./components/Auth0ProviderWithHistory";
import "./main.css";
import App from "./pages/App";
import { ThemeProvider } from "@emotion/react";
import "@fontsource/open-sans/300.css";
import "@fontsource/open-sans/400.css";
import "@fontsource/open-sans/500.css";
import "@fontsource/open-sans/600.css";
import "@fontsource/open-sans/700.css";
import { createTheme } from "@mui/material";
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

const theme = createTheme({
  typography: {
    fontFamily: ["Open Sans", "sans-serif"].join(","),
  },
  components: {
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 4,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          padding: "12px",
          backgroundColor: "#27343B",
        },
        arrow: {
          color: "#27343B",
        },
      },
    },
  },
});

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(
    <React.StrictMode>
      <BrowserRouter>
        <Auth0ProviderWithHistory
          domain="http://localhost:8081"
          clientId="61ce816dd7194b4bbbbb41ed55e102b3"
        >
          <ThemeProvider theme={theme}>
            <App />
          </ThemeProvider>
        </Auth0ProviderWithHistory>
      </BrowserRouter>
    </React.StrictMode>
  );
}
