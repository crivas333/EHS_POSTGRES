// src/theme/components.js
const components = {
  // ───────────────────────── Paper ─────────────────────────
  MuiPaper: {
    defaultProps: { elevation: 1 },
    styleOverrides: {
      root: ({ theme, ownerState }) => {
        const isDark = theme.palette.mode === "dark";

        return {
          borderRadius: ownerState.square
            ? 0
            : theme.shape.borderRadius * 2,
          boxShadow: isDark
            ? "0 2px 10px rgba(0,0,0,0.6)"
            : theme.shadows[1],
          backgroundColor: isDark
            ? theme.palette.background.default
            : theme.palette.background.paper,
          border: isDark
            ? `1px solid ${theme.palette.divider}`
            : "none",
          transition: theme.transitions.create(
            ["background-color", "box-shadow", "border"],
            { duration: theme.transitions.duration.short }
          ),
        };
      },
    },
    variants: [
      {
        props: { variant: "dashboardForm" },
        style: ({ theme }) => ({
          padding: theme.spacing(2),
          borderRadius: 10,
          boxShadow: theme.shadows[1],
          backgroundColor:
            theme.palette.mode === "dark"
              ? theme.palette.background.paper
              : "#fafafa",
          border: `1px solid ${theme.palette.divider}`,
        }),
      },
    ],
  },

  // ───────────────────────── Button ─────────────────────────
  MuiButton: {
    defaultProps: { disableElevation: true, disableRipple: true  },
    styleOverrides: {
      root: ({ theme }) => ({
        textTransform: "none",
        borderRadius: theme.shape.borderRadius,
        fontWeight: 600,
        padding: theme.spacing(1, 2),
        transition: theme.transitions.create(
          ["background-color", "transform", "box-shadow"],
          { duration: theme.transitions.duration.shortest }
        ),
        "&:hover": { transform: "translateY(-1px)" },
      }),

      // Reused helper for dark-mode contained buttons
      containedPrimary: ({ theme }) => {
        if (theme.palette.mode !== "dark") return;
        const p = theme.palette.primary;
        return {
          backgroundColor: p.main,
          color: p.contrastText,
          boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
          "&:hover": {
            backgroundColor: p.dark,
            boxShadow: "0 4px 12px rgba(0,0,0,0.6)",
            transform: "translateY(-2px)",
          },
          "&:active": {
            boxShadow: "0 1px 4px rgba(0,0,0,0.5)",
            transform: "translateY(0)",
          },
        };
      },

      containedSecondary: ({ theme }) => {
        if (theme.palette.mode !== "dark") return;
        const s = theme.palette.secondary;
        return {
          backgroundColor: s.main,
          color: s.contrastText,
          boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
          "&:hover": {
            backgroundColor: s.dark,
            boxShadow: "0 4px 12px rgba(0,0,0,0.6)",
            transform: "translateY(-2px)",
          },
          "&:active": {
            boxShadow: "0 1px 4px rgba(0,0,0,0.5)",
            transform: "translateY(0)",
          },
        };
      },

      outlined: ({ theme }) => {
        if (theme.palette.mode !== "dark") return;
        return {
          borderColor: theme.palette.grey[700],
          color: theme.palette.text.primary,
          "&:hover": {
            borderColor: theme.palette.primary.light,
            backgroundColor: theme.palette.action.hover,
          },
        };
      },

      text: ({ theme }) => {
        if (theme.palette.mode !== "dark") return;
        return {
          color: theme.palette.primary.light,
          "&:hover": { backgroundColor: theme.palette.action.hover },
        };
      },
    },
  },

  // ───────────────────────── ButtonGroup ─────────────────────────
  MuiButtonGroup: {
    styleOverrides: {
      root: ({ theme }) => {
        const isDark = theme.palette.mode === "dark";

        return {
          borderRadius: theme.shape.borderRadius,
          overflow: "hidden",
          boxShadow: isDark
            ? "0 1px 4px rgba(0,0,0,0.6)"
            : theme.shadows[1],

          "& .MuiButton-root": {
            minWidth: 120,
            fontWeight: 600,
            textTransform: "none",
            borderColor: isDark
              ? theme.palette.grey[700]
              : theme.palette.grey[300],
            transition: theme.transitions.create(
              ["background-color", "color"],
              { duration: theme.transitions.duration.shortest }
            ),
          },
        };
      },

      contained: ({ theme }) => {
        const isDark = theme.palette.mode === "dark";
        const p = theme.palette.primary;
        const s = theme.palette.secondary;

        return {
          "& .MuiButton-containedPrimary": {
            backgroundColor: isDark ? p.light : p.main,
            color: p.contrastText,
            "&:hover": {
              backgroundColor: isDark ? p.main : p.dark,
            },
          },
          "& .MuiButton-containedSecondary": {
            backgroundColor: isDark ? s.light : s.main,
            color: s.contrastText,
            "&:hover": {
              backgroundColor: isDark ? s.main : s.dark,
            },
          },
          "& .MuiButton-contained": {
            boxShadow: isDark
              ? "0 2px 8px rgba(0,0,0,0.6)"
              : theme.shadows[1],
          },
        };
      },
    },
  },

  // ───────────────────────── TextField ─────────────────────────
  MuiTextField: {},

  // ───────────────────────── Typography ─────────────────────────
  MuiTypography: {
    styleOverrides: {
      root: ({ theme }) => ({
        color:
          theme.palette.mode === "dark"
            ? theme.palette.text.secondary
            : theme.palette.text.primary,
      }),
    },
    variants: [
      {
        props: { variant: "dashboardFormLabel" },
        style: ({ theme }) => theme.typography.dashboardFormLabel,
      },
      {
        props: { variant: "dashboardFormHeader" },
        style: ({ theme }) => theme.typography.dashboardFormHeader,
      },
    ],
  },

  // ───────────────────────── AppBar ─────────────────────────
  MuiAppBar: {
    defaultProps: { square: true, elevation: 3 },
    styleOverrides: {
      root: ({ theme }) => {
        const isDark = theme.palette.mode === "dark";

        return {
          borderRadius: 0,
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          backgroundColor: isDark
            ? theme.palette.background.paper
            : theme.palette.primary.main,
          color: isDark
            ? theme.palette.text.primary
            : theme.palette.primary.contrastText,
          boxShadow: isDark
            ? "0 2px 8px rgba(0,0,0,0.5)"
            : theme.shadows[3],
          transition: theme.transitions.create(
            ["background-color", "backdrop-filter", "box-shadow"],
            { duration: theme.transitions.duration.shortest }
          ),
        };
      },
    },
  },

  // ───────────────────────── Drawer ─────────────────────────
  MuiDrawer: {
    defaultProps: { PaperProps: { square: true } },
    styleOverrides: {
      paper: ({ theme }) => {
        const isDark = theme.palette.mode === "dark";

        return {
          borderRadius: 0,
          boxShadow: isDark
            ? "0 2px 10px rgba(0,0,0,0.7)"
            : theme.shadows[3],
          backgroundColor: isDark
            ? theme.palette.background.paper
            : theme.palette.background.default,
          borderRight: isDark
            ? `1px solid ${theme.palette.divider}`
            : "none",
        };
      },
    },
  },

  // ───────────────────────── Container ─────────────────────────
  MuiContainer: {
    styleOverrides: {
      root: ({ theme }) => ({
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
      }),
    },
  },

  // ───────────────────────── Tabs ─────────────────────────
  MuiTabs: {
    styleOverrides: {
      root: ({ theme }) => {
        const isDark = theme.palette.mode === "dark";

        return isDark
          ? {
              backgroundColor: theme.palette.background.default,
              borderBottom: `1px solid ${theme.palette.divider}`,
            }
          : { backgroundColor: theme.palette.background.paper };
      },

      indicator: ({ theme }) => ({
        backgroundColor: theme.palette.primary.main,
        height: 3,
      }),
    },
  },

  // ───────────────────────── Tab ─────────────────────────
  MuiTab: {
    styleOverrides: {
      root: ({ theme }) => {
        const isDark = theme.palette.mode === "dark";

        return {
          textTransform: "none",
          fontWeight: 500,
          color: isDark
            ? theme.palette.text.secondary
            : theme.palette.text.primary,
          "&.Mui-selected": {
            color: isDark
              ? theme.palette.primary.light
              : theme.palette.primary.main,
          },
        };
      },
    },
  },
};

export default components;
