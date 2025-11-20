//import { gql } from "apollo-server-express";
import { gql } from "graphql-tag";
export default gql`
  #graphql
  scalar Date #custom Date
  directive @auth on FIELD_DEFINITION
  directive @guest on FIELD_DEFINITION

  type Query {
    _: String
  }

  type Mutation {
    _: String
  }

  type Subscription {
    _: String
  }
`;
