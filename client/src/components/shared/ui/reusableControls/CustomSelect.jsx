
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import Tooltip from "@mui/material/Tooltip";

export default function CustomSelect(props) {
  const {
    name,
    label,
    value,
    onChange,
    options = [],
    valueField = "field",
    labelField = "field",
    error = null,
    placeholder = "",
    tooltip = null,
    variant = "outlined",
  } = props;

  // Prevent out-of-range value
  const safeValue = options.some((opt) => opt[valueField] === value)
    ? value
    : "";

  const selectElement = (
    <FormControl
      fullWidth
      variant={variant}
      size="small"
      margin="dense"
      error={Boolean(error)}
    >
      <InputLabel>{label}</InputLabel>
      <Select label={label} name={name} value={safeValue} onChange={onChange}>
        {placeholder && (
          <MenuItem value="">
            <em>{placeholder}</em>
          </MenuItem>
        )}
        {options.map((item) => (
          <MenuItem key={item.id || item[valueField]} value={item[valueField]}>
            {item[labelField]}
          </MenuItem>
        ))}
      </Select>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );

  return tooltip ? (
    <Tooltip title={tooltip}>{selectElement}</Tooltip>
  ) : (
    selectElement
  );
}
