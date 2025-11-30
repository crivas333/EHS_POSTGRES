import React from "react";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import TextField from "@mui/material/TextField";

export default function PlainDateTimePicker(props) {
  const {
    name,
    label,
    value,
    onChange,
    variant = "outlined",
    readOnly = false,
    disablePast = false,
    disableFuture = false,
    ampm=false  // 👈 disables AM/PM → 24h mode
  } = props;

  const handleChange = (date) => {
    onChange({
      target: {
        name,
        value: date ? date.toISOString() : "",
      },
    });
  };

  const dateValue = value ? new Date(value) : null;

  // Forward ref wrapper
  const TextFieldWithRef = React.forwardRef((params, ref) => (
    <TextField
      {...params}
      inputRef={ref}
      variant={variant}
      size="small"
      margin="dense"
    />
  ));

  return (
    <DateTimePicker
      label={label}
      value={dateValue}
      onChange={handleChange}
      disablePast={disablePast}
      disableFuture={disableFuture}
      readOnly={readOnly}
      ampm={false}
      inputFormat="dd/MM/yyyy hh:mm a"
      enableAccessibleFieldDOMStructure={false}
      slots={{
        textField: TextFieldWithRef,
      }}
    />
  );
}
