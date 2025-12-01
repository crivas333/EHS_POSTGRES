//src/app/router/LazyRoute.jsx
import { Suspense } from 'react';
import LoadingScreen from '@common/components/ui/feedback/LoadingScreen';
// eslint-disable-next-line no-unused-vars
const LazyRoute = ({ component: Component }) => (
  <Suspense fallback={<LoadingScreen message="Cargando..." />}>
    <Component />
  </Suspense>
);

export default LazyRoute;