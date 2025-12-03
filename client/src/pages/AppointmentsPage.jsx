import Grid from "@mui/material/Grid";
//import AppointmentsContainer from "@/components/appointments/Appointments";
import AppointmentsContainer from "@/features/appointments/components/Appointments";

export default function Appointment() {
  return (
    <Grid container spacing={3}>
      <Grid size={12}>
        <AppointmentsContainer />
      </Grid>
    </Grid>
  );
}
