import { gql } from "graphql-tag";

export default gql`
  type Encounter_et {
    id: ID!
    encounterId: Int
    appointmentId: Int
    patientId: Int
    odSph1: String
    odCyl1: String
    odAx1: String
    oiSph1: String
    oiCyl1: String
    oiAx1: String
    pd1: String
    odSph2: String
    odCyl2: String
    odAx2: String
    oiSph2: String
    oiCyl2: String
    oiAx2: String
    pd2: String
    odSph3: String
    odCyl3: String
    odAx3: String
    oiSph3: String
    oiCyl3: String
    oiAx3: String
    pd3: String
  
    addIntrm: String
    addRead: String
    createdAt: String
    updatedAt: String
  }

  extend type Query {
   
    getEncountersETByAppointmentID(id: Int!): [Encounter_et]
    getEncountersETByEncounterID(id: Int!): [Encounter_et]
  }
`;
