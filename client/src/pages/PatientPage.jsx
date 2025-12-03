
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
//import { useApplicationFields } from "@/features/system-config/hooks/useApplicationFields";
//import LoadingScreen from "@common/components/ui/feedback/LoadingScreen";

const SEARCH = 0;
const CREATE = 1;
const UPDATE = 2;

export default function PatientView() {
 
  const currentPatient = usePatientStore((state) => state.currentPatient);
  const setCurrentPatient = usePatientStore((state) => state.setCurrentPatient);
  const selectRef = useRef();
  const [action, setAction] = useState(SEARCH);
  // NEW: cache invalidation token for AsyncPaginate
  const [paginationCacheKey, setPaginationCacheKey] = useState(0);
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
    // 🚀 NEW: Force AsyncPaginate to clear internal caches
    setPaginationCacheKey(k => k + 1);
    setCurrentPatient(null);
    setAction(SEARCH);
  };


  return (
    <Box sx={{ flexDirection: "row" }}>
      <Grid container direction="column" spacing={2}>
        {/* Patient Search */}
        <Grid >
          <AsyncSelectPaginate
            ref={selectRef}
            cacheUniqs={[paginationCacheKey]}   // 👈 NEW
          />
        </Grid>
        {/* Actions */}
        <Grid >
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
              disabled={!currentPatient?.id}
              onClick={handleDelete}
            >
              BORRAR PACIENTE
            </Button>
          </ButtonGroup>
        </Grid>

        {/* Forms */}
        <Grid>
          {action === SEARCH && <DisplayPatientTabForm />}
          {action === CREATE && (
            <NewPatientTabForm
              createPatient={createPatient}
              handleCancel={handleCancel}
            />
          )}
          {action === UPDATE && (
            <UpdatePatientTabForm
              updatePatient={updatePatient}
              handleCancel={handleCancel}
            />
          )}
        </Grid>
      </Grid>
    </Box>
  );
}