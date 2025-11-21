// src/features/patient/hooks/useAdvancedPatientSearch.js
import { useState, useCallback } from "react";
import { myclient } from "@/graphqlClient/myclient";
//import { SEARCH_PATIENTS_ADVANCED } from "@/features/patient/api/gqlQueries_patient";
import { SEARCH_PATIENT_BY_NAME } from "@/features/patient/api/gqlQueries_patient";

const PAGE_SIZE = 25;

export function useAdvancedPatientSearch() {
  const [patients, setPatients] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [lastCriteria, setLastCriteria] = useState({});

  const searchPatients = useCallback(
    async (criteria = {}, loadMore = false) => {
      const { lastName = "", firstName = "", dob = "" } = criteria;

      // If all empty → clear
      if (!lastName.trim() && !firstName.trim() && !dob.trim()) {
        setPatients([]);
        setHasMore(false);
        return [];
      }

      const queryPage = loadMore ? page : 1;

      try {
        const res = await myclient.request(SEARCH_PATIENT_BY_NAME, {
          lastName: lastName.trim() || null,
          firstName: firstName.trim() || null,
          dob: dob.trim() || null,
          page: queryPage,
          limit: PAGE_SIZE,
        });

        const { items, hasMore: serverHasMore } = res.searchPatientsAdvanced;

        if (loadMore) {
          setPatients((prev) => [...prev, ...items]);
        } else {
          setPatients(items);
          setLastCriteria(criteria);
          setPage(2);
        }

        setHasMore(serverHasMore && items.length === PAGE_SIZE);
        if (loadMore) setPage((p) => p + 1);

        return items;
      } catch (err) {
        console.error("Error advanced patient search:", err);
        return [];
      }
    },
    [page]
  );

  const loadMore = useCallback(() => {
    if (!hasMore) return;
    return searchPatients(lastCriteria, true);
  }, [hasMore, lastCriteria, searchPatients]);

  const reset = () => {
    setPatients([]);
    setHasMore(false);
    setPage(1);
    setLastCriteria({});
  };

  return {
    patients,
    hasMore,
    searchPatients,
    loadMore,
    reset,
  };
}