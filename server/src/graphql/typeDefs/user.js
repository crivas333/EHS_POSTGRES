// src/graphql/typeDefs/user.js
import { gql } from "graphql-tag";

export default gql`
  extend type Query {
    me: User @auth
    openSession: User @auth
    user(id: ID!): User @auth
    users: [User!]! @auth
  }

  extend type Mutation {
    register(input: RegisterInput!): AuthPayload! @guest
    login(email: String!, password: String!): AuthPayload! @guest
    refreshToken: AuthPayload!
    logout: Boolean!   # ← NO @auth → works even with expired token
  }

  input RegisterInput {
    userName: String!
    email: String!
    password: String!
    firstName: String!
    lastName: String!
    role: String
  }

  type AuthPayload {
    user: User!
    accessToken: String!
    expiresIn: Int!
  }

  type User {
    id: ID!
    userName: String!
    email: String!
    firstName: String!
    lastName: String!
    fullName: String!
    role: String!
    isActive: Boolean!
    createdAt: String!
    updatedAt: String!
  }
`;