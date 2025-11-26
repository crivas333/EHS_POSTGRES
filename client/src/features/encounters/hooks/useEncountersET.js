import { useQuery } from "@tanstack/react-query";
import { myclient } from "@/graphqlClient/myclient";
import { GET_ENCOUNTERS_ET_BY_ENCOUNTER_ID } from "@/api/graphql/encounters";

export function useEncountersET(encounterId) {
  return useQuery({
    queryKey: ["Encounter_et", encounterId],
    queryFn: async () => {
      const res = await myclient.request(GET_ENCOUNTERS_ET_BY_ENCOUNTER_ID, {
        id: parseInt(encounterId, 10),
      });
      console.log("👁️ Encounter_ET res:", res);
      //return res.getEncountersETByEncounterID || [];
      return res;
    },
    enabled: !!encounterId,
  });
}
