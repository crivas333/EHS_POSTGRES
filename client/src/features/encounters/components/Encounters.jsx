// src/components/encounters.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { myclient } from "@/graphqlClient/myclient";
import {
  GET_ENCOUNTERS_BY_PATIENT_ID,
  SAVE_ENCOUNTER,
} from "@/features/encounters/api/gqlQueries_encounters";
//import { UPDATE_APPOINTMENT_STATUS } from "@/features/encounters/api/gqlQueries_encounters";
import { useEncounterForm } from "@/hooks/useEncounterForm";
import ReusableControls from "@/components/shared/ui/reusableControls/ReusableControls";

export default function Encounter({ appointmentId, patientId }) {
  const queryClient = useQueryClient();
  const [encounterId, setEncounterId] = useState(null);

  // -------------- Default Form Values --------------
  const defaultValues = {
    encounterType: "CONSULTA MÉDICA",
    consultReason: "",
    sxSigns: "",
    adnexa: "",
    anteriorSeg: "",
    lens: "",
    fundus: "",
    dx: "",
    tx: "",
    tests: "",
    plan: "",
  };

  const { values, handleInputChange, handleSubmit, reset } = useEncounterForm(defaultValues);


  // -------------- Queries --------------
  const {
    data: encounterData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["encounter", appointmentId],
    queryFn: async () => {
      if (!appointmentId) return null;
      const res = await myclient.request(GET_ENCOUNTERS_BY_PATIENT_ID, {
        appointmentId,
      });
      return res?.getEncounterByAppointmentId || null;
    },
    enabled: !!appointmentId,
  });

  // -------------- Mutations --------------
  const saveEncounterMutation = useMutation({
    mutationFn: async (variables) => {
      const res = await myclient.request(SAVE_ENCOUNTER, variables);
      return res?.saveEncounter;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["encounter", appointmentId]);
    },
  });

  const updateAppointmentStatusMutation = useMutation({
    mutationFn: async (variables) => {
      const res = await myclient.request(SAVE_ENCOUNTER, variables);
      return res?.updateAppointmentStatus;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["appointments"]);
    },
  });

  // -------------- Populate Form --------------
useEffect(() => {
  if (encounterData) {
    setEncounterId(encounterData.id);
    reset(encounterData);
  } else {
    reset(defaultValues);
    setEncounterId(null);
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [encounterData]);

  // -------------- Submit Handler --------------
  const onSubmit = async (formData) => {
    try {
      const input = {
        ...formData,
        appointmentId,
        patientId,
        end: new Date().toISOString(),
      };

      console.log("🩺 Saving Encounter Input:", input);

      await saveEncounterMutation.mutateAsync({
        id: encounterId || 0,
        input,
      });

      await updateAppointmentStatusMutation.mutateAsync({
        id: appointmentId,
        status: "ATENDIDA",
      });

      alert("✅ Encuentro guardado y cita marcada como ATENDIDA");
      refetch();
    } catch (err) {
      console.error("❌ Error saving encounter:", err);
      alert("❌ Error al guardar el encuentro");
    }
  };

  // -------------- UI States --------------
  if (isLoading)
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );

  if (isError)
    return (
      <Typography color="error" align="center" mt={3}>
        Error: {error.message}
      </Typography>
    );

  // -------------- Render Form --------------
return (
  <Paper sx={{ p: 3, mt: 2, borderRadius: 3, boxShadow: 3 }}>
    <Typography variant="h6" gutterBottom>
      🩺 Formulario de Encuentro Clínico
    </Typography>

    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        {[
          { name: "encounterType", label: "Tipo de Encuentro" },
          { name: "consultReason", label: "Motivo de Consulta", rows: 2 },
          { name: "sxSigns", label: "Síntomas y Signos", rows: 3 },
          { name: "dx", label: "Diagnóstico", rows: 3 },
          { name: "tx", label: "Tratamiento", rows: 3 },
          { name: "plan", label: "Plan", rows: 2 },
        ].map((f) => (
          <Grid
            item
            xs={12}
            md={f.name === "dx" || f.name === "tx" ? 6 : 12}
            key={f.name}
          >
            <ReusableControls.CustomInput
              name={f.name}
              label={f.label}
              value={values[f.name] || ""}
              onChange={handleInputChange}
              variant="outlined"
            />
          </Grid>
        ))}

        <Grid item xs={12} display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={saveEncounterMutation.isPending}
          >
            {saveEncounterMutation.isPending ? (
              <CircularProgress size={24} />
            ) : (
              "💾 Guardar"
            )}
          </Button>
        </Grid>
      </Grid>
    </form>
  </Paper>
);

}