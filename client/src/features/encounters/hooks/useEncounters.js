import { useQuery } from "@tanstack/react-query";
import { myclient } from "@/graphqlClient/myclient";
import { GET_ENCOUNTERS_BY_PATIENT_ID } from "@/features/encounters/api/gqlQueries_encounters";

/* ============================================================================
   Optimized React Query Hook: Fetch encounters for a patient
   ============================================================================ */
export function useEncounters(patientId, options = {}) {
  const {
    staleTime = Infinity,
    cacheTime = 1000 * 60 * 60, // 1 hour
    refetchOnMount = false,
    refetchOnWindowFocus = false,
    refetchOnReconnect = false,
  } = options;

  return useQuery({
    queryKey: ["encounters", patientId],
    queryFn: async () => {
      if (!patientId) return [];
      const data = await myclient.request(GET_ENCOUNTERS_BY_PATIENT_ID, {
        id: patientId,
      });
      return data?.getEncountersByPatientID ?? [];
    },
    enabled: !!patientId,
    staleTime,
    cacheTime,
    refetchOnMount,
    refetchOnWindowFocus,
    refetchOnReconnect,
  });
}
