import { gql } from "graphql-request";

export const GET_APPLICATIONSFIELDS = gql`
  query {
    getApplicationFields {
      id
      fieldView
      fieldType
      fieldData
    }
  }
`;

export const ADD_APPLICATIONFIELDS = gql`
  mutation AddApplicationFields(
    $fieldView: String!
    $fieldType: String!
    $fieldData: String!
  ) {
    addApplicationFields(
      fieldView: $fieldView
      fieldType: $fieldType
      fieldData: $fieldData
    ) {
      id
      fieldView
      fieldType
      fieldData
    }
  }
`;
export const UPDATE_APPLICATIONFIELDS = gql`
  mutation UpdateApplicationFields($id: ID!, $fieldData: String!) {
    updateApplicationFields(id: $id, fieldData: $fieldData) {
      id
      fieldView
      fieldType
      fieldData
    }
  }
`;
export const DELETE_APPLICATIONFIELDS = gql`
  mutation DeleteApplicationFields($id: ID!) {
    deleteApplicationFields(id: $id) {
      id
      fieldView
      fieldType
      fieldData
    }
  }
`;
