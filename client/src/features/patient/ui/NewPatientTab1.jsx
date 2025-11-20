import React from "react";
import { styled } from "@mui/material/styles";
import ReusableControls from "@/components/shared/ui/reusableControls/ReusableControls";
import { patientDropdowns } from "@/utils/patientFormDefaults.js";

const MyBox = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  marginTop: theme.spacing(1),
  gap: theme.spacing(2),
}));

const NewPatientTab1 = ({ values, errors, onChange }) => {
  const { idTypes, genders } = patientDropdowns;

  return (
    <MyBox>
      <ReusableControls.CustomSelect
        name="idType"
        label="Tipo de Documento"
        value={values.idType}
        onChange={onChange}
        options={idTypes}
        error={errors.idType}
        variant="outlined"
      />

      <ReusableControls.CustomInput
        name="idTypeNo"
        label="Nro. Documento"
        value={values.idTypeNo}
        onChange={onChange}
        error={errors.idTypeNo}
        variant="outlined"
      />

      <ReusableControls.CustomInput
        name="firstName"
        label="Nombres"
        value={values.firstName}
        onChange={onChange}
        error={errors.firstName}
        variant="outlined"
      />

      <ReusableControls.CustomInput
        name="lastName"
        label="A. Paterno"
        value={values.lastName}
        onChange={onChange}
        error={errors.lastName}
        variant="outlined"
      />

      <ReusableControls.CustomInput
        name="lastName2"
        label="A. Materno"
        value={values.lastName2}
        onChange={onChange}
        error={errors.lastName2}
        variant="outlined"
      />

      <ReusableControls.PlainDatePicker
        name="birthDay"
        label="F. Nacimiento"
        value={values.birthDay || null} // MUI v7 requires null for empty values
        onChange={onChange}
        error={errors.birthDay}
        disableFuture={true}
        slots={{
          textField: (props) => <ReusableControls.CustomInput {...props} />,
        }}
      />

      <ReusableControls.CustomSelect
        name="gender"
        label="Género"
        value={values.gender}
        onChange={onChange}
        options={genders}
        error={errors.gender}
        variant="outlined"
      />
    </MyBox>
  );
};

export default NewPatientTab1;