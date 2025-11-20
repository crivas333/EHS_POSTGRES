
// src/theme/palette.js
const palette = (mode = "light") => ({
  mode,
  primary: {
    main: "#1976d2",
    light: "#63a4ff",
    dark: "#004ba0",
    contrastText: "#fff",
  },
  secondary: {
    main: "#f50057",
    light: "#ff5983",
    dark: "#bb002f",
    contrastText: "#fff",
  },
  success: {
    main: "#2e7d32",
    light: "#60ad5e",
    dark: "#005005",
    contrastText: "#fff",
  },
  warning: {
    main: "#ed6c02",
    light: "#ff9800",
    dark: "#e65100",
    contrastText: "#fff",
  },
  error: {
    main: "#d32f2f",
    light: "#ef5350",
    dark: "#c62828",
    contrastText: "#fff",
  },
  info: {
    main: "#0288d1",
    light: "#03a9f4",
    dark: "#01579b",
    contrastText: "#fff",
  },

  // 👇 mode-specific backgrounds
  background:
    mode === "light"
      ? {
          default: "#fafafa",
          paper: "#ffffff",
        }
      : {
          default: "#121212",
          paper: "#1e1e1e",
        },

  // 👇 mode-specific text
  text:
    mode === "light"
      ? {
          primary: "#1a1a1a",
          secondary: "#555555",
          disabled: "#9e9e9e",
        }
      : {
          primary: "#ffffff",
          secondary: "#cccccc",
          disabled: "#777777",
        },
});

export default palette;
