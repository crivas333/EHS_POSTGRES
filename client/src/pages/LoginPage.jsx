// client/src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Navigate } from "react-router-dom";

// Updated imports to match new architecture
import { myclient } from "@services/graphql-client/myclient";
import { LOGIN, REGISTER, REFRESH_TOKEN } from "@services/graphql/auth";
import { SignInForm } from "@auth/components/SignInForm";
import { SignUpForm } from "@auth/components/SignUpForm.jsx";
import { useAuthStore } from "@app/store/auth-store";
import { notify } from "@common/components/ui/feedback/notification/Notify";

const setAuthToken = (token) => {
  myclient.setHeader("Authorization", token ? `Bearer ${token}` : "");
};

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  // Use the correct method names from your new auth store
  const { login, isAuth } = useAuthStore();

  const savedToken = localStorage.getItem("access_token");
  if (savedToken) setAuthToken(savedToken);

  const loginMutation = useMutation({
    mutationFn: ({ email, password }) =>
      myclient.request(LOGIN, { email, password }),
    onSuccess: ({ login: loginData }) => {
      const { user, accessToken } = loginData;
      localStorage.setItem("access_token", accessToken);
      setAuthToken(accessToken);

      // Use the correct method from your new auth store
      login(user, accessToken); // Changed from setAuth to login

      notify("Login exitoso", "success");
      navigate("/paciente"); // Use lowercase path
    },
    onError: (err) => {
      const msg = err?.response?.errors?.[0]?.message || "Credenciales inválidas";
      notify(msg, "error");
    },
  });

  const registerMutation = useMutation({
    mutationFn: ({ input }) => myclient.request(REGISTER, { input }),
    onSuccess: ({ register }) => {
      const { user, accessToken } = register;
      localStorage.setItem("access_token", accessToken);
      setAuthToken(accessToken);
      
      // Use the correct method from your new auth store
      login(user, accessToken); // Changed from setAuth to login
      
      notify("Cuenta creada con éxito", "success");
      setIsSignUp(false);
      navigate("/paciente"); // Use lowercase path
    },
    onError: (err) => {
      const msg = err?.response?.errors?.[0]?.message || "Error al registrarse";
      notify(msg, "error");
    },
  });

  useEffect(() => {
    if (!savedToken) return;
    const refresh = async () => {
      try {
        const { refreshToken } = await myclient.request(REFRESH_TOKEN);
        localStorage.setItem("access_token", refreshToken.accessToken);
        setAuthToken(refreshToken.accessToken);
      } catch {
        localStorage.removeItem("access_token");
        setAuthToken("");
      }
    };
    refresh();
  }, [savedToken]);

  // Redirect if authenticated - use lowercase path
  if (savedToken && isAuth) {
    return <Navigate to="/paciente" replace />; // Changed to lowercase
  }

  return (
    <div>
      {!isSignUp ? (
        <SignInForm
          onSubmit={(data) => loginMutation.mutate(data)}
          isLoading={loginMutation.isPending}
          onToggle={() => setIsSignUp(true)}
        />
      ) : (
        <SignUpForm
          onSubmit={(data) => registerMutation.mutate({ input: data })}
          isLoading={registerMutation.isPending}
          onToggle={() => setIsSignUp(false)}
        />
      )}
    </div>
  );
}