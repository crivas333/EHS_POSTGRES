// src/features/patient/hooks/usePatientActions.js
import { useMutation } from "@tanstack/react-query";
import { myclient } from "@/graphqlClient/myclient";
import {
  CREATE_PATIENT,
  UPDATE_PATIENT,
  DELETE_PATIENT,
} from "@/features/patient/api/gqlQueries_patient";
import { usePatientStore } from "@/state/zustand/ZustandStore";
import { notify } from "@/components/shared/notification/Notify";

export function usePatientActions() {
  const setCurrentPatient = usePatientStore((state) => state.setCurrentPatient);

  const createPatient = useMutation({
    mutationFn: async ({ variables }) => {
      const res = await myclient.request(CREATE_PATIENT, variables);
      return res.createPatient;
    },
    onSuccess: (data) => {
      setCurrentPatient(data);
      notify("Paciente creado con éxito", "success");
    },
    onError: (err) => {
      console.error(err);
      notify("Error al crear paciente", "error");
    },
  });

  const updatePatient = useMutation({
    mutationFn: async ({ variables }) => {
      const res = await myclient.request(UPDATE_PATIENT, variables);
      return res.updatePatient;
    },
    onSuccess: (data) => {
      setCurrentPatient(data);
      notify("Paciente actualizado con éxito", "success");
    },
    onError: (err) => {
      console.error(err);
      notify("Error al actualizar paciente", "error");
    },
  });

  const deletePatient = useMutation({
    mutationFn: async ({ variables }) => {
      const res = await myclient.request(DELETE_PATIENT, variables);
      return res.deletePatient;
    },
    onSuccess: () => {
      setCurrentPatient(null);
      notify("Paciente eliminado", "success");
    },
    onError: (err) => {
      console.error(err);
      notify("Error al eliminar paciente", "error");
    },
  });

  return { createPatient, updatePatient, deletePatient };
}
