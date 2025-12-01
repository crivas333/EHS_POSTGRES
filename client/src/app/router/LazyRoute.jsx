// src/app/router/LazyRoute.jsx
import React, { Suspense } from "react";
import LoadingScreen from "@common/components/ui/feedback/LoadingScreen";

const LazyRoute = ({ component: LazyComponent }) => (
  <Suspense fallback={<LoadingScreen message="Cargando..." />}>
    <LazyComponent />
  </Suspense>
);

export default LazyRoute;