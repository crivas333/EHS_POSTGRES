import React, { useState } from "react";
import { Container, Box, Tabs, Tab, Button } from "@mui/material";

export default function PatientTabFormLayout({ tabs, onSubmit, handleCancel, activeTab = 0, readOnly = false, submitLabel = "Guardar" }) {
  const [tabIndex, setTabIndex] = useState(activeTab);

  const handleTabChange = (_, newValue) => setTabIndex(newValue);

  return (
    <Container>
      <form onSubmit={onSubmit}>
        <Tabs value={tabIndex} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
          {tabs.map((t, i) => <Tab key={i} label={t.label} />)}
        </Tabs>

        <Box mt={2}>
          {tabs[tabIndex]?.component}
        </Box>

        <Box mt={2} sx={{ display: "flex", gap: 1 }}>
          {!readOnly && <Button type="submit" variant="contained" color="primary">{submitLabel}</Button>}
          {handleCancel && <Button variant="outlined" color="secondary" onClick={handleCancel}>Cancelar</Button>}
        </Box>
      </form>
    </Container>
  );
}
