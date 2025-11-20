// src/features/patient/hooks/usePatientSearch.js
import { useState, useCallback } from "react";
import { myclient } from "@/graphqlClient/myclient";
import { SEARCH_PATIENT_BY_NAME } from "@/features/patient/api/gqlQueries_patient";

export function usePatientSearch() {
  const PAGE_SIZE = 20;

  const [patients, setPatients] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [lastSearch, setLastSearch] = useState("");

  /**
   * Search patients by name
   * @param {string} searchTerm
   * @param {boolean} loadMore - fetch next page
   */
  const searchPatients = useCallback(
    async (searchTerm, loadMore = false) => {
      const trimmed = searchTerm.trim();
      if (trimmed.length < 2) return [];

      const queryPage = loadMore ? page : 1;

      try {
        const res = await myclient.request(SEARCH_PATIENT_BY_NAME, {
          searchTerm: trimmed,
          page: queryPage,
          limit: PAGE_SIZE,
        });

        const results = res?.searchPatientsByName ?? [];

        if (loadMore) {
          setPatients((prev) => [...prev, ...results]);
        } else {
          setPatients(results);
          setLastSearch(trimmed);
          setPage(2); // reset for next page
        }

        setHasMore(results.length === PAGE_SIZE);

        if (loadMore) setPage(queryPage + 1);

        return results;
      } catch (err) {
        console.error("❌ Error fetching patients by search term:", err);
        return [];
      }
    },
    [page]
  );

  const loadMorePatients = useCallback(() => {
    if (!hasMore) return [];
    return searchPatients(lastSearch, true);
  }, [hasMore, lastSearch, searchPatients]);

  return {
    patients,
    hasMore,
    searchPatients,
    loadMorePatients,
    setPatients, // expose setter if UI needs to reset
  };
}
