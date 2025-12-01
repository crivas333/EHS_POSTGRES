import { useTheme, useMediaQuery } from "@mui/material";

// Desktop and mobile header heights
export const APP_BAR_HEIGHT_DESKTOP = 64;
export const APP_BAR_HEIGHT_MOBILE = 56;

// Drawer widths
export const DRAWER_WIDTH_DESKTOP = 280;
export const DRAWER_WIDTH_MOBILE = 240;

// Profile section heights
export const PROFILE_HEIGHT_DESKTOP = APP_BAR_HEIGHT_DESKTOP;
export const PROFILE_HEIGHT_MOBILE = APP_BAR_HEIGHT_MOBILE;

/**
 * React hook returning the current AppBar height
 * that adapts to the active breakpoint.
 */
export const useAppBarHeight = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return isMobile ? APP_BAR_HEIGHT_MOBILE : APP_BAR_HEIGHT_DESKTOP;
};

/**
 * React hook returning the current drawer width
 * that adapts to the active breakpoint.
 */
export const useDrawerWidth = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return isMobile ? DRAWER_WIDTH_MOBILE : DRAWER_WIDTH_DESKTOP;
};

/**
 * React hook returning the current profile section height
 * that adapts to the active breakpoint.
 */
export const useProfileHeight = () => {
  return useAppBarHeight(); // Profile height matches app bar height
};

// Export all constants for direct usage
export const LAYOUT_CONSTANTS = {
  APP_BAR_HEIGHT_DESKTOP,
  APP_BAR_HEIGHT_MOBILE,
  DRAWER_WIDTH_DESKTOP,
  DRAWER_WIDTH_MOBILE,
  PROFILE_HEIGHT_DESKTOP,
  PROFILE_HEIGHT_MOBILE,
};