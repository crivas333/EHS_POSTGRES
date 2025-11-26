//import { gql } from '@apollo/client'
import { gql } from "graphql-request";

export const GET_OPEN_SESSION = gql`
  query getCurrentSession {
    currentSession @client
  }
`;
export const IS_USER_LOGGED_IN = gql`
  query isUserLoggedIn {
    isUserLoggedIn @client
  }
`;

export const IS_THERE_OPEN_SESSION = gql`
  query {
    openSession {
      id
      firstName
      lastName
      userName
      email
    }
  }
`;

export const ME = gql`
  query {
    me {
      id
      firstName
      lastName
      userName
      email
    }
  }
`;

export const SIGNUP = gql`
  mutation signUp(
    $email: String!
    $userName: String!
    $firstName: String!
    $lastName: String!
    $password: String!
  ) {
    signUp(
      email: $email
      userName: $userName
      firstName: $firstName
      lastName: $lastName
      password: $password
    ) {
      id
      firstName
      lastName
      userName
      email
    }
  }
`;
export const SIGNIN = gql`
  mutation signIn($email: String!, $password: String!) {
    signIn(email: $email, password: $password) {
      id
      firstName
      lastName
      userName
      email
    }
  }
`;
export const SIGNOUT = gql`
  mutation {
    signOut
  }
`;
