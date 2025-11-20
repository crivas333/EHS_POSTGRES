import React, { useState, useRef } from "react";
import { Box, Grid, Button, ButtonGroup } from "@mui/material";

import AsyncSelectPaginate from "@/features/patient/components/patientSearch/AsyncSelectPatientSearch.jsx";
import {
  DisplayPatientTabForm,
  NewPatientTabForm,
  UpdatePatientTabForm,
  usePatientActions,
} from "@/features/patient";

import { usePatientStore } from "@/state/zustand/ZustandStore";

const SEARCH = 0;
const CREATE = 1;
const UPDATE = 2;

export default function PatientView() {
  const currentPatient = usePatientStore((state) => state.currentPatient);
  const setCurrentPatient = usePatientStore((state) => state.setCurrentPatient);

  const selectRef = useRef();
  const [action, setAction] = useState(SEARCH);

  const { createPatient, updatePatient, deletePatient } = usePatientActions();

  const handleCancel = () => setAction(SEARCH);

  const handleCreate = () => {
    setCurrentPatient(null);
    setAction(CREATE);
  };

  const handleUpdate = () => {
    if (!currentPatient?.id) return;
    setAction(UPDATE);
  };

  const handleDelete = () => {
    if (!currentPatient?.id) return;

    deletePatient.mutate({ variables: { id: currentPatient.id } });
    selectRef.current?.clearSelect?.();
    selectRef.current?.refreshOptions?.();
  };

  return (
    <Box sx={{ flexDirection: "row" }}>
      <Grid container direction="column" spacing={2}>
        {/* Patient Search */}
        <Grid item>
          <AsyncSelectPaginate ref={selectRef} />
        </Grid>

        {/* Actions */}
        <Grid item>
          <ButtonGroup size="small" variant="contained">
            <Button
              color="primary"
              disabled={action === UPDATE}
              onClick={handleCreate}
            >
              CREAR PACIENTE
            </Button>

            <Button
              color="primary"
              disabled={action === CREATE || !currentPatient?.id}
              onClick={handleUpdate}
            >
              ACTUALIZAR PACIENTE
            </Button>

            <Button
              color="secondary"
              disabled={action !== SEARCH || !currentPatient?.id}
              onClick={handleDelete}
            >
              BORRAR PACIENTE
            </Button>
          </ButtonGroup>
        </Grid>

        {/* Forms */}
        <Grid item>
          {action === SEARCH && <DisplayPatientTabForm />}
          {action === CREATE && (
            <NewPatientTabForm createPatient={createPatient} handleCancel={handleCancel} />
          )}
          {action === UPDATE && (
            <UpdatePatientTabForm updatePatient={updatePatient} handleCancel={handleCancel} />
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
