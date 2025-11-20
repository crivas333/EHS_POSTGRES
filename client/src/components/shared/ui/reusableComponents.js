import { styled } from "@mui/material/styles";

export const Span = styled("span", {
  shouldForwardProp: (prop) => prop !== "show",
})(({ theme, show }) => ({
  ...(show && {
    display: "none",
  }),
}));
