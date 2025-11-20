import { gql } from "graphql-request";

export const UPDATE_APPOINTMENT_STATUS = gql`
  mutation updateAppointmentStatus($id: ID!, $status: String!) {
    updateAppointmentStatus(id: $id, status: $status) {
      id
      status
    }
  }
`;

// ---------------- Queries ----------------
export const GET_APPOINTMENTS = gql`
  query {
    appointments {
      id
      fullName
      idTypeNo
      type
      status
      start
      end
      arriveTime
      notRegistered
      description
      backgroundColor
      patientId
    }
  }
`;

export const GET_APPOINTMENTS_BY_TIMEFRAME = gql`
  query GetAppointmentsByTimeframe($start: String!, $end: String!) {
    getAppointmentsByTimeframe(start: $start, end: $end) {
      id
      fullName
      idTypeNo
      type
      status
      start
      end
      arriveTime
      notRegistered
      description
      backgroundColor
      patientId
    }
  }
`;

export const GET_APPOINTMENTS_BY_PATIENT = gql`
  query GetAppointmentsByPatientID($patientId: Int!) {
    getAppointmentsByPatientID(patientId: $patientId) {
      id
      fullName
      idTypeNo
      type
      status
      start
      end
      arriveTime
      notRegistered
      description
      backgroundColor
      patientId
    }
  }
`;



// ---------------- Mutations ----------------
export const ADD_APPOINTMENT = gql`
  mutation AddAppointment($input: AppointmentInput!) {
    addAppointment(input: $input) {
      id
      fullName
      idTypeNo
      type
      status
      start
      end
      #arriveTime
      notRegistered
      description
      backgroundColor
      patientId
    }
  }
`;

export const UPDATE_APPOINTMENT = gql`
  mutation UpdateAppointment($id: ID!, $input: AppointmentInput!) {
    updateAppointment(id: $id, input: $input) {
      id
      fullName
      idTypeNo
      type
      status
      start
      end
      arriveTime
      notRegistered
      description
      backgroundColor
      patientId
    }
  }
`;

export const DELETE_APPOINTMENT = gql`
  mutation DeleteAppointment($id: ID!) {
    deleteAppointment(id: $id) {
      id
 
    }
  }
`;

