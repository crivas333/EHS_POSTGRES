import { gql } from "graphql-tag";

export default gql`
  extend type Query {
    appointments: [Appointment!]!
    getAppointmentsByTimeframe(start: String!, end: String!): [Appointment!]!
    getAppointmentsByPatientID(patientId: ID!): [Appointment!]!
    getAppointmentsByPatientIDAndTimeframe(patientId: ID!, start: String!, end: String!): [Appointment!]!


  }

  extend type Mutation {
    addAppointment(input: AppointmentInput!): Appointment!
    updateAppointment(id: ID!, input: AppointmentInput!): Appointment!
    deleteAppointment(id: ID!): Appointment!
    # 🆕 New mutation to update only the status
    updateAppointmentStatus(id: ID!, status: String!): Appointment
  }

 input AppointmentInput {
  start: String!
  end: String!
  arriveTime: String
  type: String!
  status: String!
  patientId: Int
  creatorId: Int
  notRegistered: String
  description: String
}


  type Appointment {
    id: ID!
    patientId: Int
    fullName: String
    notRegistered: String
    idTypeNo: String        # ✅ Add this line
    type: String
    status: String!
    start: String!
    end: String!
    arriveTime: String
    backgroundColor: String!  # 👈 field exists in GraphQL, not in DB
    description: String
    patient: Patient
    creator: User
  }
`;
