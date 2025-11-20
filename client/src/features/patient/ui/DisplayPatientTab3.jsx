
import React from "react";
import { styled } from "@mui/material/styles";
import ReusableControls from "@/components/shared/ui/reusableControls/ReusableControls";

const MyBox = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  marginTop: theme.spacing(1),
}));


export default function DisplayPatientTab3({ values = {} }) {
  return (
    <MyBox>
      <ReusableControls.CustomInput
        name="bloodType"
        label="Tipo de Sangre"
        value={values.bloodType}
        variant="outlined"
        readOnly
      />
      <ReusableControls.CustomInput
        name="marital"
        label="Estado Civil"
        value={values.marital}
        variant="outlined"
        readOnly
      />
      <ReusableControls.CustomInput
        name="occupation"
        label="Ocupación"
        value={values.occupation}
        variant="outlined"
        readOnly
      />
      <ReusableControls.CustomInput
        name="religion"
        label="Religión"
        value={values.religion}
        variant="outlined"
        readOnly
      />
      <ReusableControls.CustomInput
        name="referral"
        label="Referido por"
        value={values.referral}
        variant="outlined"
        readOnly
      />
    </MyBox>
  );
}

