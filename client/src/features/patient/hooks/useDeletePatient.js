import { useMutation } from "@tanstack/react-query";
import { myclient } from "@/services/graphql-client/myclient";
import { DELETE_PATIENT } from "../../../services/graphql/patient";
import { usePatientStore } from "@/state/zustand/ZustandStore";
import { notify } from "@/common/components/ui/feedback/notification/Notify";

async function deleteHelper({ variables }) {
  const res = await myclient.request(DELETE_PATIENT, variables);
  return res.deletePatient;
}

export function useDeletePatient() {
  const setCurrentPatient = usePatientStore((s) => s.setCurrentPatient);

  return useMutation({
    mutationFn: deleteHelper,
    onSuccess: () => {
      setCurrentPatient(null);
      notify("Datos de Paciente borrados", "success");
    },
    onError: () => {
      notify("Error: Datos de Paciente NO borrados", "fail");
    },
  });
}
