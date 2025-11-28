// client/src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import { gql } from "graphql-request";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Navigate } from "react-router-dom";

import { myclient } from "@/graphqlClient/myclient";
import { LOGIN, REGISTER } from "@/api/graphql/sessions";
import { SignInForm } from "@/components/landing/SignInForm.jsx";
import { SignUpForm } from "@/components/landing/SignUpForm.jsx";

import { useAuthStore } from "@/state/zustand/ZustandStore";
import { notify } from "@/components/shared/notification/Notify";

// Helper to set JWT in graphql-request headers
const setAuthToken = (token) => {
  myclient.setHeader("Authorization", token ? `Bearer ${token}` : "");
};

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const { setCurrentUser, setIsAuth } = useAuthStore();

  // Check if already logged in via access token
  const token = localStorage.getItem("access_token");
  if (token) {
    setAuthToken(token);
  }

  const loginMutation = useMutation({
    mutationFn: ({ email, password }) =>
      myclient.request(LOGIN, { email, password }),
    onSuccess: ({ login }) => {
      const { user, accessToken } = login;
      localStorage.setItem("access_token", accessToken);
      setAuthToken(accessToken);
      setCurrentUser(user);
      setIsAuth(true);
      notify("Login exitoso", "success");
      navigate("/Paciente");
    },
    onError: (error) => {
      const message = error?.response?.errors?.[0]?.message || "Login fallido";
      notify(message, "error");
    },
  });

  const registerMutation = useMutation({
    mutationFn: ({ input }) => myclient.request(REGISTER, { input }),
    onSuccess: ({ register }) => {
      const { user, accessToken } = register;
      localStorage.setItem("access_token", accessToken);
      setAuthToken(accessToken);
      setCurrentUser(user);
      setIsAuth(true);
      notify("Registro exitoso", "success");
      setIsSignUp(false);
      navigate("/Paciente");
    },
    onError: (error) => {
      const message = error?.response?.errors?.[0]?.message || "Registro fallido";
      notify(message, "error");
    },
  });

  // Auto-refresh token on mount if needed
  useEffect(() => {
    const refreshIfNeeded = async () => {
      if (!token) return;
      try {
        const { refreshToken } = await myclient.request(gql`
          mutation { refreshToken { accessToken } }
        `);
        localStorage.setItem("access_token", refreshToken.accessToken);
        setAuthToken(refreshToken.accessToken);
      } catch {
        localStorage.removeItem("access_token");
        setAuthToken("");
      }
    };
    refreshIfNeeded();
  }, [token]);

  // If already logged in → redirect
  if (token && useAuthStore.getState().isAuth) {
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