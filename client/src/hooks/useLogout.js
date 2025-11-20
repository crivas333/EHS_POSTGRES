// hooks/useLogout.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { myclient } from "@/graphqlClient/myclient";
import { SIGNOUT } from "@/graphqlClient/gqlQueries_sessions";
import { useAuthStore } from "@/state/zustand/ZustandStore";
import { notify } from "@/components/shared/notification/Notify";

// GraphQL helper
async function signoutHelper() {
  const res = await myclient.request(SIGNOUT);
  return res.signOut;
}

// Custom hook
export function useLogout() {
  const queryClient = useQueryClient();
  const setIsAuth = useAuthStore((s) => s.setIsAuth);
  const setCurrentUser = useAuthStore((s) => s.setCurrentUser);

  return useMutation({
    mutationFn: signoutHelper,
    onSuccess: () => {
      // ✅ clear Zustand
      setCurrentUser(null);
      setIsAuth(false);

      // ✅ clear React Query session cache
      queryClient.setQueryData(["session"], null);

      notify("Sesión terminada", "success");
    },
    onError: (error) => {
      console.error("SignOut failed:", error);
      notify("Error al cerrar sesión", "error");
    },
  });
}
