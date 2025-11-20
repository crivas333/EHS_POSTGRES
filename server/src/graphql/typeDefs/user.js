// src/typeDefs/user.js
import { gql } from "graphql-tag";

export default gql`
  extend type Query {
    # Fetch the currently logged-in user
    me: User @auth

    # Alias for me, can be used for session checks
    openSession: User @auth

    # Fetch a specific user by ID
    user(id: ID!): User @auth

    # Fetch all users
    users: [User!]! @auth

    # Return true if the user is logged in
    isLoggedIn: Boolean

    # Always true, can be used for server health check
    isConnected: Boolean
  }

  extend type Mutation {
    signUp(
      firstName: String!
      lastName: String!
      userName: String!
      email: String!
      password: String!
    ): User @guest

    signIn(email: String!, password: String!): User @guest

    signOut: Boolean @auth
  }

  type User {
    id: ID!
    firstName: String!
    lastName: String!
    userName: String!
    email: String!
    chats: [Chat!]! # Currently always returns empty array
    createdAt: String!
    updatedAt: String!
  }

  type Chat {
    id: ID!
    message: String
    createdAt: String
    updatedAt: String
  }
`;
