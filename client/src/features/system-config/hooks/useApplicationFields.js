// src/hooks/useApplicationFields.js
import { useQuery } from "@tanstack/react-query";
import { myclient } from "@/services/graphql-client/myclient";
import { GET_APPLICATIONSFIELDS } from "@/services/graphql/systemconfig";

async function fetchApplicationFields() {
  const { getApplicationFields } = await myclient.request(GET_APPLICATIONSFIELDS);
  if (!getApplicationFields) {
    throw new Error("No se pudieron cargar los campos de la aplicación");
  }
  return getApplicationFields;
}

export const useApplicationFields = () => {
  return useQuery({
    queryKey: ["applicationFields"],
    queryFn: fetchApplicationFields,
    refetchOnWindowFocus: false,
    staleTime: Infinity,     // nunca vuelve a pedir
    cacheTime: Infinity,     // nunca se borra
    retry: 2,
    retryDelay: 1000,
  });
};