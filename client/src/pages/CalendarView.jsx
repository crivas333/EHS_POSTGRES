import React from "react";
//import { makeStyles } from "@mui/styles";
import MyFullCalendar from "@/features/scheduler/components/MyFullCalendar";
//import MyFullCalendar from "@/components/scheduler/MyFullCalendarTest";

// const useStyles = makeStyles((theme) => ({
//   root: {
//     flexGrow: 1,
//   },
//   paper: {
//     padding: theme.spacing(1),
//     textAlign: "center",
//     color: theme.palette.text.secondary,
//   },
// }));

//export default function Appointment () {
export default function Calendar() {
  //const classes = useStyles();
  //const { currentPatient } = useContext(GlobalContext)

  return (
    <div //className={classes.root}
    >
      {<MyFullCalendar />}
    </div>
  );
}
// <AutoCompleteSF />
/*
 <div className={classes.root}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <AsyncPaginationExample />
          </Grid>
          <Grid item xs={12}>
            <BuilderForm />
          </Grid>
        </Grid>
      </div>

*/
// <MyAutoFunc items={countries} />

/*
    <Modal
          title="Add Event"
          canCancel
          canConfirm
          onCancel={modalCancelHandler}
          onConfirm={modalConfirmHandler}
          confirmText="Confirm"
        >
          <NewPatientForm />
        </Modal>
*/

/*
   <Container>
        <Row>
          <Col>
            <div className="container">
              {false && <AsyncPaginationExample />}
            </div>
          </Col>
        </Row>
        <Row>
          <div>
            <BuilderForm />
          </div>
        </Row>
      </Container>

*/
/*
    <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Modal title</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <NewPatientForm />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Button variant="primary" onClick={handleShow}>
        New Patient
      </Button>
*/
