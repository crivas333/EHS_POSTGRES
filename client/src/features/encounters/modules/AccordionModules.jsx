// src/features/encounters/modules/AccordionModules.jsx
import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Card,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import EncountersModule from "./EncountersModule";
import VisualAcuityModule from "./VisualAcuityModule";
import RefractionModule from "./RefractionModule";

import { useEncounterUIStore } from "@/state/zustand/ZustandStore";

export default function AccordionModules({ encounterId, patientId, isMobile }) {
  const { activeModule, openAccordions, toggleAccordion } = useEncounterUIStore();

  const modules = [
    {
      key: "encounters",
      title: "Encounters",
      Component: EncountersModule,
      props: { patientId, isMobile },
    },
    {
      key: "visualAcuity",
      title: "Visual Acuity",
      Component: VisualAcuityModule,
      props: { encounterId, isMobile },
    },
    {
      key: "refraction",
      title: "Refraction",
      Component: RefractionModule,
      props: { encounterId, isMobile },
    },
    {
      key: "module4",
      title: "Module 4 (Coming Soon)",
      Component: () => <Typography>Module 4 Placeholder</Typography>,
      props: {},
    },
    {
      key: "module5",
      title: "Module 5 (Coming Soon)",
      Component: () => <Typography>Module 5 Placeholder</Typography>,
      props: {},
    },
    {
      key: "module6",
      title: "Module 6 (Coming Soon)",
      Component: () => <Typography>Module 6 Placeholder</Typography>,
      props: {},
    },
  ];

  return (
    <Box>
      {modules.map((m) => (
        <Card
          key={m.key}
          id={`accordion-${m.key}`}
          sx={{
            mb: 2,
            border:
              activeModule === m.key
                ? "2px solid var(--mui-palette-primary-main)"
                : "1px solid #ddd",
            transition: "border-color 0.2s ease-in-out",
          }}
        >
          <Accordion
            expanded={openAccordions.includes(m.key)}
            onChange={() => toggleAccordion(m.key)}
            sx={{ "&.Mui-expanded": { margin: 0 } }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1" fontWeight={600}>
                {m.title}
              </Typography>
            </AccordionSummary>

            <AccordionDetails>
              <m.Component {...m.props} />
            </AccordionDetails>
          </Accordion>
        </Card>
      ))}
    </Box>
  );
}
