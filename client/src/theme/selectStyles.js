// src/theme/selectStyles.js
export const getSelectStyles = (theme) => ({
  control: (base) => ({
    ...base,
    backgroundColor:
      theme.palette.mode === "dark"
        ? theme.palette.background.paper
        : theme.palette.background.default,
    borderColor:
      theme.palette.mode === "dark"
        ? theme.palette.divider
        : theme.palette.grey[400],
    color: theme.palette.text.primary,
    minHeight: 38,
    "&:hover": {
      borderColor: theme.palette.primary.main,
    },
  }),

  input: (base) => ({
    ...base,
    textTransform: "uppercase",
    color: theme.palette.text.primary,
  }),

  singleValue: (base) => ({
    ...base,
    textTransform: "uppercase",
    color: theme.palette.text.primary,
  }),

  menu: (base) => ({
    ...base,
    zIndex: 100,
    backgroundColor:
      theme.palette.mode === "dark"
        ? theme.palette.background.paper
        : theme.palette.background.paper,
  }),

  option: (base, { isFocused, isSelected }) => ({
    ...base,
    backgroundColor: isSelected
      ? theme.palette.primary.main
      : isFocused
      ? theme.palette.mode === "light"
        ? theme.palette.primary.dark
        : theme.palette.action.hover
      : "transparent",
    color: isFocused || isSelected ? "#fff" : theme.palette.text.primary,
    cursor: "pointer",
  }),

  placeholder: (base) => ({
    ...base,
    color: theme.palette.text.secondary,
  }),

  noOptionsMessage: (base) => ({
    ...base,
    color: theme.palette.text.secondary,
  }),
});
