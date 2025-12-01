// src/features/patient/hooks/useCreatePatient.js
import { useMutation } from "@tanstack/react-query";
import { myclient } from "@/services/graphql-client/myclient";
import { CREATE_PATIENT } from "../../../services/graphql/patient";
import { usePatientStore } from "@/state/zustand/ZustandStore";
import { notify } from "@/common/components/ui/feedback/notification/Notify";

// ------------------------------
// GraphQL Helper
// ------------------------------
async function createHelper({ variables }) {
  const res = await myclient.request(CREATE_PATIENT, variables);
  return res.createPatient;
}

// ------------------------------
// Hook
// ------------------------------
export function useCreatePatient() {
  const setCurrentPatient = usePatientStore((s) => s.setCurrentPatient);

  return useMutation({
    mutationFn: createHelper,
    onSuccess: (patient) => {
      setCurrentPatient(patient);
      notify("Datos de Paciente ingresados", "success");
    },
    onError: (err) => {
      notify("Error: Datos de Paciente NO ingresados", "fail");
      console.error(err);
    },
  });
}
