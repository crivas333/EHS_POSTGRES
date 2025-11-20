// client/src/modules/encounters/hooks/useSaveRefraction.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { myclient } from "@/graphqlClient/myclient";

// --- Define your mutation query ---
const SAVE_REFRACTION_MUTATION = `
  mutation SaveManifestRefraction($input: ManifestRefractionInput!) {
    saveManifestRefraction(input: $input) {
      id
      appointmentId
      odSph1
      odCyl1
      odAx1
      odAdd1
      odAdd2
      odPrism
      odBase
      oiSph1
      oiCyl1
      oiAx1
      oiAdd1
      oiAdd2
      oiPrism
      oiBase
      refractionComments
    }
  }
`;

/**
 * Hook: useSaveRefraction
 * Saves (or updates) manifest refraction data for a given appointment.
 */
export function useSaveRefraction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["SaveManifestRefraction"],
    mutationFn: async (input) => {
      const data = await myclient.request(SAVE_REFRACTION_MUTATION, { input });
      console.log("💾 Saved ManifestRefraction:", data);
      return data.saveManifestRefraction;
    },
    onSuccess: (savedData) => {
      // ✅ Invalidate Eye Test query for the same appointment to refresh view
      if (savedData?.appointmentId) {
        queryClient.invalidateQueries(["Encounter_ET", savedData.appointmentId]);
      }
    },
    onError: (error) => {
      console.error("❌ Error saving ManifestRefraction:", error);
    },
  });
}
