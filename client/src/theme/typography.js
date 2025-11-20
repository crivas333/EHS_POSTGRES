
// src/theme/typography.js
const typography = {
  fontFamily: `"Inter", "Roboto", "Helvetica", "Arial", sans-serif`,
  fontSize: 13,

  // Headings
  h1: { fontSize: "2.2rem", fontWeight: 700, letterSpacing: "-0.02em" },
  h2: { fontSize: "1.8rem", fontWeight: 600 },
  h3: { fontSize: "1.5rem", fontWeight: 600 },
  h4: { fontSize: "1.3rem", fontWeight: 500 },
  h5: { fontSize: "1.1rem", fontWeight: 500 },
  h6: { fontSize: "1rem", fontWeight: 600 },

  // Body
  subtitle1: { fontSize: "0.95rem", fontWeight: 500, color: "#555" },
  subtitle2: { fontSize: "0.85rem", fontWeight: 500, color: "#666" },
  body1: { fontSize: "0.9rem", lineHeight: 1.5 },
  body2: { fontSize: "0.8rem", color: "#444" },
  button: { textTransform: "none", fontWeight: 600, fontSize: "0.85rem" },
  caption: { fontSize: "0.75rem", color: "#777" },
  overline: {
    fontSize: "0.7rem",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
  },

  // ── FORM SYSTEM ─────────────────────────────────────
  form: {
    label: {
      fontSize: "0.7rem",
      fontWeight: 500,
      color: "#555",
      lineHeight: 1.2,
      marginBottom: "2px",
    },
    input: {
      fontSize: "0.65rem",
      lineHeight: 1.1,
      fontWeight: 400,
      padding: "3px 5px",
      textAlign: "center",
    },
    helper: {
      fontSize: "0.6rem",
      color: "#777",
      marginTop: "1px",
    },
    sectionTitle: {
      fontSize: "0.75rem",
      fontWeight: 600,
      color: "#333",
      letterSpacing: "0.02em",
      marginBottom: "4px",
    },
    spacing: {
      fieldGap: "6px",
      rowGap: "4px",
      columnGap: "3px",
      sectionPadding: "8px 10px",
    },
    header: {
      fontSize: "0.8rem",
      fontWeight: 600,
      letterSpacing: "0.01em",
      color: "#222",
    },
  },

  // ── NEW: dashboardForm variant (used in ManifestRefraction) ─────
  dashboardForm: {
    fontSize: "0.65rem",
    fontWeight: 400,
    lineHeight: 1.1,
    color: "inherit",
    textAlign: "center",
  },

  // Optional: label & header variants for dashboardForm
  dashboardFormLabel: {
    fontSize: "0.7rem",
    fontWeight: 500,
    color: "#555",
    lineHeight: 1.2,
    marginBottom: "2px",
  },
  dashboardFormHeader: {
    fontSize: "0.8rem",
    fontWeight: 600,
    letterSpacing: "0.01em",
    color: "#222",
  },
};

export default typography;