//import { gql } from 'apollo-server-express'
import { gql } from "graphql-tag";
export default gql`
  extend type Query {
    getExamsByDate(examDateTime: String!): [Exam!]! @auth
    getExamByPatientID(id: ID!): [Exam!]! @auth
    exams: [Exam!]! @auth
  }

  extend type Mutation {
    addExamData(examInput: ExamInput): Exam @auth
    updateRowExam(id: ID!, examInput: ExamInput): Exam @auth
  }

  input ExamInput {
    examType: String!
    examStatus: String!
    examDateTime: String!
    historyId: Int!
    #patient: ID! #patient: Patient does not work

    #fullName: String
  }

  type Exam {
    id: ID!
    examId: Int!
    examType: String!
    examStatus: String!
    examDateTime: String!
    historyId: Int!
    patient: ID! #ID or Patient: Patient does not work
    fullName: String
    creator: User #creator: User
    createdAt: String!
    updatedAt: String!
  }
`;
