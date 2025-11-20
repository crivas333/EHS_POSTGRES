import React from "react";
//import { makeStyles } from "@mui/styles";

import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";

import {
  useReusableForm,
  ReusableForm,
} from "@/components/reusableForms/useReusableForm.jsx";
import ReusableControls from "@/components/reusableForms/reusableControls/ReusableControls.js";
import { getFieldsDataCollection } from "@/services/configService.js";
//import {getExamFieldsDataCollection} from '@/services/configService'
//import { GlobalContext } from '@/context/GlobalState'

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
//   paper: {
//     marginTop: theme.spacing(1),
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//   },

//   form: {
//     width: "100%", // Fix IE 11 issue.
//     marginTop: theme.spacing(1),
//   },
//   button: {
//     marginTop: "10px",
//   },
// }));

const AddExamForm = (props) => {
  //const classes = useStyles();
  //const {applicationFields } = useContext(GlobalContext)

  const initialFValues = {
    historyId: props.patientInfo.historyId || "",
    //historyId: props.patientInfo.historyId,
    examDateTime: new Date(),
    examType: "EXAMEN_GENERAL",
    examStatus: "SOLICITADO",
    patient: null,
  };
  //console.log(applicationFields)
  //console.log(applicationFields.filter(item => (item.fieldView ==='examView'&&item.fieldType==='examType')))

  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ("firstName" in fieldValues)
      temp.firstName = fieldValues.firstName ? "" : "This field is required.";
    if ("lastName" in fieldValues)
      temp.lastName = fieldValues.lastName ? "" : "This field is required.";

    setErrors({
      ...temp,
    });

    if (fieldValues === values)
      return Object.values(temp).every((x) => x === "");
  };

  const {
    values,
    //setValues,
    errors,
    setErrors,
    handleInputChange,
    //resetForm
  } = useReusableForm(initialFValues, true, validate);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("AddExamForm: ", values);
    if (!values) return;
    props.addRow(values);
    //setData('')
  };

  //	className={classes.form}
  return (
    <ReusableForm onSubmit={handleSubmit}>
      <Grid container>
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

export default AddExamForm;

/*
options={ applicationFields.filter(item => (item.fieldView ==='examView'&&item.fieldType==='examType'))
						.map((item) => ({
							id: item.id,
							field: item.fieldData
						}))	}

*/

/*
		<ReusableControls.CustomSelect
						name='examType'
						label='Tipo de Examen'
						value={values.examType}
						onChange={handleInputChange}
						//options={getExamFieldsDataCollection()}
						//options={ props.fielsSource.filter(item => (item.fieldView ==='examView'&&item.fieldType==='Tipo de Examen'))}
						//options={ applicationFields.filter(item => (item.fieldView ==='examView'&&item.fieldType==='examType'))}
					
						error={errors.examType}
					/>
						<ReusableControls.CustomSelect
						name='examStatus'
						label='Estado del Examen'
						value={values.examStatus}
						onChange={handleInputChange}
						//options={getExamStatusCollection()}
						error={errors.examStatus}
					/>

*/

/*
		<ReusableControls.CustomSelect
						name='examType'
						label='Tipo de Examen'
						value={values.examType}
						onChange={handleInputChange}
						//options={getExamTypeCollection()}
						error={errors.examType}
					/>
*/

/*
	<FormControl
				className={classes.formControl}
			>
				<TextField
					inputProps={{ className: classes.input }}
					label='Campo'
					variant='outlined' 
					type="text" 
					size='small'
					autoComplete='off'
					name='fieldData' 
					value={data.fieldData} 
					onChange={handleInputChange} />
					
			</FormControl>
*/
/*
		<form
			className={classes.root}
			onSubmit={event => {
				event.preventDefault()
				if (!data.fieldData) return
				//console.log(data)
				//props.addField(data)
				props.addRow(data)
				setData(initialFormState)
			}}
		>
			<div>
			<FormControl
				className={classes.formControl}
			>
				<TextField
					inputProps={{ className: classes.input }}
					label='Campo'
					variant='outlined' 
					type="text" 
					size='small'
					autoComplete='off'
					name='fieldData' 
					value={data.fieldData} 
					onChange={handleInputChange} />
					
			</FormControl>
			</div>
			<Button
				type='submit'
				variant='contained'
				color='primary'
				className={classes.submit}
			>
				AÑADIR
			</Button>
		</form>

*/
