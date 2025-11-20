import React, { useEffect } from "react";
//import { makeStyles } from "@mui/styles";
//import CssBaseline from '@material-ui/core/CssBaseline'
//import Container from '@material-ui/core/Container'
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
//import purple from "@mui/material/colors/purple";
import { purple } from "@mui/material/colors";
//import FormControl from '@material-ui/core/FormControl'
//import ButtonGroup from "@material-ui/core/ButtonGroup";
import {
  useReusableForm,
  ReusableForm,
} from "@/components/reusableForms/useReusableForm.jsx";
import ReusableControls from "@/components/reusableForms/reusableControls/ReusableControls.js";
import { getFieldsDataCollection } from "@/services/configService.js";

// const useStyles = makeStyles((theme) => ({
//   root: {
//     "& .MuiTextField-root": {
//       margin: theme.spacing(1),
//       //width: '25ch',
//       width: "100%", // Fix IE 11 issue.
//     },
//   },
//   input: {
//     textTransform: "uppercase",
//     // autoComplete: 'off'
//   },
//   form: {
//     width: "100%", // Fix IE 11 issue.
//     marginTop: theme.spacing(1),
//     color: purple,
//   },
// }));

const EditExamForm = (props) => {
  //const classes = useStyles();

  const validate = (fieldValues = values) => {
    //console.log('EditExampleForm - validate')
    let temp = { ...errors };
    if ("firstName" in fieldValues)
      temp.firstName = fieldValues.firstName ? "" : "This field is required.";
    if ("examType" in fieldValues)
      temp.examType = fieldValues.examType ? "" : "This field is required.";

    setErrors({
      ...temp,
    });
    //console.log('EditExampleForm - validate - setErrors: ',errors)
    if (fieldValues === values) {
      //console.log('EditExampleForm - validate -output')
      return Object.values(temp).every((x) => x === "");
      //return Object.values(temp).every(x => x === "SOLICITADO")
    }
    //console.log('EditExampleForm - validate - fieldValues: ',fieldValues)
    //console.log('EditExampleForm - validate - values: ',values)
  };

  const {
    values,
    setValues,
    errors,
    setErrors,
    handleInputChange,
    //resetForm
  } = useReusableForm(props.editingRow, true, validate);

  useEffect(() => {
    setValues(props.editingRow);
    //console.log('setValues: ', props.editingRow)
  }, [setValues, props.editingRow]);
  // You can tell React to skip applying an effect if certain values haven’t changed between re-renders. [ props ]

  const handleSubmit = (event) => {
    event.preventDefault();
    //console.log('EditExamForm - handleSubmit - values',values)
    props.updateRow(values);
  };

  //<ReusableForm onSubmit={handleSubmit} >
  return (
    <ReusableForm onSubmit={handleSubmit}>
      <Grid
        container
        //className={classes.form}
      >
        <Grid item xs={12} sm={6}>
          <ReusableControls.CustomInput
            name="historyId"
            label="Nro de Historia"
            value={values.historyId}
          />
          <ReusableControls.CustomDateTimePicker
            name="examDateTime"
            label="Fecha de Examen"
            value={values.examDateTime}
            onChange={handleInputChange}
          />
          <ReusableControls.CustomSelect
            name="examType"
            label="Tipo de Examen"
            value={values.examType}
            onChange={handleInputChange}
            error={errors.examType}
            options={getFieldsDataCollection(
              props.fieldsSource,
              "examView",
              "examType"
            )}
          />
          <ReusableControls.CustomSelect
            name="examStatus"
            label="Estado de Examen"
            value={values.examStatus}
            onChange={handleInputChange}
            error={errors.examStatus}
            options={getFieldsDataCollection(
              props.fieldsSource,
              "examView",
              "examStatus"
            )}
          />
        </Grid>
        <Button
          type="submit"
          //fullWidth
          variant="contained"
          color="primary"
          //className={classes.button}
        >
          ENVIAR
        </Button>
      </Grid>
    </ReusableForm>
  );
};

export default EditExamForm;

/*
  <form 
      onSubmit={event => {
      event.preventDefault()
      props.updateRow(values)
      //console.log(data)
    }}
    
    >
*/
