//src/app/layouts/AuthLayout.jsx
import React from 'react';
import Login from '@/pages/LoginPage'; // Import Login directly

export default function AuthLayout() {
  console.log("🔍 AuthLayout: Rendering");
  
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      backgroundColor: 'red', // Keep it visible for now
      padding: '20px'
    }}>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '40px', 
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        textAlign: 'center',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h1 style={{ color: '#1976d2', marginBottom: '20px' }}>EHS System</h1>
        <p style={{ marginBottom: '20px' }}>Sistema de Gestión Médica</p>
        
        {/* Render Login directly instead of Outlet */}
        <Login />
      </div>
    </div>
  );
}