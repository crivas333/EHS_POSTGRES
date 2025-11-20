// src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import { StyledEngineProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import esLocale from "date-fns/locale/es";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./graphqlClient/TSreactQueryClient";
import { GlobalProvider } from "@/state/context/GlobalState.jsx";


import { ThemeModeProvider } from "@/state/context/ThemeModeContext.jsx";

import Notifier from "./components/shared/notification/Notifier.jsx";
import App from "./App.jsx";

const root = createRoot(document.getElementById("root"));
root.render(
  <StyledEngineProvider injectFirst>
    <ThemeModeProvider>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <GlobalProvider>
          <LocalizationProvider
            dateAdapter={AdapterDateFns}
            adapterLocale={esLocale}
          >
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
