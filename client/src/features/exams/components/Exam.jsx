import React, { useContext, useEffect, Fragment } from "react";
//import clsx from 'clsx';
import { GlobalContext } from "@/state/context/AppContext.js";

import Grid from "@mui/material/Grid";

//import ExamTable from './ExamTableMUI'
import AddExamForm from "./AddExamForm";
import EditExamForm from "./EditExamForm";
import ExamTable from "./ReactTable";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function Exam() {
  const {
    currentPatient,
    applicationFields,
    dataExam,
    rowExam,
    actionExam,
    updateRowExam_APOLLO,
    updateEditingRowExam,
    updateActionExam,
    getExamByPatientID_APOLLO,
    addExamDataAPOLLO,
    deleteApplicationFieldsAPOLLO,
  } = useContext(GlobalContext);
  const columns = React.useMemo(
    () => [
      // {
      //   Header: 'Id',
      //   accessor: 'id',
      // },

      {
        Header: "Nro. Historia",
        accessor: "historyId",
      },
      {
        Header: "TIPO",
        accessor: "examType",
      },
      {
        Header: "ESTADO",
        accessor: "examStatus",
      },
      {
        Header: "FECHA",
        accessor: "examDateTime",
      },
      {
        Header: "ACCIONES",
        accessor: "actions",
        Cell: (props) => {
          //const rowIdx = props.row.id;
          const rowIdx = props.row.original;
          return (
            <div>
              <EditIcon
                cursor="pointer"
                onClick={() => editRow(rowIdx)}
              ></EditIcon>
              <DeleteIcon
                cursor="pointer"
                onClick={() => console.log(rowIdx)}
              ></DeleteIcon>
            </div>
          );
        },
      },
      
    ], // eslint-disable-next-line
    []
  );
  //const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  //const [selectedRow, setSelectedRow]=useState([])

  // const { data, loading, error } = useQuery(GET_EXAM_BY_PATIENT_ID);
  // if (loading) return <p>Loading ...</p>;
  // if (error) return <p>ERROR: {error.message}</p>;
  // if (data && data.exams) {
  //   console.log('useQuery:',data)}

  //Load Data
  useEffect(() => {
    async function fetchData() {
      await getExamByPatientID_APOLLO(currentPatient.id);
    }
    if (currentPatient.id && actionExam === 0) {
      //console.log('Exam - PatientId',currentPatient.id)
      fetchData();
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // CRUD operations
  const addExamData = (dataArray) => {
    //createField.fieldType=fieldType
    //console.log('AddExamData - currPatient:',currentPatient)
    console.log("AddExamData - addExamData:", dataArray);
    const newData = {
      examType: dataArray.examType,
      examStatus: dataArray.examStatus,
      examDateTime: dataArray.examDateTime,
      patient: currentPatient.id,
      //historyId: parseInt(currentPatient.historyId,10)
      historyId: currentPatient.historyId,
    };
    addExamDataAPOLLO(newData);
  };
  const deleteFieldData = (id) => {
    //setAction(0)
    //console.log(id)
    //setUsers(users.filter(user => user.id !== id))
    deleteApplicationFieldsAPOLLO(id);
  };
  const updateRowExam = (row) => {
    updateActionExam(0);
    console.log("Exam - updateRowExam: ", row);
    updateRowExam_APOLLO(row);
  };
  const editRow = (data) => {
    updateActionExam(1);
    console.log("Exam - editRow: ", data);
    updateEditingRowExam(data);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        {actionExam === 1 && (
          <Fragment>
            <EditExamForm
              fieldsSource={applicationFields}
              editingRow={rowExam}
              //editingRow={selecteRow}
              updateRow={updateRowExam}
              //editing={action}
              //setAction={setAction}
            />
          </Fragment>
        )}
        {actionExam === 2 && (
          <Fragment>
            <AddExamForm
              fieldsSource={applicationFields}
              patientInfo={currentPatient}
              addRow={addExamData}
            />
          </Fragment>
        )}
      </Grid>
      <Grid item xs={12}>
        <ExamTable
          columns={columns}
          data={dataExam}
          //getRowProps={row => ({onClick: () => editRow(row.values)})}
          //updateMyData={updateMyData}
          //skipPageReset={skipPageReset}
          //editRow={editRow}
          deleteUser={deleteFieldData}
        />
      </Grid>
    </Grid>
  );
}