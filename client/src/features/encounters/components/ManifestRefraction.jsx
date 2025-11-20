// src/components/ManifestRefraction.jsx
import React, { useEffect, memo } from "react";
import {
  Box,
  Typography,
  IconButton,
  Stack,
  Tooltip,
  CircularProgress,
  Alert,
  Button,
  useMediaQuery,
} from "@mui/material";
import { Visibility, Print, Close, Save } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

import DashboardTextField from "@/features/encounters/components/DashboardTextField.jsx";

import { useReusableFormGPT } from "@/hooks/useReusableFormGPT";
import { ReusableFormGPT } from "@/hooks/ReusableFormGPT";
import { validateManifestRefraction } from "@/utils/validatorsEyeTest";
import { useEncountersMR } from "@/features/encounters/hooks/useEncountersMR";

/**
 * Fully static ManifestRefraction form.
 *
 * NOTE: field names used here are the consistent indexed form:
 *   odSph1, odCyl1, odAx1, odPrism1, odBase1, addIntrm1, addRead1, odDnp1, pd1,
 *   oiSph1, oiCyl1, oiAx1, oiPrism1, oiBase1, oiDnp1,
 *   odSph2, ... pd2, ...
 *   odSph3, ... pd3, ...
 *
 * If your INITIAL_VALUES or API payload uses different keys (e.g. odPrism without index),
 * adapt INITIAL_VALUES or the hydration mapping in the useEffect below.
 */

const COLUMNS = ["Sph", "Cyl", "Axis", "Prism", "Base", "ADD 1", "ADD 2", "DNP", "DIP"];

const INITIAL_VALUES = {
  odSph1: "", odCyl1: "", odAx1: "", odPrism1: "", odBase1: "", addIntrm1: "", addRead1: "", odDnp1: "", pd1: "",
  oiSph1: "", oiCyl1: "", oiAx1: "", oiPrism1: "", oiBase1: "", oiDnp1: "",
  odSph2: "", odCyl2: "", odAx2: "", odPrism2: "", odBase2: "", odDnp2: "", pd2: "",
  oiSph2: "", oiCyl2: "", oiAx2: "", oiPrism2: "", oiBase2: "", oiDnp2: "",
  odSph3: "", odCyl3: "", odAx3: "", odPrism3: "", odBase3: "", odDnp3: "", pd3: "",
  oiSph3: "", oiCyl3: "", oiAx3: "", oiPrism3: "", oiBase3: "", oiDnp3: "",
};

