// src/components/PatientDashboard.js
import React, { useEffect, useRef, useMemo, useCallback } from "react";
import {
  Box,
  Typography,
  IconButton,
  Collapse,
  Stack,
  Divider,
} from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";

import { EncounterTable } from "@/features/encounters/index_legacy";
import { usePatientStore, useEncountersStore } from "@/state/zustand/ZustandStore";
import {
  EncountersVATable,
  EncountersETTable,
  ManifestRefraction,
} from "@/features/encounters/index_legacy";

/**
 * Wrap third-party / imported tables in React.memo once at module scope so
 * the wrapper isn't recreated on each render. This prevents child tables from
 * re-rendering unless their props actually change.
 */
const MemoEncounterTable = React.memo(EncounterTable);
const MemoEncountersVATable = React.memo(EncountersVATable);
const MemoManifestRefraction = React.memo(ManifestRefraction);

/** Small constants to avoid recreating the same objects each render */
const containerSx = { mt: 3, p: 2 };
//const sectionTitleSx = { display: "flex", alignItems: "center" };
const defaultOpenSections = {
  encounters: true,
  visualAcuity: false,
  eyeTest: false,
  refraction: false,
};

function PatientDashboardInner() {
  // -- patient selector (only what we need)
  const currentPatient = usePatientStore((s) => s.currentPatient);
  const patientId = currentPatient?.id ?? null;

  // -- separate selectors from encounters store to avoid returning a new object
  //    when unrelated parts of the store update
  const initPatientState = useEncountersStore((s) => s.initPatientState);
  const setSelectedEncounterId = useEncountersStore(
    (s) => s.setSelectedEncounterId
  );
  const encountersByPatient = useEncountersStore((s) => s.encountersByPatient);
  const toggleSection = useEncountersStore((s) => s.toggleSection);

  const initializedPatientRef = useRef(null);

  // initialize patient once per patientId
  useEffect(() => {
    if (!patientId) return;
    if (initializedPatientRef.current !== patientId) {
      initPatientState(patientId);
      initializedPatientRef.current = patientId;
    }
  }, [patientId, initPatientState]);

  // memoize patientState so it's stable unless the underlying object changes
  const patientState = useMemo(
    () => (patientId ? encountersByPatient?.[patientId] ?? null : null),
    [patientId, encountersByPatient]
  );

  const selectedEncounterId = patientState?.selectedEncounterId ?? null;

  // Make openSections stable and fallback to defaults when missing
  const openSections = useMemo(
    () => patientState?.openSections ?? defaultOpenSections,
    [patientState]
  );

  // stable handlers
  const handleSelectEncounter = useCallback(
    (encounter) => {
      if (!encounter || !patientId) return;
      setSelectedEncounterId(patientId, encounter.id);
    },
    [patientId, setSelectedEncounterId]
  );

  // pre-bind toggles for each section to avoid creating inline lambdas
  const toggleEncounters = useCallback(
    () => toggleSection(patientId, "encounters"),
    [patientId, toggleSection]
  );
  const toggleVisualAcuity = useCallback(
    () => toggleSection(patientId, "visualAcuity"),
    [patientId, toggleSection]
  );
  const toggleRefraction = useCallback(
    () => toggleSection(patientId, "refraction"),
    [patientId, toggleSection]
  );

  if (!currentPatient) {
    return (
      <Box sx={containerSx}>
        <Typography variant="h6" color="text.secondary">
          No patient selected.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Please select a patient from the list to view their records.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={containerSx}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h6">Encounters</Typography>
        {/* disableRipple reduces profiler noise from MuiTouchRipple if you don't need ripple UI */}
        <IconButton onClick={toggleEncounters} disableRipple>
          {openSections.encounters ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Stack>

      <Collapse in={openSections.encounters}>
        <Box sx={{ mt: 1 }}>
          <MemoEncounterTable
            patientId={patientId}
            selectedEncounterId={selectedEncounterId}
            onSelectEncounter={handleSelectEncounter}
          />
        </Box>
      </Collapse>

      <Divider sx={{ my: 3 }} />

      {selectedEncounterId && (
        <>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h6">Visual Acuity Records</Typography>
            <IconButton onClick={toggleVisualAcuity} disableRipple>
              {openSections.visualAcuity ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Stack>

          <Collapse in={openSections.visualAcuity}>
            <Box sx={{ mt: 1 }}>
              <MemoEncountersVATable encounterId={selectedEncounterId} />
            </Box>
          </Collapse>

          <Divider sx={{ my: 3 }} />
        </>
      )}

      {selectedEncounterId && (
        <>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h6">Manifest Refraction</Typography>
            <IconButton onClick={toggleRefraction} disableRipple>
              {openSections.refraction ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Stack>

          <Collapse in={openSections.refraction}>
            <Box sx={{ mt: 1 }}>
              <MemoManifestRefraction encounterId={selectedEncounterId} />
            </Box>
          </Collapse>
        </>
      )}
    </Box>
  );
}

/**
 * Wrap the exported component in React.memo so parent re-renders won't
 * unnecessarily re-render this dashboard if its props didn't change.
 */
export default React.memo(PatientDashboardInner);
