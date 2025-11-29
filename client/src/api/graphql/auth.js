// client/src/api/graphql/auth.js
import { gql } from "graphql-request";

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

export const LOGOUT = gql`
  mutation Logout {
    logout
  }
`;

export const REFRESH_TOKEN = gql`
  mutation RefreshToken {
    refreshToken {
      accessToken
      expiresIn
    }
  }
`;

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