// src/features/patient/hooks/useSearchCombined.js
import { useState, useCallback } from "react";
import { myclient } from "@/graphqlClient/myclient";
import { SEARCH_COMBINED } from "@/features/patient/api/gqlQueries_patient";

const PAGE_SIZE = 25;

export function useSearchCombined() {
  const [patients, setPatients] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const searchCombined = useCallback(
    async ({ lastName = "", lastName2 = "", firstName = "", mode = "start", pageIndex = 0 }) => {
      if (!lastName.trim() && !lastName2.trim() && !firstName.trim()) {
        setPatients([]);
        setTotalCount(0);
        return { patients: [], totalCount: 0 };
      }

      setIsLoading(true);

      const applyPattern = (value) => {
        if (!value?.trim()) return null;
        return mode === "start" ? `${value.trim()}%` : `%${value.trim()}%`;
      };

      try {
        const res = await myclient.request(SEARCH_COMBINED, {
          lastName: applyPattern(lastName),
          lastName2: applyPattern(lastName2),
          firstName: applyPattern(firstName),
          page: pageIndex + 1, // TanStack Table es 0-based
          limit: PAGE_SIZE,
        });

        const results = res?.searchCombined || [];
        // Simulamos totalCount (si tu backend no lo devuelve, puedes contar o estimar)
        const estimatedTotal = pageIndex * PAGE_SIZE + results.length + (results.length === PAGE_SIZE ? 1 : 0);

        setPatients(results);
        setTotalCount(estimatedTotal);

        return { patients: results, totalCount: estimatedTotal };
      } catch (err) {
        console.error("searchCombined error:", err);
        setPatients([]);
        setTotalCount(0);
        return { patients: [], totalCount: 0 };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    patients,
    totalCount,
    isLoading,
    searchCombined,
  };
}