// client/src/context/GlobalState.jsx
import React, { useReducer } from "react";
import { GlobalContext } from "./AppContext.js"; // import context
import AppReducer from "./AppReducer.js";
//import { myclient } from "@/graphqlClient/myclient.js";

//import { CREATE_ENCOUNTER } from "@/graphqlClient/gqlQueries_encounters.js";

// Initial state
const initialState = {
  currentPatient: {
    id: "",
    historyId: "",
    idType: "DNI",
    idTypeNo: "",
    firstName: "",
    lastName: "",
    lastName2: "",
    birthDay: "",
    gender: "",
    phone1: "",
    phone2: "",
    email: "",
    address: "",
    gName: "",
    gPhone1: "",
    gPhone2: "",
    gRelation: "",
    bloodType: "",
    marital: "",
    occupation: "",
    religion: "",
    referral: "",
  },
  error: null,
  loadedConfigData: false,
  applicationFields: [],
  dataExam: [],
  rowExam: [],
  actionExam: 0,
};

// Provider component
export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  // ---------------------
  // Actions
  // ---------------------
  // function updateActionExam(data) {
  //   if (data !== null) {
  //     dispatch({ type: "ACTION_EXAM", payload: data });
  //   }
  // }

  // async function createEncounterAPOLLO(appointmentId) {
  //   try {
  //     const res = await myclient.request("/graphql", CREATE_ENCOUNTER, { appointmentId });
  //     dispatch({ type: "CREATE_ENCOUNTER", payload: res.patients });
  //   } catch (err) {
  //     dispatch({ type: "TRANSACTION_ERROR", payload: err });
  //   }
  // }







 

  // ---------------------
  // Return Provider
  // ---------------------
  return (
    <GlobalContext.Provider
      value={{
        currentPatient: state.currentPatient,
        error: state.error,
        loadedConfigData: state.loadedConfigData,
        applicationFields: state.applicationFields,
   
   
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};



