import React, { useMemo, useState } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "@/theme";
import { ThemeModeContext } from "./ThemeModeContextObject.js";

export const ThemeModeProvider = ({ children }) => {
  const [mode, setMode] = useState(
    localStorage.getItem("appThemeMode") || "light"
  );

  const toggleMode = () => {
    setMode((prev) => {
      const next = prev === "light" ? "dark" : "light";
      localStorage.setItem("appThemeMode", next);
      return next;
    });
  };

  const currentTheme = useMemo(() => theme(mode), [mode]);

  return (
    <ThemeModeContext.Provider value={{ mode, toggleMode }}>
      <ThemeProvider theme={currentTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
};

