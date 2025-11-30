import { useQuery } from "@tanstack/react-query";
import { myclient } from "@/services/graphql-client/myclient";
import { GET_ENCOUNTERS_ET_BY_ENCOUNTER_ID } from "@/services/graphql/encounters";

/**
 * Hook to fetch one Manifest Refraction record (ET data) for an encounter
 */
export function useEncountersMR(encounterId) {
  return useQuery({
    queryKey: ["Encounter_ET", encounterId],
    queryFn: async () => {
      if (!encounterId) return null;

      const res = await myclient.request(GET_ENCOUNTERS_ET_BY_ENCOUNTER_ID, {
        id: parseInt(encounterId, 10),
      });

      console.log("👁️ useEncountersMR (ET) result:", res);

      // ✅ Return the first record only (object instead of array)
      return res?.getEncountersETByEncounterID?.[0] || null;
    },
    enabled: !!encounterId,
      // 🚀 Stop reloading children on every mount
    staleTime: Infinity,
    cacheTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
