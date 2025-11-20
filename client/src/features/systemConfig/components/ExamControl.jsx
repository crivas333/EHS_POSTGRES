import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import ApplicationFieldsTable from "./ApplicationFieldsTable";
import ConfigForm from "./ConfigForm";
import ReusableControls from "@/components/shared/ui/reusableControls/ReusableControls";
import { getFieldCollections, mapLabelToFieldType } from "@/services/configService";
import ConfirmationDialog from "./ConfirmationDialog";

export default function ExamControl({
  applicationFields,
  addField,
  updateField,
  deleteField,
}) {
  const [chosenField, setChosenField] = useState("Tipo de Examen");
  const [editing, setEditing] = useState(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [pendingValue, setPendingValue] = useState(null);

  const field_type = mapLabelToFieldType("exam", chosenField);

  const examFields = applicationFields.filter(
    (item) => item.field_view === "examView" && item.field_type === field_type
  );

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
      <Grid size={12}>
        <ReusableControls.CustomSelect
          name="cfgCustData"
          label="Configuración de Campos de Exámenes"
          value={chosenField}
          onChange={(e) => setChosenField(e.target.value)}
          options={getFieldCollections("exam")}
        />
      </Grid>

      <Grid size={12}>
        <ApplicationFieldsTable
          appFields={examFields}
          editRow={handleEditClick}
          deleteUser={handleDeleteClick}
        />
      </Grid>

      <Grid size={12}>
        <ConfigForm
          mode={editing ? "edit" : "add"}
          initialValue={editing?.field_data || ""}
          existingValues={examFields.map((f) => f.field_data)}
          onSubmit={async (value) => {
            if (editing) {
              await updateField.mutateAsync({ id: editing.id, field_data: value });
              setEditing(null);
            } else {
              await addField.mutateAsync({
                field_view: "examView",
                field_type,
                field_data: value,
              });
            }
          }}
          onCancel={() => setEditing(null)}
        />
      </Grid>

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

