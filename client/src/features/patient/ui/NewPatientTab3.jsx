import React from "react";
import { styled } from "@mui/material/styles";
import ReusableControls from "@/components/shared/ui/reusableControls/ReusableControls";
import {
  getMaritalCollection,
  getbloodTypeCollection,
} from "@/services/configService";

const MyBox = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  marginTop: theme.spacing(1),
  gap: theme.spacing(2),
}));

const NewPatientTab3 = ({ values, errors, onChange }) => {
  return (
    <MyBox>
      <ReusableControls.CustomSelect
        name="bloodType"
        label="Tipo de Sangre"
        value={values.bloodType}
        onChange={onChange}
        options={getbloodTypeCollection()}
        error={errors.bloodType}
        variant="outlined"
      />

      <ReusableControls.CustomSelect
        name="marital"
        label="Estado Civil"
        value={values.marital}
        onChange={onChange}
        options={getMaritalCollection()}
        error={errors.marital}
        variant="outlined"
      />

      <ReusableControls.CustomInput
        name="occupation"
        label="Ocupación"
        value={values.occupation}
        onChange={onChange}
        error={errors.occupation}
        variant="outlined"
      />

      <ReusableControls.CustomInput
        name="religion"
        label="Religión"
        value={values.religion}
        onChange={onChange}
        error={errors.religion}
        variant="outlined"
      />

      <ReusableControls.CustomInput
        name="referral"
        label="Referido por"
        value={values.referral}
        onChange={onChange}
        error={errors.referral}
        variant="outlined"
      />
    </MyBox>
  );
};
export default NewPatientTab3;