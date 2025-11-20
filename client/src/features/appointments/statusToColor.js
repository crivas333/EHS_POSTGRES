export const statusToColor = (status) => {
  if (!status) return "#BDBDBD"; // Gris claro: estado desconocido o vacío

  const normalized = status.trim().toUpperCase();

  switch (normalized) {
    case "DISPONIBLE":
      return "#CFD8DC"; // Gris azulado claro — slot libre

    case "PROGRAMADA":
      return "#FFCA28"; // 🟡 Amarillo dorado — pendiente

    case "CONFIRMADA":
      return "#43A047"; // 🟢 Verde medio — confirmada

    case "PACIENTE LLEGÓ":
    case "PACIENTE LLEGO":
      return "#66BB6A"; // 💚 Verde claro — paciente listo para ser atendido

    case "EN ATENCIÓN":
    case "EN ATENCION":
      return "#6D4C41"; // 🟤 Marrón cálido — en consulta

    case "ATENDIDA":
      return "#00897B"; // 🟢 Verde azulado — cita finalizada exitosamente

    case "REPROGRAMADA":
      return "#8E24AA"; // 🟣 Púrpura — reagendada

    case "CANCELADA":
      return "#E53935"; // 🔴 Rojo — cancelada

    case "NO SE PRESENTÓ":
    case "NO SE PRESENTO":
      return "#757575"; // ⚫ Gris medio — ausente

    default:
      return "#BDBDBD"; // Gris claro — estado no reconocido
  }
};