function ManifestRefraction({ encounterId }) {
  const theme = useTheme();
  const small = useMediaQuery(theme.breakpoints.down("sm"));

  // Fetch from API
  const { data: apiData, isLoading: apiLoading, isError, error } = useEncountersMR(encounterId);

  // Form hook
  const form = useReusableFormGPT(INITIAL_VALUES, true, validateManifestRefraction);
  const { values, setValues, errors, handleInputChange, handleSubmit, resetForm } = form;

  // Hydrate from API (if apiData keys differ from the indexed keys above,
  // adapt this mapping here)
  useEffect(() => {
    if (!apiData) return;

    // If your API returns keys that already match our indexed names, this is fine.
    // Otherwise transform apiData -> indexed keys here.
    setValues((prev) => ({ ...prev, ...apiData }));
  }, [apiData, setValues]);

  if (apiLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Failed to load manifest refraction data: {error?.message || "Unknown error"}
      </Alert>
    );
  }

  const gridTemplateColumns = `50px repeat(9, ${small ? "55px" : "65px"})`;

  return (
    <Box
      sx={{
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        p: 1.5,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[1],
        overflowX: "auto",
      }}
    >
      {/* Header */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1, px: 0.5 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Tooltip title="Toggle Visibility">
            <IconButton size="small" sx={{ color: theme.palette.text.secondary }}>
              <Visibility fontSize="small" />
            </IconButton>
          </Tooltip>
          <Typography variant="dashboardFormHeader">Manifest Refraction</Typography>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center">
          <IconButton size="small">
            <Print fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={resetForm}>
            <Close fontSize="small" />
          </IconButton>
        </Stack>
      </Stack>

      {/* Form */}
      {/* Pass the handler reference, not the invoked result */}
      <ReusableFormGPT onSubmit={handleSubmit}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns,
            alignItems: "center",
            rowGap: theme.typography.form?.spacing?.rowGap || "4px",
            columnGap: theme.typography.form?.spacing?.columnGap || "3px",
            minWidth: "fit-content",
          }}
        >
          {/* Header row: first empty cell then column labels */}
          <Typography />
          {COLUMNS.map((col) => (
            <Typography
              key={col}
              variant="dashboardFormLabel"
              sx={{
                textAlign: "center",
                pb: 0.2,
                borderBottom: `1px solid ${theme.palette.divider}`,
                fontWeight: 600,
              }}
            >
              {col}
            </Typography>
          ))}

          {/* -------------------- OD #1 (includes ADD fields) -------------------- */}
          <Typography variant="dashboardFormLabel" sx={{ textAlign: "right", pr: 1, whiteSpace: "nowrap" }}>
            OD#1:
          </Typography>

          <DashboardTextField
            name="odSph1"
            value={values.odSph1 || ""}
            onChange={handleInputChange}
            error={!!errors.odSph1}
            helperText={errors.odSph1 || " "}
            small={small}
          />
          <DashboardTextField
            name="odCyl1"
            value={values.odCyl1 || ""}
            onChange={handleInputChange}
            error={!!errors.odCyl1}
            helperText={errors.odCyl1 || " "}
            small={small}
          />
          <DashboardTextField
            name="odAx1"
            value={values.odAx1 || ""}
            onChange={handleInputChange}
            error={!!errors.odAx1}
            helperText={errors.odAx1 || " "}
            small={small}
          />
          <DashboardTextField
            name="odPrism1"
            value={values.odPrism1 || ""}
            onChange={handleInputChange}
            error={!!errors.odPrism1}
            helperText={errors.odPrism1 || " "}
            small={small}
          />
          <DashboardTextField
            name="odBase1"
            value={values.odBase1 || ""}
            onChange={handleInputChange}
            error={!!errors.odBase1}
            helperText={errors.odBase1 || " "}
            small={small}
          />
          <DashboardTextField
            name="addIntrm1"
            value={values.addIntrm1 || ""}
            onChange={handleInputChange}
            error={!!errors.addIntrm1}
            helperText={errors.addIntrm1 || " "}
            small={small}
          />
          <DashboardTextField
            name="addRead1"
            value={values.addRead1 || ""}
            onChange={handleInputChange}
            error={!!errors.addRead1}
            helperText={errors.addRead1 || " "}
            small={small}
          />
          <DashboardTextField
            name="odDnp1"
            value={values.odDnp1 || ""}
            onChange={handleInputChange}
            error={!!errors.odDnp1}
            helperText={errors.odDnp1 || " "}
            small={small}
          />
          {/* PD / DIP field for row 1 (editable) */}
          <DashboardTextField
            name="pd1"
            value={values.pd1 || ""}
            onChange={handleInputChange}
            error={!!errors.pd1}
            helperText={errors.pd1 || " "}
            small={small}
            pd
          />

          {/* -------------------- OI #1 (includes ADD fields) -------------------- */}
          <Typography variant="dashboardFormLabel" sx={{ textAlign: "right", pr: 1, whiteSpace: "nowrap" }}>
            OI#1:
          </Typography>

          <DashboardTextField
            name="oiSph1"
            value={values.oiSph1 || ""}
            onChange={handleInputChange}
            error={!!errors.oiSph1}
            helperText={errors.oiSph1 || " "}
            small={small}
          />
          <DashboardTextField
            name="oiCyl1"
            value={values.oiCyl1 || ""}
            onChange={handleInputChange}
            error={!!errors.oiCyl1}
            helperText={errors.oiCyl1 || " "}
            small={small}
          />
          <DashboardTextField
            name="oiAx1"
            value={values.oiAx1 || ""}
            onChange={handleInputChange}
            error={!!errors.oiAx1}
            helperText={errors.oiAx1 || " "}
            small={small}
          />
          <DashboardTextField
            name="oiPrism1"
            value={values.oiPrism1 || ""}
            onChange={handleInputChange}
            error={!!errors.oiPrism1}
            helperText={errors.oiPrism1 || " "}
            small={small}
          />
          <DashboardTextField
            name="oiBase1"
            value={values.oiBase1 || ""}
            onChange={handleInputChange}
            error={!!errors.oiBase1}
            helperText={errors.oiBase1 || " "}
            small={small}
          />
          <DashboardTextField
            name="addIntrm1" /* shared field name as in layout; keep same input if intended */
            value={values.addIntrm1 || ""}
            onChange={handleInputChange}
            error={!!errors.addIntrm1}
            helperText={errors.addIntrm1 || " "}
            small={small}
          />
          <DashboardTextField
            name="addRead1"
            value={values.addRead1 || ""}
            onChange={handleInputChange}
            error={!!errors.addRead1}
            helperText={errors.addRead1 || " "}
            small={small}
          />
          <DashboardTextField
            name="oiDnp1"
            value={values.oiDnp1 || ""}
            onChange={handleInputChange}
            error={!!errors.oiDnp1}
            helperText={errors.oiDnp1 || " "}
            small={small}
          />
          {/* Empty DIP cell for OI row (aligned under DIP column) */}
          <Box />

          {/* -------------------- OD #2 (no ADD fields) -------------------- */}
          <Typography variant="dashboardFormLabel" sx={{ textAlign: "right", pr: 1, whiteSpace: "nowrap" }}>
            OD#2:
          </Typography>

          <DashboardTextField
            name="odSph2"
            value={values.odSph2 || ""}
            onChange={handleInputChange}
            error={!!errors.odSph2}
            helperText={errors.odSph2 || " "}
            small={small}
          />
          <DashboardTextField
            name="odCyl2"
            value={values.odCyl2 || ""}
            onChange={handleInputChange}
            error={!!errors.odCyl2}
            helperText={errors.odCyl2 || " "}
            small={small}
          />
          <DashboardTextField
            name="odAx2"
            value={values.odAx2 || ""}
            onChange={handleInputChange}
            error={!!errors.odAx2}
            helperText={errors.odAx2 || " "}
            small={small}
          />
          <DashboardTextField
            name="odPrism2"
            value={values.odPrism2 || ""}
            onChange={handleInputChange}
            error={!!errors.odPrism2}
            helperText={errors.odPrism2 || " "}
            small={small}
          />
          <DashboardTextField
            name="odBase2"
            value={values.odBase2 || ""}
            onChange={handleInputChange}
            error={!!errors.odBase2}
            helperText={errors.odBase2 || " "}
            small={small}
          />
          {/* placeholders for ADD columns */}
          <Box />
          <Box />
          <DashboardTextField
            name="odDnp2"
            value={values.odDnp2 || ""}
            onChange={handleInputChange}
            error={!!errors.odDnp2}
            helperText={errors.odDnp2 || " "}
            small={small}
          />
          {/* PD / DIP for row 2 */}
          <DashboardTextField
            name="pd2"
            value={values.pd2 || ""}
            onChange={handleInputChange}
            error={!!errors.pd2}
            helperText={errors.pd2 || " "}
            small={small}
            pd
          />

          {/* -------------------- OI #2 (no ADD fields) -------------------- */}
          <Typography variant="dashboardFormLabel" sx={{ textAlign: "right", pr: 1, whiteSpace: "nowrap" }}>
            OI#2:
          </Typography>

          <DashboardTextField
            name="oiSph2"
            value={values.oiSph2 || ""}
            onChange={handleInputChange}
            error={!!errors.oiSph2}
            helperText={errors.oiSph2 || " "}
            small={small}
          />
          <DashboardTextField
            name="oiCyl2"
            value={values.oiCyl2 || ""}
            onChange={handleInputChange}
            error={!!errors.oiCyl2}
            helperText={errors.oiCyl2 || " "}
            small={small}
          />
          <DashboardTextField
            name="oiAx2"
            value={values.oiAx2 || ""}
            onChange={handleInputChange}
            error={!!errors.oiAx2}
            helperText={errors.oiAx2 || " "}
            small={small}
          />
          <DashboardTextField
            name="oiPrism2"
            value={values.oiPrism2 || ""}
            onChange={handleInputChange}
            error={!!errors.oiPrism2}
            helperText={errors.oiPrism2 || " "}
            small={small}
          />
          <DashboardTextField
            name="oiBase2"
            value={values.oiBase2 || ""}
            onChange={handleInputChange}
            error={!!errors.oiBase2}
            helperText={errors.oiBase2 || " "}
            small={small}
          />
          <Box />
          <Box />
          <DashboardTextField
            name="oiDnp2"
            value={values.oiDnp2 || ""}
            onChange={handleInputChange}
            error={!!errors.oiDnp2}
            helperText={errors.oiDnp2 || " "}
            small={small}
          />
          <Box />

          {/* -------------------- OD #3 (no ADD fields) -------------------- */}
          <Typography variant="dashboardFormLabel" sx={{ textAlign: "right", pr: 1, whiteSpace: "nowrap" }}>
            OD#3:
          </Typography>

          <DashboardTextField
            name="odSph3"
            value={values.odSph3 || ""}
            onChange={handleInputChange}
            error={!!errors.odSph3}
            helperText={errors.odSph3 || " "}
            small={small}
          />
          <DashboardTextField
            name="odCyl3"
            value={values.odCyl3 || ""}
            onChange={handleInputChange}
            error={!!errors.odCyl3}
            helperText={errors.odCyl3 || " "}
            small={small}
          />
          <DashboardTextField
            name="odAx3"
            value={values.odAx3 || ""}
            onChange={handleInputChange}
            error={!!errors.odAx3}
            helperText={errors.odAx3 || " "}
            small={small}
          />
          <DashboardTextField
            name="odPrism3"
            value={values.odPrism3 || ""}
            onChange={handleInputChange}
            error={!!errors.odPrism3}
            helperText={errors.odPrism3 || " "}
            small={small}
          />
          <DashboardTextField
            name="odBase3"
            value={values.odBase3 || ""}
            onChange={handleInputChange}
            error={!!errors.odBase3}
            helperText={errors.odBase3 || " "}
            small={small}
          />
          <Box />
          <Box />
          <DashboardTextField
            name="odDnp3"
            value={values.odDnp3 || ""}
            onChange={handleInputChange}
            error={!!errors.odDnp3}
            helperText={errors.odDnp3 || " "}
            small={small}
          />
          <DashboardTextField
            name="pd3"
            value={values.pd3 || ""}
            onChange={handleInputChange}
            error={!!errors.pd3}
            helperText={errors.pd3 || " "}
            small={small}
            pd
          />

          {/* -------------------- OI #3 (no ADD fields) -------------------- */}
          <Typography variant="dashboardFormLabel" sx={{ textAlign: "right", pr: 1, whiteSpace: "nowrap" }}>
            OI#3:
          </Typography>

          <DashboardTextField
            name="oiSph3"
            value={values.oiSph3 || ""}
            onChange={handleInputChange}
            error={!!errors.oiSph3}
            helperText={errors.oiSph3 || " "}
            small={small}
          />
          <DashboardTextField
            name="oiCyl3"
            value={values.oiCyl3 || ""}
            onChange={handleInputChange}
            error={!!errors.oiCyl3}
            helperText={errors.oiCyl3 || " "}
            small={small}
          />
          <DashboardTextField
            name="oiAx3"
            value={values.oiAx3 || ""}
            onChange={handleInputChange}
            error={!!errors.oiAx3}
            helperText={errors.oiAx3 || " "}
            small={small}
          />
          <DashboardTextField
            name="oiPrism3"
            value={values.oiPrism3 || ""}
            onChange={handleInputChange}
            error={!!errors.oiPrism3}
            helperText={errors.oiPrism3 || " "}
            small={small}
          />
          <DashboardTextField
            name="oiBase3"
            value={values.oiBase3 || ""}
            onChange={handleInputChange}
            error={!!errors.oiBase3}
            helperText={errors.oiBase3 || " "}
            small={small}
          />
          <Box />
          <Box />
          <DashboardTextField
            name="oiDnp3"
            value={values.oiDnp3 || ""}
            onChange={handleInputChange}
            error={!!errors.oiDnp3}
            helperText={errors.oiDnp3 || " "}
            small={small}
          />
          <Box />
        </Box>

        {/* Save button row */}
        <Stack direction="row" justifyContent="flex-end" spacing={2} mt={1.5}>
          <Button
            variant="contained"
            startIcon={<Save />}
            type="submit"
            size="small"
            sx={{
              fontSize: theme.typography.form?.header?.fontSize || "0.8rem",
              fontWeight: 600,
            }}
          >
            Save
          </Button>
        </Stack>
      </ReusableFormGPT>
    </Box>
  );
}

export default memo(ManifestRefraction);
