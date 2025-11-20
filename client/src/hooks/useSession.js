// hooks/useSession.ts
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { myclient } from "@/graphqlClient/myclient.js";
import { IS_THERE_OPEN_SESSION } from "@/graphqlClient/gqlQueries_sessions.js";
import { ClientError } from "graphql-request";
import { useAuthStore } from "@/state/zustand/ZustandStore";

export async function fetchSession() {
  try {
    const res = await myclient.request(IS_THERE_OPEN_SESSION);
    return res?.openSession ?? null;
  } catch (err) {
    if (err instanceof ClientError) {
      console.error("GraphQL errors:", err.response.errors);
    } else {
      console.error("Network/unexpected error:", err);
    }
    return null; // treat errors as no session
  }
}

export const useSession = () => {
  const { setIsAuth, setCurrentUser } = useAuthStore();

  const query = useQuery({
    queryKey: ["session"],
    queryFn: fetchSession,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      setCurrentUser(query.data);
      setIsAuth(true);
    } else if (query.isFetched) {
      setCurrentUser(null);
      setIsAuth(false);
    }
  }, [query.isSuccess, query.isFetched, query.data, setCurrentUser, setIsAuth]);

  return query;
};
