import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import ApplicationFieldsTable from "./ApplicationFieldsTable";
import ConfigForm from "./ConfigForm";
import ReusableControls from "@/components/shared/ui/reusableControls/ReusableControls";
import { getFieldCollections, mapLabelToFieldType } from "@/services/configService";
import ConfirmationDialog from "./ConfirmationDialog";

export default function AppointmentControl({
  applicationFields,
  addField,
  updateField,
  deleteField,
}) {
  const [chosenField, setChosenField] = useState("Tipo de Cita");
  const [editing, setEditing] = useState(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [pendingValue, setPendingValue] = useState(null);

  const fieldType = mapLabelToFieldType("appointment", chosenField);

  const appFields = applicationFields.filter(
    (item) => item.fieldView === "appointmentView" && item.fieldType === fieldType
  );

  // Confirmation dialog triggers
  const handleEditClick = (field) => {
    setPendingAction("edit");
    setPendingValue(field);
    setDialogOpen(true);
  };

  const handleDeleteClick = (id) => {
    setPendingAction("delete");
    setPendingValue(id);
    setDialogOpen(true);
  };

  const handleConfirm = () => {
    if (pendingAction === "edit") setEditing(pendingValue);
    if (pendingAction === "delete") deleteField.mutate({ id: pendingValue });
    setDialogOpen(false);
    setPendingAction(null);
    setPendingValue(null);
  };

  const handleCancel = () => {
    setDialogOpen(false);
    setPendingAction(null);
    setPendingValue(null);
  };

  return (
    <Grid container spacing={3}>
      {/* Dropdown to choose which set of fields to configure */}
      <Grid size={12}>
        <ReusableControls.CustomSelect
          name="cfgCustData"
          label="Configuración de Campos de Citas"
          value={chosenField}
          onChange={(e) => setChosenField(e.target.value)}
          options={getFieldCollections("appointment")}
        />
      </Grid>

      {/* Table showing the current fields */}
      <Grid size={12}>
        <ApplicationFieldsTable
          appFields={appFields}
          editRow={handleEditClick}
          deleteUser={handleDeleteClick}
        />
      </Grid>

      {/* Single Form for Add/Edit with inline validation */}
      <Grid size={12}>
        <ConfigForm
          mode={editing ? "edit" : "add"}
          initialValue={editing?.fieldData || ""}
          existingValues={appFields.map((f) => f.fieldData)}
          onSubmit={async (value) => {
            if (editing) {
              await updateField.mutateAsync({ id: editing.id, fieldData: value });
              setEditing(null);
            } else {
              await addField.mutateAsync({
                fieldView: "appointmentView",
                fieldType,
                fieldData: value,
              });
            }
          }}
          onCancel={() => setEditing(null)}
        />
      </Grid>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={dialogOpen}
        title={pendingAction === "delete" ? "Confirmar borrado" : "Confirmar edición"}
        message={
          pendingAction === "delete"
            ? "¿Está seguro de borrar este campo?"
            : "¿Desea editar este campo?"
        }
        onCancel={handleCancel}
        onConfirm={handleConfirm}
      />
    </Grid>
  );
}
