// client/src/modules/encounters/hooks/useManifestRefraction.js
import { useQuery } from "@tanstack/react-query";
import { myclient } from "@/graphqlClient/myclient";
//import { GET_MANIFEST_REFRACTION_BY_APPOINTMENT_ID } from "@/graphqlClient/gqlQueries_refraction";
import { GET_ENCOUNTERS_ET_BY_APPOINTMENT_ID } from "@/graphqlClient/gqlQueries_encounters"; // make sure you define this GQL query


/**
 * Hook: useManifestRefraction
 * Fetches Manifest Refraction data by appointmentId.
 */
export function useManifestRefraction(appointmentId) {
  return useQuery({
    queryKey: ["ManifestRefraction", appointmentId],
    queryFn: async () => {
      const data = await myclient.request(
        GET_ENCOUNTERS_ET_BY_APPOINTMENT_ID,
        { id: appointmentId }
      );
      console.log("🩺 ManifestRefraction data:", data);
      return data;
    },
    enabled: !!appointmentId,
  });
}
