//client/src/App.jsx
import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "@app/store/auth-store";
import { protectedRoutes } from "@app/router/routes";
import ProtectedRoute from "@app/router/ProtectedRoute";
//import SiteLayout from "@/layouts/SiteLayout"; // ← Use SiteLayout instead of AppLayout
import AppLayout from "@/app/layouts/AppLayout"; // ← Use SiteLayout instead of AppLayout
import AuthLayout from "@app/layouts/AuthLayout";
import LoadingScreen from "@common/components/ui/feedback/LoadingScreen";
import ErrorBoundary1 from '@app/components/ErrorBoundary';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      hasError: true,
      error: error,
      errorInfo: errorInfo
    });
    console.error("ErrorBoundary caught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          backgroundColor: '#ffebee',
          color: '#c62828',
          padding: '20px',
          border: '2px solid #c62828',
          margin: '20px'
        }}>
          <h2>🚨 Something went wrong!</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo.componentStack}
          </details>
          <button 
            onClick={() => this.setState({ hasError: false })}
            style={{ marginTop: '10px', padding: '5px 10px' }}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  const { isAuth, isLoading, initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  if (isLoading) {
    return <LoadingScreen message="Inicializando aplicación..." />;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={
            isAuth ? <Navigate to="/paciente" replace /> : <AuthLayout />
          } 
        />
        
        {/* Protected Routes with SiteLayout */}
        <Route 
          path="/" 
          element={
           <ProtectedRoute>
            <ErrorBoundary>
              <AppLayout />
            </ErrorBoundary>
          </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/paciente" replace />} />
          {protectedRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
          <Route path="*" element={<Navigate to="/paciente" replace />} />
        </Route>

        {/* Global fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;