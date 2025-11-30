// hooks/useApplicationFields.ts
import { useQuery } from "@tanstack/react-query";
import { myclient } from "@/services/graphql-client/myclient";
import { GET_APPLICATIONSFIELDS } from "@/services/graphql/systemconfig";

async function fetchApplicationFields() {
  const { getApplicationFields } = await myclient.request(GET_APPLICATIONSFIELDS);
  if (!getApplicationFields) throw new Error("Failed to fetch application fields");
  return getApplicationFields;
}

export const useApplicationFields = () => {
  return useQuery({
    queryKey: ["applicationFields"],
    queryFn: fetchApplicationFields,
    refetchOnWindowFocus: false, // keeps UX predictable
    //staleTime: 1000 * 60 * 5,    // optional: 5 min cache
    staleTime: Infinity,   // never stale
    cacheTime: Infinity,   // never garbage collected
  });
};
