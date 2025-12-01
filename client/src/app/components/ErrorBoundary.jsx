// client/src/app/components/ErrorBoundary.jsx
import React from "react";
import { Button, Box, Typography, Container } from "@mui/material";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    // You can add logging to Sentry, LogRocket, etc. here in the future
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="sm" sx={{ mt: 8, textAlign: "center" }}>
          <Box
            sx={{
              p: 4,
              borderRadius: 2,
              bgcolor: "error.main",
              color: "white",
              boxShadow: 3,
            }}
          >
            <ReportProblemOutlinedIcon sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
              ¡Oops! Algo salió mal
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
              Ocurrió un error inesperado en la interfaz.
            </Typography>

            {this.state.error && (
              <Box
                component="pre"
                sx={{
                  bgcolor: "rgba(0,0,0,0.3)",
                  p: 2,
                  borderRadius: 1,
                  textAlign: "left",
                  fontSize: "0.8rem",
                  maxHeight: 200,
                  overflow: "auto",
                  mb: 3,
                }}
              >
                {this.state.error.toString()}
              </Box>
            )}

            <Button
              variant="contained"
              size="large"
              onClick={this.handleRetry}
              sx={{
                bgcolor: "white",
                color: "error.main",
                "&:hover": { bgcolor: "grey.100" },
              }}
            >
              Reintentar
            </Button>

            <Typography variant="body2" sx={{ mt: 3, opacity: 0.8 }}>
              Si el problema persiste, contacta al soporte técnico.
            </Typography>
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;