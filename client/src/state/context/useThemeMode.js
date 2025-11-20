// src/context/useThemeMode.js
import { useContext } from "react";
import { ThemeModeContext } from "./ThemeModeContextObject.js";

export const useThemeMode = () => {
  const context = useContext(ThemeModeContext);
  if (!context) {
    throw new Error("useThemeMode must be used within a ThemeModeProvider");
  }
  return context;
};

