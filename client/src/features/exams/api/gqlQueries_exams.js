import { gql } from "graphql-request";

export const GET_EXAM_BY_PATIENT_ID = gql`
  query getExamByPatientID($id: ID!) {
    getExamByPatientID(id: $id) {
      id
      #examId
      examDateTime
      #examDateReg
      #examDateProg
      #examDateExe
      examType
      examStatus
      historyId
    }
  }
`;
export const GET_EXAMS = gql`
  query exams {
    exams {
      id
      examType
      examStatus
      #historyId
    }
  }
`;
export const ADD_EXAMDATA = gql`
  mutation AddExamData($examInput: ExamInput!) {
    addExamData(examInput: $examInput) {
      id
      #examId
      #examDateReg
      #examDateProg
      #examDateExe
      examType
      examStatus
      historyId
    }
  }
`;
export const UPDATE_ROWEXAM = gql`
  mutation UpdateRowExam($id: ID!, $examInput: ExamInput!) {
    updateRowExam(id: $id, examInput: $examInput) {
      id
      #examId
      #examDateReg
      #examDateProg
      #examDateExe
      examType
      examStatus
      historyId
    }
  }
`;
