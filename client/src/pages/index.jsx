import React from "react";
import { Route, Routes } from "react-router-dom";

import SiteLayout from "@/layouts/SiteLayout.jsx";
import PatientView from "./PatientView";
import PatientTablePage from "./PatientTablePage";
import CalendarView from "./CalendarView.jsx";
import AppoitmentsView from "./AppointmentsView.jsx";


//import ExamsView from "./ExamView.jsx";
import ReportsView from "./ReportsView.jsx";
import SystemConfigView from "./SystemConfigView.jsx";

import { useApplicationFields } from "@/features/systemConfig/hooks/useApplicationFields"; // ✅ new hook
//import OldDashboard from "@/components/dashboard/db1";
import PatientDashboardView from "./PatientDashboardView.jsx";

export default function Pages() {

  const { isLoading, isError, error } = useApplicationFields();
  if (isLoading) return <span>Loading config…</span>;
  if (isError) return <span>Error: {error.message}</span>;


  return (
    <SiteLayout>
      <Routes>
        <Route path="/Paciente" element={<PatientView />} />
         <Route path="/PacienteTabla" element={<PatientTablePage />} />
        <Route path="/Agendamiento" element={<CalendarView />} />
        <Route path="/Citas" element={<AppoitmentsView />} />
      
     
        <Route path="/PatientDashboard" element={<PatientDashboardView />} />
        <Route path="/Config" element={<SystemConfigView />} />
        <Route path="/Informes" element={<ReportsView />} />
      </Routes>
    </SiteLayout>
  );
}
// <Route path="/Patientashboard" element={<PatientDashboard />} />