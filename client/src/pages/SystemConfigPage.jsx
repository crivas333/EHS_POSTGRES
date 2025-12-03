import React from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { myclient } from "@/services/graphql-client/myclient";
import {
  GET_APPLICATIONSFIELDS,
  ADD_APPLICATIONFIELDS,
  UPDATE_APPLICATIONFIELDS,
  DELETE_APPLICATIONFIELDS,
} from "@/services/graphql/systemconfig";

import EncounterControl from "@/features/system-config/components/EncounterControl";
import ExamControl from "@/features/system-config/components/ExamControl";
import AppointmentControl from "@/features/system-config/components/AppointmentControl";
//import { useTheme } from "@mui/material/styles"; // ✅ Access theme

export default function SystemConfig() {
  //const theme = useTheme(); // 👈 access the theme here
  const queryClient = useQueryClient();

  const addField = useMutation({
    mutationFn: (data) => myclient.request(ADD_APPLICATIONFIELDS, data),
    onSuccess: () => queryClient.invalidateQueries(["applicationFields"]),
  });

  const updateField = useMutation({
    mutationFn: (data) => myclient.request(UPDATE_APPLICATIONFIELDS, data),
    onSuccess: () => queryClient.invalidateQueries(["applicationFields"]),
  });

  const deleteField = useMutation({
    mutationFn: (data) => myclient.request(DELETE_APPLICATIONFIELDS, data),
    onSuccess: () => queryClient.invalidateQueries(["applicationFields"]),
  });

  const data = queryClient.getQueryData(["applicationFields"]);

  return (
    <Grid
      container
      spacing={2}
      sx={{
        //backgroundColor: theme.palette.background.default, // 🟢 use theme colors
        //color: theme.palette.text.primary,
        p: 2,
      }}
    >
      {[AppointmentControl, EncounterControl, ExamControl].map((Control, idx) => (
        <Grid key={idx} size={{ xs: 12 }}>
          <Paper
            variant="outlined"
            sx={{
              //borderColor: theme.palette.primary.main,
              //backgroundColor: theme.palette.background.paper,
              p: 2,
            }}
          >
            <Control
              applicationFields={data}
              addField={addField}
              updateField={updateField}
              deleteField={deleteField}
            />
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}


