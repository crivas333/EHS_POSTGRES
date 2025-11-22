import { gql } from "graphql-tag";

export default gql`
  scalar Date

  extend type Query {
    patient(id: ID!): Patient @auth
    patients: [Patient!]! @auth
    searchPatientsByLastName(lastName: String!): [Patient!]! @auth
    #searchPatientsByName(name: String!, page: Int, limit: Int): [Patient!]! @auth
    searchPatientsByName(searchTerm: String!, page: Int, limit: Int): [Patient!]! @auth 
    searchCombined(
      lastName: String
      lastName2: String
      firstName: String
      page: Int = 1
      limit: Int = 20
    ): [Patient!]! @auth
  }

  extend type Mutation {
    createPatient(patientInput: PatientInput): Patient @auth
    updatePatient(id: ID!, patientInput: PatientInput): Patient @auth
    deletePatient(id: ID!): Patient @auth
  }

  input PatientInput {
    # Names
    lastName: String
    lastName2: String
    firstName: String

    # Identity
    idType: String
    idTypeNo: String

    # Demographics
    birthDay: Date
    gender: String

    # Contact
    phone1: String
    phone2: String
    email: String
    address: String
    occupation: String
    insurance1: String

    # Guardian
    gName: String
    gPhone1: String
    gPhone2: String
    gRelation: String

    # Other
    bloodType: String
    marital: String
    religion: String
    referral: String
    registDate: Date
  }

  type Patient {
    # Primary key
    id: ID!

    # Names
    lastName: String
    lastName2: String
    firstName: String

    # Identity
    idType: String
    idTypeNo: String

    # Demographics
    birthDay: Date
    gender: String

    # Contact
    phone1: String
    phone2: String
    email: String
    address: String
    occupation: String
    insurance1: String

    # Guardian
    gName: String
    gPhone1: String
    gPhone2: String
    gRelation: String

    # Other
    bloodType: String
    marital: String
    religion: String
    referral: String
  

    # Virtuals
    fullName: String
    ageYears: Int
    ageMonths: Int

    # Timestamps
    registDate: Date
    createdAt: String!
    updatedAt: String!

    # Relations
    appointments: [Appointment!]
  }
`;
