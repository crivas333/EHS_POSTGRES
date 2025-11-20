// src/pages/Login.jsx
import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, Navigate } from "react-router-dom";

import { myclient } from "@/graphqlClient/myclient";
import { SIGNIN, SIGNUP } from "@/graphqlClient/gqlQueries_sessions";
import { SignInForm } from "@/components/landing/SignInForm.jsx";
import { SignUpForm } from "@/components/landing/SignUpForm.jsx";

import { useAuthStore } from "@/state/zustand/ZustandStore"; 
import { notify } from "@/components/shared/notification/Notify";
import { useSession } from "@/hooks/useSession"; // ✅ session check



import LoadingScreen from "@/components/shared/ui/LoadingScreen"; // ✅ new import

// ----------------- GraphQL Helpers -----------------
async function signInHelper(data) {
  const res = await myclient.request(SIGNIN, data.variables);
  return res.signIn;
}

async function signUpHelper(data) {
  const res = await myclient.request(SIGNUP, data.variables);
  return res.signUp;
}

// ----------------- Component -----------------
export default function Login() {
  const [gotoSignUp, setGotoSignUp] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Zustand hooks
  const setIsAuth = useAuthStore((state) => state.setIsAuth);
  const setCurrentUser = useAuthStore((state) => state.setCurrentUser);

  // ✅ Session hook
  const { data: session, isLoading } = useSession();

  // ----------------- Mutations -----------------
  const signIn = useMutation({
    mutationFn: signInHelper,
    onSuccess: (data) => {
      setCurrentUser(data);
      setIsAuth(true);
      queryClient.setQueryData(["session"], data);

      notify("Login exitoso", "success");
      navigate("/Paciente");
    },
    onError: (error) => {
      console.error("Login failed:", error);
      notify("Error: Login fallado", "error");
    },
  });

  const signUp = useMutation({
    mutationFn: signUpHelper,
    onSuccess: (data) => {
      notify("Registración exitosa", "success");
      setGotoSignUp(false);
      console.log("Data - SignUp:", data);
    },
    onError: (error) => {
      console.error("SignUp failed:", error);
      notify("Error: Registración fallada", "error");
    },
  });

  // ----------------- Conditional Rendering -----------------
  if (isLoading) {
  return <LoadingScreen message="Cargando sesión…" />;
}

if (session) {
  return <Navigate to="/Paciente" replace />;
}

  // ----------------- JSX -----------------
  return (
    <div>
      {!gotoSignUp && <SignInForm click={() => setGotoSignUp(true)} signIn={signIn} />}
      {gotoSignUp && <SignUpForm click={() => setGotoSignUp(true)} signUp={signUp} />}
    </div>
  );
}

