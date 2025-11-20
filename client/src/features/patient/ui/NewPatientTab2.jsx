import React from "react";
import { styled } from "@mui/material/styles";
import ReusableControls from "@/components/shared/ui/reusableControls/ReusableControls";

const MyBox = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  marginTop: theme.spacing(1),
  gap: theme.spacing(2),
}));

const NewPatientTab2 = ({ values, errors, onChange }) => {
  return (
    <MyBox>
      <ReusableControls.CustomInput
        name="phone1"
        label="Teléfono 1"
        value={values.phone1}
        onChange={onChange}
        error={errors.phone1}
        variant="outlined"
      />

      <ReusableControls.CustomInput
        name="phone2"
        label="Teléfono 2"
        value={values.phone2}
        onChange={onChange}
        error={errors.phone2}
        variant="outlined"
      />

      <ReusableControls.CustomInput
        name="email"
        label="Correo electrónico"
        value={values.email}
        onChange={onChange}
        error={errors.email}
        variant="outlined"
      />

      <ReusableControls.CustomInputMulti
        name="address"
        label="Dirección"
        value={values.address}
        onChange={onChange}
        error={errors.address}
        maxRows={3} // ✅ updated from MUI v7 maxLines → maxRows
        variant="outlined"
      />

      <ReusableControls.CustomInput
        name="gName"
        label="Acompañante - Nombre"
        value={values.gName}
        onChange={onChange}
        error={errors.gName}
        variant="outlined"
      />

      <ReusableControls.CustomInput
        name="gPhone1"
        label="Acompañante - Teléfono 1"
        value={values.gPhone1}
        onChange={onChange}
        error={errors.gPhone1}
        variant="outlined"
      />

      <ReusableControls.CustomInput
        name="gPhone2"
        label="Acompañante - Teléfono 2"
        value={values.gPhone2}
        onChange={onChange}
        error={errors.gPhone2}
        variant="outlined"
      />

      <ReusableControls.CustomInput
        name="gRelation"
        label="Acompañante - Relación"
        value={values.gRelation}
        onChange={onChange}
        error={errors.gRelation}
        variant="outlined"
      />
    </MyBox>
  );
};

export default NewPatientTab2;