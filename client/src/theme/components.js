// src/theme/components.js
import { alpha } from "@mui/material";

const components = {
  // ───────────────────────── Paper ─────────────────────────
  MuiPaper: {
    defaultProps: { elevation: 1 },
    styleOverrides: {
      root: ({ theme }) => {
        const isDark = theme.palette.mode === "dark";

        return {
          borderRadius: theme.shape.borderRadius * 2,
          boxShadow: isDark
            ? "0 2px 10px rgba(0,0,0,0.6)"
            : theme.shadows[1],
          backgroundColor: isDark
            ? theme.palette.background.default
            : theme.palette.background.paper,
          border: isDark ? `1px solid ${theme.palette.divider}` : "none",
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

  // ───────────────────────── Button & ButtonGroup ─────────────────────────
  // ... (tu código actual de Button y ButtonGroup se mantiene igual)

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

  // ───────────────────────── AppBar, Drawer, Container, Tabs, Tab ─────────────────────────
  // ... (tu código actual sigue igual)

  // ───────────────────────── TABLE SYSTEM (NUEVO) ─────────────────────────
  MuiTable: {
    defaultProps: {
      size: "small",
      stickyHeader: true,
    },
    styleOverrides: {
      root: ({ theme }) => ({
        borderCollapse: "separate",
        borderSpacing: 0,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: theme.shape.borderRadius * 2,
        overflow: "hidden",
        backgroundColor: theme.palette.background.paper,
      }),
    },
  },

  MuiTableHead: {
    styleOverrides: {
      root: ({ theme }) => ({
        "& .MuiTableCell-head": {
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
        },
      }),
    },
  },

  MuiTableCell: {
    styleOverrides: {
      root: ({ theme }) => ({
        padding: "10px 12px",
        borderBottom: `1px solid ${theme.palette.divider}`,
        transition: theme.transitions.create("background-color"),
      }),

      head: ({ theme }) => ({
        ...theme.typography.table.header,
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        cursor: "pointer",
        userSelect: "none",
        "&:hover": {
          backgroundColor: theme.palette.primary.dark,
        },
      }),

      body: ({ theme }) => ({
        ...theme.typography.table.cell,
      }),
    },
  },

  MuiTableRow: {
    styleOverrides: {
      root: ({ theme }) => ({
        "&:nth-of-type(odd)": {
          backgroundColor: theme.palette.action.hover,
        },
        "&:hover": {
          backgroundColor: alpha(theme.palette.primary.main, 0.1),
        },
        transition: theme.transitions.create("background-color", {
          duration: theme.transitions.duration.shortest,
        }),

        "&.highlighted": {
          backgroundColor: alpha(theme.palette.success.light, 0.3),
          "&:hover": {
            backgroundColor: alpha(theme.palette.success.light, 0.4),
          },
        },
      }),
    },
  },
};

export default components;