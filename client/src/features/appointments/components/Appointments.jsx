import React, { useState, useEffect } from "react";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { startOfDay, endOfDay } from "date-fns";

import TableOfAppointments from "./TableOfAppointments";

import {
  ADD_APPOINTMENT,
  UPDATE_APPOINTMENT,
  DELETE_APPOINTMENT,
  GET_APPOINTMENTS_BY_TIMEFRAME,
} from "@/features/appointments/api/gqlQueries_appointments";
import { myclient } from "@/graphqlClient/myclient";
import { useSearchStore } from "@/state/zustand/ZustandStore";
//import { defaultEvent } from "@/helpers/defaultEvent";
import { statusToColor } from "@/features/appointments/statusToColor";



// ---------- Appointments Component ----------
export default function Appointments() {
  const searchDate = useSearchStore((state) => state.searchDate);
  const queryClient = useQueryClient();
  const [highlightedId, setHighlightedId] = useState(null);

  // ---------------- Queries ----------------
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["appointments", searchDate],
    queryFn: async () => {
      if (!searchDate) return [];
      try {
        const res = await myclient.request(GET_APPOINTMENTS_BY_TIMEFRAME, {
          start: startOfDay(new Date(searchDate)).toISOString(),
          end: endOfDay(new Date(searchDate)).toISOString(),
        });
        //console.log("Appointments-res: ",res);
        // DB times are already local (-05:00)
            // Compute color dynamically instead of using DB field
        return res.getAppointmentsByTimeframe?.map((a) => ({
          id: a.id,
          fullName: a.fullName || "",
          notRegistered: a.notRegistered || "",
          idTypeNo: a.idTypeNo || "",
          start: a.start || null,
          end: a.end || null,
          arriveTime: a.arriveTime || null,
          status: a.status || "",
          type: a.type || "",
          patientId: a.patientId || null,
          description: a.description || "",
          backgroundColor: statusToColor(a.status), // 🎨 computed locally
        }));
    } catch (err) {
      console.error("Error fetching appointments:", err);
      throw err;
    }
},

    
  });

  // ---------------- Auto-clear highlight ----------------
  useEffect(() => {
    if (highlightedId) {
      const timer = setTimeout(() => setHighlightedId(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [highlightedId]);

  // ---------------- Mutations Helper ----------------
  const useGqlMutation = (gql, key) =>
    useMutation({
      mutationFn: async (variables) => {
        const res = await myclient.request(gql, variables);
        return res[key];
      },
      onSuccess: () =>
        queryClient.invalidateQueries(["appointments", searchDate]),
    });

  const addAppointment = useGqlMutation(ADD_APPOINTMENT, "addAppointment");
  const updateAppointment = useGqlMutation(
    UPDATE_APPOINTMENT,
    "updateAppointment"
  );
  const deleteAppointment = useGqlMutation(
    DELETE_APPOINTMENT,
    "deleteAppointment"
  );

  // ---------------- Render ----------------
  if (isLoading)
    return (
      <div style={{ textAlign: "center", marginTop: "2rem" }}>Loading...</div>
    );
  if (isError)
    return (
      <div style={{ color: "red", textAlign: "center", marginTop: "2rem" }}>
        Error: {error.message}
      </div>
    );

  return (
    <div>
      <TableOfAppointments
        appointments={data}
        highlightedId={highlightedId}
        handleAddEvt={(val) => {
          const patientId = val.patientId ? Number(val.patientId) : null;
          const isRegistered = !!patientId;
          const input = {
          start: val.start ? new Date(val.start).toISOString() : null,
          end: val.end ? new Date(val.end).toISOString() : null,
          type: val.type || "CONSULTA",
          status: val.status || "PROGRAMADA",
          patientId,
          notRegistered: isRegistered ? "" : (val.notRegistered || "").toUpperCase(),
          description: val.description || "",
        };

        console.log("🟢 addAppointment input to GraphQL:", input);

        addAppointment.mutate({ input }, { onSuccess: (res) => setHighlightedId(res?.id || null) });
      }}

        handleEditEvt={(data) => {
      if (!data) return;
      const patientId = data.patientId ? Number(data.patientId) : null;
      const isRegistered = !!patientId;

      const input = {
        start: data.start ? new Date(data.start).toISOString() : null,
        end: data.end ? new Date(data.end).toISOString() : null,
        type: data.type || "CONSULTA",
        status: data.status || "PROGRAMADA",
        patientId,
        notRegistered: isRegistered ? "" : (data.notRegistered || "").toUpperCase(),
        description: data.description || "",
      };

      console.log("🟢 editAppointment input to GraphQL:", input);
      updateAppointment.mutate({ id: data.id, input });
    }} 
        
        handleDeleteEvt={(d) => deleteAppointment.mutate({ id: d.id })}
      />
    </div>
  );
}
