import { gql } from "graphql-request";

// 🆕 Create encounter automatically when doctor starts consultation (from resolver)
// You won’t usually call this manually — handled by backend logic
export const ADD_ENCOUNTER = gql`
  mutation addEncounter($encounterInput: EncounterInput) {
    addEncounter(encounterInput: $encounterInput) {
      id
      appointmentId
      patientId
      start
      encounterType
    }
  }
`;

// 💾 Save or update encounter data (used by EncounterForm’s "Guardar" button)
export const SAVE_ENCOUNTER = gql`
  mutation saveEncounter($id: ID!, $input: EncounterInput!) {
    saveEncounter(id: $id, input: $input) {
      id
      appointmentId
      patientId
      start
      end
      encounterType
      consultReason
      dx
      tx
      plan
      updatedAt
    }
  }
`;

// 🧾 Get all encounters for a given patient (history view)
export const GET_ENCOUNTERS_BY_PATIENT_ID = gql`
  query getEncountersByPatientID($id: ID!) {
    getEncountersByPatientID(id: $id) {
      id
      appointmentId
      patientId
      start
      end
      encounterType
      consultReason
      dx
      tx
      plan
      createdAt
    }
  }
`;
export const GET_ENCOUNTERS_VA_BY_ENCOUNTER_ID = gql`
  query getEncountersVAByEncounterID($id: Int!) {
  getEncountersVAByEncounterID(id: $id) {
      id
      encounterId
      appointmentId
      patientId
      visualNeeds
      odVaSc
      oiVaSc
      odVaCc
      oiVaCc
      odIop
      oiIop
      lens1
      lens2
      comm1
      comm2
      createdAt
    }
  }
`;
export const GET_ENCOUNTERS_ET_BY_ENCOUNTER_ID = gql`
query getEncountersETByEncounterID($id: Int!) {
  getEncountersETByEncounterID(id: $id) {
      id
      encounterId
      appointmentId
      patientId
      odSph1
      odCyl1
      odAx1
      oiSph1
      oiCyl1
      oiAx1
      pd1
      odSph2
      odCyl2
      odAx2
      oiSph2
      oiCyl2
      oiAx2
      pd2
      odSph3
      odCyl3
      odAx3
      oiSph3
      oiCyl3
      oiAx3
      pd3
      addIntrm
      addRead
      createdAt
    }
  }
`;
