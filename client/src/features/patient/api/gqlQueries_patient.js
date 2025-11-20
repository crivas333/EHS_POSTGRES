import { gql } from "graphql-request";

export const GET_PATIENTS = gql`
  query {
    patients {
      id
      dni
      firstName
      lastName
      lastName2
      birthDay
      gender
      email
    }
  }
`;

export const SEARCH_PATIENT_BY_LASTNAME = gql`
  query searchPatientsByLastName($lastName: String!) {
    searchPatientsByLastName(lastName: $lastName) {
      id
      fullName
    }
  }
`;

export const SEARCH_PATIENT_BY_NAME = gql`
  query searchPatientsByName($searchTerm: String!, $page: Int, $limit: Int) {
    searchPatientsByName(searchTerm: $searchTerm, page: $page, limit: $limit) {
      id
      firstName
      lastName
      lastName2
      fullName
      idTypeNo
    }
  }
`;

export const AUTOCOMPLETE_SEARCH_PATIENT_BY_ID = gql`
  query patient($id: ID!) {
    patient(id: $id) {
      id
      firstName
      lastName
      lastName2
      fullName
      idTypeNo
    }
  }
`;

export const SEARCH_PATIENT_BY_ID = gql`
  query patient($id: ID!) {
    patient(id: $id) {
      id
      idType
      idTypeNo
      firstName
      lastName
      lastName2
      fullName
      birthDay
      ageYears
      ageMonths
      gender
      phone1
      phone2
      email
      address
      gName
      gPhone1
      gPhone2
      gRelation
      bloodType
      marital
      occupation
      religion
      referral
    }
  }
`;

export const CREATE_PATIENT = gql`
  mutation createPatient($patientInput: PatientInput) {
    createPatient(patientInput: $patientInput) {
      id
      idType
      idTypeNo
      firstName
      lastName
      lastName2
      fullName
      birthDay
      ageYears
      ageMonths
      gender
      phone1
      phone2
      email
      address
      gName
      gPhone1
      gPhone2
      gRelation
      bloodType
      marital
      occupation
      religion
      referral
    }
  }
`;

export const UPDATE_PATIENT = gql`
  mutation updatePatient($id: ID!, $patientInput: PatientInput) {
    updatePatient(id: $id, patientInput: $patientInput) {
      id
      idType
      idTypeNo
      firstName
      lastName
      lastName2
      fullName
      birthDay
      ageYears
      ageMonths
      gender
      phone1
      phone2
      email
      address
      gName
      gPhone1
      gPhone2
      gRelation
      bloodType
      marital
      occupation
      religion
      referral
    }
  }
`;

export const DELETE_PATIENT = gql`
  mutation deletePatient($id: ID!) {
    deletePatient(id: $id) {
      id
    }
  }
`;