import React, { useEffect, useState } from "react";
import format from "date-fns/format";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import { useTheme } from "@mui/material/styles";
import { usePatientStore } from "@/state/zustand/ZustandStore";

// Helper to render multiline text (desktop multiline)
function NewlineText({ text }) {
  return text.split("\n").map((item, key) => (
    <span key={key}>
      {item}
      <br />
    </span>
  ));
}

export default function PatientSummary() {
  const theme = useTheme();
  const currPatient = usePatientStore((state) => state.currentPatient);
  const [textMobile, setTextMobile] = useState("");
  const [textPC, setTextPC] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  const handleWindowSizeChange = () => {
    setIsMobile(window.innerWidth <= 500);
  };

  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    setIsMobile(window.innerWidth <= 500);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  // Build patient summary
  useEffect(() => {
    let line1 = "";
    let line2 = "";
    let dob = "";
    let age = "";
    let sex = "";

    if (currPatient && Object.keys(currPatient).length > 0) {
      if (currPatient.birthDay) {
        dob = format(new Date(currPatient.birthDay), "dd/MM/yyyy");
        age = currPatient.age_years;
      }
      if (currPatient.sex === "MASCULINO") sex = "M";
      if (currPatient.sex === "FEMENINO") sex = "F";

      line1 = `${currPatient.id} - ${currPatient.lastName} ${currPatient.lastName2}, ${currPatient.firstName} - F.N.: ${dob} (${age}a) - Sexo: ${sex}`;
      setTextMobile(line1);

      line2 = `Historia: ${currPatient.id} - ${currPatient.lastName} ${currPatient.lastName2}, ${currPatient.firstName}
${currPatient.idType}: ${currPatient.idTypeNo}  -  F. Nacimiento: ${dob} (${age} años)  -  Sexo: ${currPatient.sex}
Teléfono: ${currPatient.phone1 || "-"}  -  Email: ${currPatient.email || "-"}`;
      setTextPC(line2);
    } else {
      setTextMobile("");
      setTextPC("");
    }
  }, [currPatient]);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        gap: 1,
        maxWidth: isMobile ? 200 : 350,
        overflow: "hidden",
      }}
    >
      {/* Avatar */}
      <Avatar
        sx={{ width: 28, height: 28, mt: "2px", bgcolor: theme.palette.primary.main }}
        alt={currPatient?.firstName || "Paciente"}
      >
        {currPatient?.firstName?.charAt(0) || "P"}
      </Avatar>

      {/* Text */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {isMobile ? (
          <Typography
            variant="body2"
            noWrap
            sx={{ lineHeight: 1.2, color: theme.palette.common.white }}
          >
            {textMobile}
          </Typography>
        ) : (
          <Typography
            variant="body2"
            sx={{
              lineHeight: 1.2,
              color: theme.palette.common.white,  // ✅ White font for dark AppBar
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            <NewlineText text={textPC} />
          </Typography>
        )}
      </Box>
    </Box>
  );
}
