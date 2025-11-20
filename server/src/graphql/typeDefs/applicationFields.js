import { gql } from "graphql-tag";

export default gql`
  extend type Query {
    getApplicationFields: [ApplicationFields!]! @auth
  }

  extend type Mutation {
    addApplicationFields(
      fieldView: String!
      fieldType: String!
      fieldData: String!
    ): [ApplicationFields!]! @auth

    updateApplicationFields(id: ID!, fieldData: String!): [ApplicationFields!]! @auth

    deleteApplicationFields(id: ID!): [ApplicationFields!]! @auth
  }

  type ApplicationFields {
    id: ID!
    fieldView: String!
    fieldType: String!
    fieldData: String!
    createdAt: String
    updatedAt: String
  }
`;
