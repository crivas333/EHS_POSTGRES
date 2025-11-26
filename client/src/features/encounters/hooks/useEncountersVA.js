
import { useQuery } from "@tanstack/react-query";
import { myclient } from "@/graphqlClient/myclient";
import { GET_ENCOUNTERS_VA_BY_ENCOUNTER_ID } from "@/api/graphql/encounters";

export function useEncountersVA(encounterId) {
  return useQuery({
    queryKey: ["Encounter_va", encounterId],
    queryFn: async () => {
      const res = await myclient.request(GET_ENCOUNTERS_VA_BY_ENCOUNTER_ID, {
        id: parseInt(encounterId, 10),
      });
      console.log("👁️ useEncountersVA (VA) result:", res);
      //return res.getEncountersVAByEncounterID || [];
      return res;
    },
    enabled: !!encounterId, // only run if encounterId exists
      // 🚀 Stop reloading children on every mount
    staleTime: Infinity,
    cacheTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
