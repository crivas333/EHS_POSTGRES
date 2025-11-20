import React, { useRef, useState } from "react";
import { DatePicker } from "@mui/x-date-pickers";
import TextField from "@mui/material/TextField";
import PropTypes from "prop-types";

export default function PlainDatePicker({
  name,
  label,
  value,
  onChange,
  variant = "outlined",
  disableFuture = false,
  minDate = new Date("1900-01-01"),
  CustomInput = null, // optional custom input component
  readOnly = false,   // display-only mode
}) {
  const inputRef = useRef(null); // stable reference for Popper
  const [pickerOpen, setPickerOpen] = useState(false);

  // Ensure value is always a Date object or null
  const dateValue = value ? new Date(value) : null;

  // Handle change safely
  const handleChange = (date) => {
    if (!readOnly && typeof onChange === "function") {
      onChange({
        target: {
          name,
          value: date ? date.toISOString() : null,
        },
      });
    }
  };

  // Read-only display mode
  if (readOnly) {
    const displayValue = dateValue
      ? dateValue.toLocaleDateString("es-ES") // or customize locale/format
      : "";
    return (
      <TextField
        value={displayValue}
        label={label}
        variant={variant}
        size="small"
        margin="dense"
        fullWidth
        InputProps={{
          readOnly: true,
        }}
      />
    );
  }

  // Editable DatePicker mode
  return (
    <DatePicker
      value={dateValue}
      onChange={handleChange}
      inputFormat="dd/MM/yyyy"
      enableAccessibleFieldDOMStructure={false}
      open={pickerOpen}
      onOpen={() => setPickerOpen(true)}
      onClose={() => setPickerOpen(false)}
      slots={{
        textField: (params) =>
          CustomInput ? (
            <CustomInput {...params} />
          ) : (
            <TextField
              {...params}
              inputRef={inputRef}
              variant={variant}
              size="small"
              margin="dense"
              label={label}
              fullWidth
            />
          ),
      }}
      PopperProps={{
        anchorEl: inputRef.current ?? undefined,
        disablePortal: true,
      }}
      minDate={minDate}
      disableFuture={disableFuture}
      onError={(error, value) => {
        console.log(`DatePicker "${name}" error:`, error, "value:", value);
      }}
    />
  );
}

// Default props for safety
PlainDatePicker.defaultProps = {
  onChange: () => {},
  value: null,
  variant: "outlined",
  disableFuture: false,
  minDate: new Date("1900-01-01"),
  CustomInput: null,
  readOnly: false,
};

// PropTypes for clarity
PlainDatePicker.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  onChange: PropTypes.func,
  variant: PropTypes.string,
  disableFuture: PropTypes.bool,
  minDate: PropTypes.instanceOf(Date),
  CustomInput: PropTypes.elementType,
  readOnly: PropTypes.bool,
};