import React from "react";
import { TextField } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import EditIcon from "@mui/icons-material/Edit";
import ClearIcon from "@mui/icons-material/Clear";
import IconButton from "@mui/material/IconButton";

//import { makeStyles } from "@mui/styles";

// const useStyles = makeStyles((theme) => ({
//   textField: {
//     marginTop: theme.spacing(0),
//   },
//   textfieldReadOnly: {
//     marginTop: theme.spacing(2),
//     background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
//   },
//   input: {
//     textTransform: "uppercase",
//     // autoComplete: 'off'
//   },
//   formControl: {
//     marginTop: theme.spacing(0),
//   },
// }));

export default function CustomInputIconEdit(props) {
  //const classes = useStyles();
  const {
    name,
    label,
    value,
    error = null,
    onChange,
    variant,
    handleIconClick,
  } = props;
  return (
    <TextField
      variant={variant}
      size="small"
      type="text"
      margin="normal"
      fullWidth
      //inputRef={register}
      label={label}
      name={name}
      value={value || ""}
      onChange={onChange}
      {...(error && { error: true, helperText: error })}
      //inputProps={{ className: classes.input }}
      inputProps={{ style: { textTransform: "uppercase" } }}
      InputProps={{
        //className: classes.input,
        startAdornment: (
          <InputAdornment position="start">
            <EditIcon />
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={handleIconClick}>
              <ClearIcon fontSize="small" />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}