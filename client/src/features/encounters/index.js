// src/features/encounters/index.js - OPTION 1: EXPLICIT EXPORTS

// Core Tables and Components
export { default as EncounterTable } from "./components/EncounterTable";
export { default as EncountersVATable } from "./components/EncountersVATable";
export { default as EncountersETTable } from "./components/EncountersETTable";
export { default as Refraction } from "./components/Refraction";
export { default as ManifestRefraction } from "./components/ManifestRefraction";

// Hooks
export * from "./hooks/useEncounters";
export * from "./hooks/useEncountersVA";
export * from "./hooks/useEncountersET";
export * from "./hooks/useEncountersMR";
export * from "./hooks/useManifestRefraction";
export * from "./hooks/useSaveRefraction";

// Dashboard and Modules
export { default as EncounterDashboard } from "./dashboard/EncounterDashboard";
export { default as EncounterLayout } from "./layout/EncounterLayout";
export { default as EncountersModule } from "./modules/EncountersModule";
export { default as VisualAcuityModule } from "./modules/VisualAcuityModule";
export { default as RefractionModule } from "./modules/RefractionModule";

// Config
export { MODULE_CONFIG } from "./config/moduleConfig";

// API Queries
export * from "../../services/graphql/encounters";

// Legacy/Additional Components (if needed)
export { default as Encounters } from "./components/Encounters";
export { default as DashboardTextField } from "./components/DashboardTextField";
export { default as EncounterRow } from "./components/EncounterRow";
export { default as PaginationActions } from "../../common/components/shared/table/PaginationActions";
export { default as TableFiltered } from "./components/TableFiltered";