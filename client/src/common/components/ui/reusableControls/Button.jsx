import React from "react";
import Button from "@mui/material/Button";

export default function CustomButton(props) {
  const { text, size, color, variant, onClick, ...other } = props;

  return (
    <Button
      variant={variant || "contained"}
      size={size || "large"}
      color={color || "primary"}
      onClick={onClick}
      {...other}
      //classes={{ root: classes.root, label: classes.label }}
    >
      {text}
    </Button>
  );
}
