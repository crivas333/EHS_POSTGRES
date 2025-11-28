// client/src/graphql/sessions.js
import { gql } from "graphql-request";

// ───────────────────────────────────────────────────────────────
// QUERIES
// ───────────────────────────────────────────────────────────────

// Get current user (protected by @auth → uses JWT)
export const ME = gql`
  query Me {
    me {
      id
      userName
      email
      firstName
      lastName
      fullName
      role
      isActive
    }
  }
`;

// ───────────────────────────────────────────────────────────────
// MUTATIONS
// ───────────────────────────────────────────────────────────────

// REGISTER — returns user + accessToken
export const REGISTER = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      user {
        id
        userName
        email
        firstName
        lastName
        fullName
        role
        isActive
      }
      accessToken
      expiresIn
    }
  }
`;

// LOGIN — returns user + accessToken
export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      user {
        id
        userName
        email
        firstName
        lastName
        fullName
        role
        isActive
      }
      accessToken
      expiresIn
    }
  }
`;

// REFRESH TOKEN — silent renewal
export const REFRESH_TOKEN = gql`
  mutation RefreshToken {
    refreshToken {
      accessToken
      expiresIn
    }
  }
`;

// LOGOUT — clears httpOnly cookie
export const LOGOUT = gql`
  mutation Logout {
    logout
  }
`;

// ───────────────────────────────────────────────────────────────
// INPUTS (for GraphQL variables)
// ───────────────────────────────────────────────────────────────

export const REGISTER_INPUT = {
  userName: "admin",
  email: "admin@example.com",
  password: "Secrete12!",
  firstName: "Admin",
  lastName: "User",
  role: "ADMIN", // optional
};