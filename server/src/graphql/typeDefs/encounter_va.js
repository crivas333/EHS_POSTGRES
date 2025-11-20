import { gql } from "graphql-tag";

export default gql`
  type Encounter_va {
    id: ID!
    encounterId: Int
    appointmentId: Int
    patientId: Int
    visualNeeds: String
    odVaSc: String
    oiVaSc: String
    odVaCc: String
    oiVaCc: String
    odVaAe: String
    oiVaAe: String
    odIop: String
    oiIop: String
   
    comm1: String
    comm2: String
    lens1: String
    lens2: String
    
    createdAt: String
    updatedAt: String
  }

  extend type Query {
   
    getEncountersVAByAppointmentID(id: Int!): [Encounter_va]
    getEncountersVAByEncounterID(id: Int!): [Encounter_va]
  }
`;
