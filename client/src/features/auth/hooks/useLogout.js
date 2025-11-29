// client/src/hooks/useLogout.js — FINAL VERSION
import { useMutation } from "@tanstack/react-query";
import { myclient } from "@/graphqlClient/myclient";
import { LOGOUT } from "@/api/graphql/auth";
import { useAuthStore } from "@/state/zustand/ZustandStore";
import { notify } from "@/components/shared/notification/Notify";

const logoutHelper = async () => {
  await myclient.request(LOGOUT);
};

export function useLogout() {
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: logoutHelper,
    onSuccess: () => {
      // CLEAR EVERYTHING — INCLUDING THE STALE REFRESH TOKEN COOKIE
      localStorage.removeItem("access_token");
      myclient.setHeader("Authorization", "");
      // THIS LINE KILLS THE COOKIE IMMEDIATELY
      document.cookie = "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=" + window.location.hostname;
      setAuth(null, null);
      notify("Sesión cerrada", "success");
    },
    onError: () => {
      document.cookie = "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=" + window.location.hostname;
      setAuth(null, null);
      notify("Sesión cerrada", "info");
    },
  });
}