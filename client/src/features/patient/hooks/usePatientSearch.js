// src/features/patient/hooks/usePatientSearch.js
import { useState, useCallback } from "react";
import { myclient } from "@/graphqlClient/myclient";
import { SEARCH_PATIENT_BY_NAME } from "@/api/graphql/patient";

export function usePatientSearch() {
  const PAGE_SIZE = 20;

  const [patients, setPatients] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  /**
   * Perform search
   */
  const searchPatients = useCallback(async (searchTerm, page = 1) => {
    const trimmed = searchTerm.trim();

    if (trimmed.length < 2) return [];

    try {
      const res = await myclient.request(SEARCH_PATIENT_BY_NAME, {
        searchTerm: trimmed,
        page,
        limit: PAGE_SIZE,
      });

      const results = res?.searchPatientsByName ?? [];

      setPatients(results);
      setHasMore(results.length === PAGE_SIZE);

      return results;
    } catch (err) {
      console.error("❌ Error searching patients:", err);
      return [];
    }
  }, []);

  return {
    patients,
    hasMore,
    searchPatients,
  };
}
