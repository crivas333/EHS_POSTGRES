import { useMutation } from "@tanstack/react-query";
import { myclient } from "@/graphqlClient/myclient";
import { UPDATE_PATIENT } from "../api/gqlQueries_patient";
import { usePatientStore } from "@/state/zustand/ZustandStore";
import { notify } from "@/components/shared/notification/Notify";

async function updateHelper({ variables }) {
  const res = await myclient.request(UPDATE_PATIENT, variables);
  return res.updatePatient;
}

export function useUpdatePatient() {
  const setCurrentPatient = usePatientStore((s) => s.setCurrentPatient);

  return useMutation({
    mutationFn: updateHelper,
    onSuccess: (patient) => {
      setCurrentPatient(patient);
      notify("Datos de Paciente actualizados", "success");
    },
    onError: () => {
      notify("Error: Datos de Paciente NO actualizados", "fail");
    },
  });
}
