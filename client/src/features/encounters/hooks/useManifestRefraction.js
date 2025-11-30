// client/src/modules/encounters/hooks/useManifestRefraction.js
import { useQuery } from "@tanstack/react-query";
import { myclient } from "@/services/graphql-client/myclient";
//import { GET_MANIFEST_REFRACTION_BY_APPOINTMENT_ID } from "@/graphqlClient/gqlQueries_refraction";
//import { GET_ENCOUNTERS_ET_BY_APPOINTMENT_ID } from "@/graphqlClient/gqlQueries_encounters"; // make sure you define this GQL query
//import { GET_ENCOUNTERS_ET_BY_APPOINTMENT_ID } from "@/features/encounters"; 
import { GET_ENCOUNTERS_ET_BY_ENCOUNTER_ID } from "@/services/graphql/encounters";


/**
 * Hook: useManifestRefraction
 * Fetches Manifest Refraction data by appointmentId.
 */
export function useManifestRefraction(encounterId) {
  return useQuery({
    queryKey: ["ManifestRefraction", encounterId],
    queryFn: async () => {
      const data = await myclient.request(
        GET_ENCOUNTERS_ET_BY_ENCOUNTER_ID,
        { id: encounterId }
      );
      console.log("🩺 ManifestRefraction data:", data);
      return data;
    },
    enabled: !!encounterId,
  });
}
