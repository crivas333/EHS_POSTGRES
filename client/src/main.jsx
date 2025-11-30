// src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import { StyledEngineProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import esLocale from "date-fns/locale/es";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./services/graphql-client/TSreactQueryClient";
import { GlobalProvider } from "@/state/context/GlobalState.jsx";
import { ThemeModeProvider } from "@/state/context/ThemeModeContext.jsx";

import { useAuthStore } from "@/state/zustand/ZustandStore";
import { myclient } from "@/services/graphql-client/myclient";
import { ME } from "@/services/graphql/auth";

import Notifier from "./common/components/shared/notification/Notifier.jsx";
import App from "./App.jsx";

// Initialize auth on app start
const token = localStorage.getItem("access_token");
if (token) {
  myclient.setHeader("Authorization", `Bearer ${token}`);
  // Try to fetch user silently
  myclient
    .request(ME)
    .then(({ me }) => {
      useAuthStore.getState().setAuth(me, token);
    })
    .catch(() => {
      localStorage.removeItem("access_token");
      useAuthStore.getState().finishLoading();
    });
} else {
  useAuthStore.getState().finishLoading();
}

const root = createRoot(document.getElementById("root"));
root.render(
  <StyledEngineProvider injectFirst>
    <ThemeModeProvider>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <GlobalProvider>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={esLocale}>
            <React.StrictMode>
              <Notifier />
              <App />
            </React.StrictMode>
          </LocalizationProvider>
        </GlobalProvider>
      </QueryClientProvider>
    </ThemeModeProvider>
  </StyledEngineProvider>
);
