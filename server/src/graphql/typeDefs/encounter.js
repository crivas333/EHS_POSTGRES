import { gql } from "graphql-tag";

export default gql`
  extend type Query {
    encounters: [Encounter!]!
   
    getEncountersByPatientID(id: ID!): [Encounter!]!
    getEncounterByAppointmentId(appointmentId: Int!): Encounter
    getEncountersByPatientIDandTimeFrame(id: ID!, start: String, end: String): [Encounter!]!
    

  }

  extend type Mutation {
    addEncounter(input: EncounterInput!): Encounter!
    updateEncounter(id: ID!, input: EncounterInput!): Encounter!
    deleteEncounter(id: ID!): Encounter!
    
    saveEncounter(id: ID, input: EncounterInput): Encounter
    updateAppointmentStatus(id: ID!, status: String!): Appointment
  }
  type Encounter {
    id: ID!
    appointmentId: Int
    patientId: Int!
    start: String
    end: String
    encounterType: String
    consultReason: String
    sxSigns: String
    adnexa: String
    anteriorSeg: String
    lens: String
    fundus: String
    dx: String
    tx: String
    tests: String
    plan: String
    creatorId: Int
    createdAt: String
    updatedAt: String
  }

  input EncounterInput {
    appointmentId: Int
    patientId: Int!
    start: String
    end: String
    encounterType: String
    consultReason: String
    sxSigns: String
    adnexa: String
    anteriorSeg: String
    lens: String
    fundus: String
    dx: String
    tx: String
    tests: String
    plan: String
    creatorId: Int
  }
 
`;
