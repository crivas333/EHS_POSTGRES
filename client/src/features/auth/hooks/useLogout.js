// client/src/hooks/useLogout.js — FINAL VERSION
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { myclient } from "@services/graphql-client/myclient";
import { LOGOUT } from "@services/graphql/auth";
import { useAuthStore } from "@app/store/auth-store";
import { notify } from "@common/components/ui/feedback/notification/Notify";

const logoutHelper = async () => {
  await myclient.request(LOGOUT);
};

export function useLogout() {
  const navigate = useNavigate();
  const { logout } = useAuthStore(); // Changed from setAuth to logout

  return useMutation({
    mutationFn: logoutHelper,
    onSuccess: () => {
      // Clear all authentication data
      localStorage.removeItem("access_token");
      localStorage.removeItem("auth-storage"); // Clear persisted Zustand state
      myclient.setHeader("Authorization", "");
      
      // Clear refresh token cookie
      document.cookie = "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=" + window.location.hostname;
      
      // Use the correct logout method from auth store
      logout();
      
      notify("Sesión cerrada", "success");
      
      // Redirect to login page
      navigate("/login");
    },
    onError: () => {
      // Even if the API call fails, clear local auth state
      localStorage.removeItem("access_token");
      localStorage.removeItem("auth-storage");
      myclient.setHeader("Authorization", "");
      document.cookie = "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=" + window.location.hostname;
      
      // Use the correct logout method
      logout();
      
      notify("Sesión cerrada", "info");
      
      // Redirect to login page
      navigate("/login");
    },
  });
}