// src/features/encounters/layout/EncounterSidebar.jsx
import React from "react";
import { List, ListItemButton, ListItemText } from "@mui/material";
import { useEncounterUIStore } from "@/state/zustand/ZustandStore";

export default function EncounterSidebar() {
  const { activeModule, openAccordions, toggleAccordion, setActiveModule } =
    useEncounterUIStore();

  const modules = [
    { key: "encounters", label: "Encounters" },
    { key: "visualAcuity", label: "Visual Acuity" },
    { key: "refraction", label: "Refraction" },
    { key: "module4", label: "Module 4" },
    { key: "module5", label: "Module 5" },
    { key: "module6", label: "Module 6" },
  ];

  const scrollToAccordion = (key) => {
    const el = document.getElementById(`accordion-${key}`);
    if (el) {
      el.scrollIntoView({ 
        behavior: "smooth", 
        block: "start",
        inline: "nearest"
      });
    }
  };

  const handleClick = (key) => {
    console.log("Sidebar clicked:", key);
    
    // Set active module
    setActiveModule(key);

    // If accordion is not open, open it
    if (!openAccordions.includes(key)) {
      toggleAccordion(key);
    }

    // Scroll to the accordion with a small delay to ensure it's rendered
    setTimeout(() => {
      scrollToAccordion(key);
    }, 100);
  };

  return (
    <List>
      {modules.map((m) => (
        <ListItemButton
          key={m.key}
          selected={activeModule === m.key}
          onClick={() => handleClick(m.key)}
        >
          <ListItemText primary={m.label} />
        </ListItemButton>
      ))}
    </List>
  );
}
