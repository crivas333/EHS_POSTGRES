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

  // Wrapper so all values are uppercased before passing up
  const handleChange = (e) => {
    const upperValue = e.target.value.toUpperCase();
    onChange({
      ...e,
      target: {
        ...e.target,
        name,
        value: upperValue,
      },
    });
  };

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
      onChange={handleChange}
      {...(error && { error: true, helperText: error })}
      slotProps={{
        input: {
          readOnly: readOnly,
        },
      }}
    />
  );
}
