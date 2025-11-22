// src/features/patient/hooks/useSearchCombined.js
import { useState, useCallback, useRef } from "react";
import { myclient } from "@/graphqlClient/myclient";
import { SEARCH_COMBINED } from "@/features/patient/api/gqlQueries_patient";

const PAGE_SIZE = 25;

// Cache global: "lastName|lastName2|firstName|mode" → { pageIndex → { patients, totalCount } }
const searchCache = new Map();

export function useSearchCombined() {
  const [patients, setPatients] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Guardamos el último criterio válido para invalidar cache
  const lastCriteriaKey = useRef(null);

  const searchCombined = useCallback(
    async ({ lastName = "", lastName2 = "", firstName = "", mode = "start", pageIndex = 0 }) => {
      const criteriaKey = `${lastName.trim()}|${lastName2.trim()}|${firstName.trim()}|${mode}`;

      // Si cambian los filtros → invalidamos todo el cache
      if (lastCriteriaKey.current !== criteriaKey) {
        searchCache.clear();
        lastCriteriaKey.current = criteriaKey;
      }

      const cacheKey = `${criteriaKey}|${pageIndex}`;

      // ¿Ya tenemos esta página cacheada?
      if (searchCache.has(cacheKey)) {
        const cached = searchCache.get(cacheKey);
        setPatients(cached.patients);
        setTotalCount(cached.totalCount);
        return cached;
      }

      // Si no hay criterios válidos → limpiar sin llamar al backend
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
          page: pageIndex + 1,
          limit: PAGE_SIZE,
        });

        const results = res?.searchCombined || [];

        // Estimación conservadora del total
        const estimatedTotal =
          pageIndex * PAGE_SIZE + results.length + (results.length === PAGE_SIZE ? PAGE_SIZE : 0);

        // Guardamos en cache
        searchCache.set(cacheKey, {
          patients: results,
          totalCount: estimatedTotal,
        });

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

  // Para forzar limpieza del cache (ej. al logout)
  const invalidateCache = useCallback(() => {
    searchCache.clear();
    lastCriteriaKey.current = null;
  }, []);

  return {
    patients,
    totalCount,
    isLoading,
    searchCombined,
    invalidateCache,
  };
}