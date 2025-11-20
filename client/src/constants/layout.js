import { useTheme, useMediaQuery } from "@mui/material";

// Desktop and mobile header heights
export const APP_BAR_HEIGHT_DESKTOP = 64;
export const APP_BAR_HEIGHT_MOBILE = 56;

/**
 * React hook returning the current AppBar height
 * that adapts to the active breakpoint.
 */
export const useAppBarHeight = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return isMobile ? APP_BAR_HEIGHT_MOBILE : APP_BAR_HEIGHT_DESKTOP;
};
