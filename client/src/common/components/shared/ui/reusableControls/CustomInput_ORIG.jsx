
import { TextField } from "@mui/material";

export default function CustomInput(props) {
  const {
    name,
    label,
    value,
    error = null,
    onChange,
    variant,
    readOnly,
  } = props;

  return (
    <TextField
      variant={variant}
      size="small"
      type="text"
      margin="normal"
      fullWidth
      label={label}
      name={name}
      value={value || ""}
      onChange={onChange}
      {...(error && { error: true, helperText: error })}
      slotProps={{
        input: {
          style: { textTransform: "uppercase" },
          readOnly: readOnly,
        },
      }}
    />
  );
}
