// src/graphql/typeDefs/user.js
import { gql } from "graphql-tag";

export default gql`
  extend type Query {
    # Fetch the currently logged-in user (JWT authenticated)
    me: User @auth

    # Optional alias (you can keep or remove)
    openSession: User @auth

    # Admin-only: fetch any user by ID
    user(id: ID!): User @auth

    # Admin-only: list all users
    users: [User!]! @auth

    # Simple health check
    #isConnected: Boolean!
  }

  extend type Mutation {
    # REGISTER — returns tokens + user
    register(input: RegisterInput!): AuthPayload! @guest

    # LOGIN — returns tokens + user
    login(email: String!, password: String!): AuthPayload! @guest

    # REFRESH ACCESS TOKEN (silent renewal)
    refreshToken: AuthPayload!

    # LOGOUT — clears httpOnly cookie
    logout: Boolean! @auth
  }

  # Input for registration
  input RegisterInput {
    userName: String!
    email: String!
    password: String!
    firstName: String!
    lastName: String!
    role: String # Optional — defaults to RECEPTIONIST
  }

  # Standardized auth response
  type AuthPayload {
    user: User!
    accessToken: String!
    expiresIn: Int! # seconds
  }

  # User type — now includes role
  type User {
    id: ID!
    userName: String!
    email: String!
    firstName: String!
    lastName: String!
    fullName: String!       # virtual (from entity)
    role: String!           # ADMIN, DOCTOR, RECEPTIONIST, etc.
    isActive: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  # Keep if you plan to add chat later
  type Chat {
    id: ID!
    message: String
    createdAt: String
    updatedAt: String
  }
`;
