// src/theme/index.js
import { createTheme } from "@mui/material/styles";
import palette from "./palette";
import typography from "./typography";
import components from "./components";

// 👇 Export a function that takes `mode`
const theme = (mode = "light") =>
  createTheme({
    palette: palette(mode),
    typography,
    components,
  });

export default theme;

