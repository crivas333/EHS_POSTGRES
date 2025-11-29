// client/src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Navigate } from "react-router-dom";

import { myclient } from "@/graphqlClient/myclient";
import { LOGIN, REGISTER, REFRESH_TOKEN } from "@/api/graphql/auth";
import { SignInForm } from "@/features/auth/components/SignInForm.jsx";
import { SignUpForm } from "@/features/auth/components/SignUpForm.jsx";

import { useAuthStore } from "@/state/zustand/ZustandStore";
import { notify } from "@/components/shared/notification/Notify";

const setAuthToken = (token) => {
  myclient.setHeader("Authorization", token ? `Bearer ${token}` : "");
};

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  // THIS IS THE CORRECT WAY — get setAuth from Zustand
  const setAuth = useAuthStore((state) => state.setAuth);

  const savedToken = localStorage.getItem("access_token");
  if (savedToken) setAuthToken(savedToken);

  const loginMutation = useMutation({
    mutationFn: ({ email, password }) =>
      myclient.request(LOGIN, { email, password }),
    onSuccess: ({ login }) => {
      const { user, accessToken } = login;
      localStorage.setItem("access_token", accessToken);
      setAuthToken(accessToken);

      // ONE LINE TO RULE THEM ALL — THIS IS THE WINNER
      setAuth(user, accessToken);

      notify("Login exitoso", "success");
      navigate("/Paciente");
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
      setAuth(user, accessToken);
      notify("Cuenta creada con éxito", "success");
      setIsSignUp(false);
      navigate("/Paciente");
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

  // Redirect if authenticated
  const isAuth = useAuthStore((state) => state.isAuth);
  if (savedToken && isAuth) {
    return <Navigate to="/Paciente" replace />;
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