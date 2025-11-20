import React from "react";
import { styled } from "@mui/material/styles";
import ReusableControls from "@/components/shared/ui/reusableControls/ReusableControls";
import { formatDate } from "@/utils/dateUtils";

const MyBox = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  marginTop: theme.spacing(1),
}));

export default function DisplayPatientTab1({ values = {} }) {
  return (
    <MyBox>
      <ReusableControls.CustomDisplay
        name="historyId"
        label="Nro de Historia"
        value={values.id}
        variant="outlined"
      />
      <ReusableControls.CustomDisplay
        name="age"
        label="Edad"
        value={values.ageYears}
        variant="outlined"
      />
      <ReusableControls.CustomDisplay
        name="idType"
        label="Tipo de Documento"
        value={values.idType}
        variant="outlined"
      />
      <ReusableControls.CustomDisplay
        name="idTypeNo"
        label="Nro. Documento"
        value={values.idTypeNo}
        variant="outlined"
      />
      <ReusableControls.CustomDisplay
        name="firstName"
        label="Nombres"
        value={values.firstName}
        variant="outlined"
      />
      <ReusableControls.CustomDisplay
        name="lastName"
        label="A. Paterno"
        value={values.lastName}
        variant="outlined"
      />
      <ReusableControls.CustomDisplay
        name="lastName2"
        label="A. Materno"
        value={values.lastName2}
        variant="outlined"
      />
      <ReusableControls.CustomDisplay
        name="birthDay"
        label="F. Nacimiento"
        value={values.birthDay ? formatDate(values.birthDay) : ""}
        variant="outlined"
      />
      <ReusableControls.CustomDisplay
        name="gender"
        label="Género"
        value={values.gender}
        variant="outlined"
      />
    </MyBox>
  );
}
