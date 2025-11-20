// src/hooks/useAppointmentForm.jsx
export function useAppointmentForm() {
  const toDate = (dateString) => (dateString ? new Date(dateString) : null);

  // Universal date handler, returns function compatible with handleInputChange
  const handleDateChange = (field, handleInputChange) => (dateOrEvent) => {
    let isoValue = "";

    if (dateOrEvent?.target?.value !== undefined) {
      isoValue = dateOrEvent.target.value || "";
    } else if (dateOrEvent?.toDate) {
      isoValue = dateOrEvent.toDate().toISOString();
    } else if (dateOrEvent instanceof Date) {
      isoValue = dateOrEvent.toISOString();
    } else if (dateOrEvent === null) {
      isoValue = "";
    }

    handleInputChange({ target: { name: field, value: isoValue } });
  };

  return { toDate, handleDateChange };
}
