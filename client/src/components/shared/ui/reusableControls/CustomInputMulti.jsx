import React from "react";
import { TextField } from "@mui/material";
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

export default function CustomInputMulti(props) {
  //const classes = useStyles();
  const {
    name,
    label,
    value,
    error = null,
    onChange,
    maxLines = 2,
    variant,
    readOnly,
  } = props;
  return (
    <TextField
      readOnly={readOnly}
      variant={variant}
      size="small"
      type="text"
      margin="normal"
      fullWidth
      multiline
      rows={maxLines}
      label={label}
      name={name}
      value={value || ""}
      onChange={onChange}
      {...(error && { error: true, helperText: error })}
      //inputProps={{ className: classes.input }}
      //inputProps={{ textTransform: "uppercase" }}
      inputProps={{ style: { textTransform: "uppercase" } }}
    />
  );
}

/*
   <FormControl
            className={classes.formControl}
          >
            <TextField
                //variant='normal'
                size='small'
                type='text'
                margin='normal'
								fullWidth
								variant='outlined'
                label={label}
                name={name}
                value={value}
                onChange={onChange}
                {...(error && {error:true,helperText:error})}
                InputLabelProps={{
                    shrink: true,
                }}
            />
        </FormControl>
*/
