export default (state, action) => {
  switch (action.type) {
    case "ACTION_EXAM":
      return {
        ...state,
        actionExam: action.payload,
      };
    case "UPDATE_EDITINGROWEXAM_GQL":
      return {
        ...state,
        rowExam: action.payload,
      };
    // case "USER_LOGGEDIN":
    //   //console.log("Reducer USER_LOGGED_IN",action.payload);
    //   return {
    //     ...state,
    //     isAuth: true,
    //     currentUser: action.payload,
    //   };
    // case "USER_NOT_LOGGEDIN":
    //   return {
    //     ...state,
    //     isAuth: false,
    //     currentUser: action.payload,
    //   };
    // case "USER_SIGNIN":
    //   return {
    //     ...state,
    //     isAuth: true,
    //     currentUser: action.payload,
    //   };
    case "TRANSACTION_ERROR":
      return {
        ...state,
        error: action.payload,
      };
    case "GET_PATIENTSDATA":
      return {
        ...state,
        //loading: false,
        patientData: action.payload,
      };
    case "GET_PATIENTSDATA_GQL":
      //console.log("reducer: ", action.payload);
      return {
        ...state,
        //loading: false,
        patientData: action.payload,
      };
    case "GET_EXAMSDATA_GQL":
      //console.log("reducer: ", action.payload);
      return {
        ...state,
        //loading: false,
        dataExam: action.payload,
      };
    case "ADD_EXAMDATA_GQL":
      //console.log("reducer: ", action.payload);
      return {
        ...state,
        //loading: false,
        //dataExam: action.payload,
      };
    case "GET_PATIENTDATA":
      //console.log("reducer: ", action.payload);
      //console.log('AppReducer - currentPatient: ',state.currentPatient)

      return {
        ...state,
        //loading: false,
        //patientData: action.payload,
        currentPatient: action.payload,
      };
    case "GET_APPLICATIONFIELDS_GQL":
      //console.log("reducer: ", action.payload);
      //console.log('AppReducer - getApplicationFields: ',action.payload)

      return {
        ...state,
        //loading: false,
        loadedConfigData: true,
        applicationFields: action.payload,
      };
    case "ADD_APPLICATIONFIELD_GQL":
      //console.log("reducer: ", action.payload);
      //console.log('AppReducer - updateApplicationFields: ',action.payload)
      return {
        ...state,
        //loading: false,
        applicationFields: action.payload,
      };
    case "UPDATE_CUSTOMDATA_GQL":
      //console.log("reducer: ", action.payload);
      //console.log('AppReducer - updateApplicationFields: ',action.payload)
      return {
        ...state,
        //loading: false,
        applicationFields: action.payload,
      };
    case "GET_PATIENTDATABYNAME":
      return {
        ...state,
        //loading: false,
        patientData: action.payload,
      };
    case "ADD_PATIENTDATA":
      return {
        ...state,
        //patientData: [...state.patientData, action.payload],

        currentPatient: action.payload,
      };

    case "DELETE_PATIENTDATA":
      return {
        ...state,
        patientData: state.patientData.filter(
          (patientData) => patientData._id !== action.payload
        ),
      };
    case "SELECT_PATIENT":
      return {
        ...state,
        currentPatient: action.payload,
      };
    case "CLEAR_PATIENTDATA":
      return {
        ...state,
        //patientData: [...state.patientData, action.payload],
        currentPatient: action.payload,
      };
    case "RELOAD_PATIENTDATA":
      return {
        ...state,
        //patientData: [...state.patientData, action.payload],
        currentPatient: action.payload,
      };
    default:
      return state;
  }
};

// case "GET_TRANSACTIONS":
//   return {
//     ...state,
//     loading: false,
//     transactions: action.payload,
//   };
// case "GET_TRANSACTION":
//   return {
//     ...state,
//     loading: false,
//     transactions: action.payload,
//     //transactions: state.transactions.filter(transaction => transaction._id !== action.payload)
//   };
// case "DELETE_TRANSACTION":
//   return {
//     ...state,
//     transactions: state.transactions.filter(
//       (transaction) => transaction._id !== action.payload
//     ),
//   };
// case "ADD_TRANSACTION":
//   return {
//     ...state,
//     transactions: [...state.transactions, action.payload],
//   };
