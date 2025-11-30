import React, { useState } from "react";

//import { makeStyles } from "@mui/styles";
//import CssBaseline from '@material-ui/core/CssBaseline'

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";


const AddUserForm = (props) => {
  //const classes = useStyles();
  const [data, setData] = useState("");
  const handleInputChange = (event) => {
    //const { name, value } = event.target
    //setData({ ...data, [name]: value.toUpperCase() })
    setData(event.target.value);
  };

  return (
    <form
      //className={classes.root}
      onSubmit={(event) => {
        event.preventDefault();
        if (!data) return;
        props.addField(data);
        setData("");
      }}
    >
      <div>
        <FormControl //className={classes.formControl}
        >
          <TextField
            //inputProps={{ className: classes.input }}
            label="Nuevo Campo"
            variant="outlined"
            type="text"
            size="small"
            autoComplete="off"
            name="fieldData"
            value={data}
            onChange={handleInputChange}
            inputProps={{ style: { textTransform: "uppercase" } }}
          />
        </FormControl>
      </div>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        //className={classes.submit}
      >
        AÑADIR
      </Button>
    </form>
  );
};

export default AddUserForm;
