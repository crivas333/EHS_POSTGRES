import React from "react";
import { styled } from "@mui/material/styles";
import ReusableControls from "@/components/shared/ui/reusableControls/ReusableControls";

const MyBox = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  marginTop: theme.spacing(1),
}));

export default function DisplayPatientTab2({ values = {} }) {
  return (
    <MyBox>
      <ReusableControls.CustomInput
        name="phone1"
        label="Teléfono 1"
        value={values.phone1}
        variant="outlined"
        readOnly
      />
      <ReusableControls.CustomInput
        name="phone2"
        label="Teléfono 2"
        value={values.phone2}
        variant="outlined"
        readOnly
      />
      <ReusableControls.CustomInput
        name="email"
        label="Email"
        value={values.email}
        variant="outlined"
        readOnly
      />
      <ReusableControls.CustomInputMulti
        name="address"
        label="Dirección"
        value={values.address}
        maxLines={3}
        variant="outlined"
        readOnly
      />
      <ReusableControls.CustomInput
        name="gName"
        label="Acompañante - Nombre"
        value={values.gName}
        variant="outlined"
        readOnly
      />
      <ReusableControls.CustomInput
        name="gPhone1"
        label="Acompañante - Teléfono 1"
        value={values.gPhone1}
        variant="outlined"
        readOnly
      />
      <ReusableControls.CustomInput
        name="gPhone2"
        label="Acompañante - Teléfono 2"
        value={values.gPhone2}
        variant="outlined"
        readOnly
      />
      <ReusableControls.CustomInput
        name="gRelation"
        label="Acompañante - Relación"
        value={values.gRelation}
        variant="outlined"
        readOnly
      />
    </MyBox>
  );
}
