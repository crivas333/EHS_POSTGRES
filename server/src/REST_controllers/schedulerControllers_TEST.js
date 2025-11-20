// const Transaction = require('@/models/Transaction');
//import { User, Chat, Message, Patient, Appointment } from '../models'
import { Counters, Appointment, Patient } from "./models/index.js";
//const Events = require('@/../data');

// @desc    Add transaction
// @route   POST /api/v1/transactions
// @access  Public
export const crudAppointments = async (req, res, next) => {
  //console.log("crudAppointments: ", req.body)
  const param = req.body;
  const { userId } = req.session;
  // console.log('userId: ', userId)
  var eventData = [];

  if (
    req.body.action === "insert" ||
    (req.body.action === "batch" && req.body.added.length > 0)
  ) {
    req.body.action === "insert"
      ? eventData.push(req.body.value)
      : (eventData = req.body.added);
    //console.log("added:",eventData);
    for (var a = 0; a < eventData.length; a++) {
      const appointmentId = await Counters.findOneAndUpdate(
        { _id: "appointmentId" },
        { $inc: { sequence_value: 1 } },
        { new: true }
      ).exec();
      //console.log("appointmentId: ",appointmentId)

      //get Patient fullName
      //const fullName = await Patient.findById(eventData[a].patient, 'lastName lastName2 firstName fullName').exec()
      //console.log('fullName: ',fullName.fullName)
      try {
        const appointment = new Appointment({
          //eventData[a].StartTime = new Date(eventData[a].StartTime);
          //eventData[a].EndTime = new Date(eventData[a].EndTime);
          appointmentId: appointmentId.sequence_value,
          appointmentType: eventData[a].appointmentType,
          appointmentStatus: eventData[a].appointmentStatus,
          StartTime: eventData[a].StartTime,
          EndTime: eventData[a].EndTime,
          patient: eventData[a].patient || null,
          fullName: eventData[a].fullName || null,
          noRegistered: eventData[a].noRegistered || null,
          Description: eventData[a].Descripction || null,
          Subject: eventData[a].Subject || null,
          IsAllDay: eventData[a].IsAllDay || null,
        });
        const result = await appointment.save();

        try {
          if (eventData[a].patient !== "" && eventData[a].patient !== null) {
            //console.log('Patient not null, nor empty:  ',eventData[a].patient)
            await Patient.findOneAndUpdate(
              { _id: eventData[a].patient },
              { $push: { appointments: result } }
            ).exec();
          }
        } catch (err) {
          console.log(err);
        }

        // console.log("result: ",result);
        //return res.status(200).json(result)
      } catch (err) {
        console.log("Added-error: ", err);
      }
    }
  }

  if (
    req.body.action === "update" ||
    (req.body.action === "batch" && req.body.changed.length > 0)
  ) {
    req.body.action === "update"
      ? eventData.push(req.body.value)
      : (eventData = req.body.changed);
    //console.log("changed: ",eventData)
    for (var b = 0; b < eventData.length; b++) {
      //delete eventData[b]._id;
      //dbo.collection('ScheduleData').updateOne({ "Id": eventData[b].Id }, { $set: eventData[b] });

      try {
        const prevPatientRef = await Appointment.findOne(
          { appointmentId: eventData[b].appointmentId },
          "patient"
        ).exec();
        //const currFullName = await Patient.findById(eventData[b].patient, 'lastName lastName2 firstName fullName').exec()

        //console.log('prevAppo: ', prevAppointment)
        //console.log('currFullName: ',currFullName.fullName)

        //if filled with patientRef
        if (eventData[b].patient !== null && eventData[b].patient !== "") {
          //if patienRef has changed: delete appointmentRef from previous Patient
          //console.log('AAAAAAAAAAAA')
          if (eventData[b].patient !== prevPatientRef.patient) {
            const doc1 = await Patient.findOneAndUpdate(
              { _id: prevPatientRef.patient },
              { $pull: { appointments: eventData[b]._id } }
            ).exec();
          }
          // if patienfRef didnt change: fill later on
          else {
          }
        }
        //if no patientRef
        else {
          //console.log('NOT  AAAAAAAAAAAA')
          //patientRef has been deleted on the current Appointment update: delete app from previos Patient
          if (prevPatientRef.patient !== null && prevPatientRef !== "") {
            //console.log('CCCCCCCCCCCCC: ',prevPatientRef.patient)
            const doc1 = await Patient.findOneAndUpdate(
              { _id: prevPatientRef.patient },
              { $pull: { appointments: eventData[b]._id } }
            ).exec();
          }
          //didnt have patientRef:
          else {
            //console.log('DDDDDDDDDDDDDDd')
          }
        }
        //console.log('controller appointments - eventData[b]: ',eventData[b])
        const appointment = await Appointment.findOneAndUpdate(
          { appointmentId: eventData[b].appointmentId },
          {
            $set: {
              appointmentType: eventData[b].appointmentType,
              appointmentStatus: eventData[b].appointmentStatus,
              StartTime: eventData[b].StartTime,
              EndTime: eventData[b].EndTime,
              patient: eventData[b].patient || null,
              fullName: eventData[b].fullName || null,
              noRegistered: eventData[b].noRegistered || null,
              Description: eventData[b].Description,
              Subject: eventData[b].Subject,
              IsAllDay: eventData[b].IsAllDay,
            },
          },
          { new: true }
        ).exec();
        console.log("changed appointment: ", appointment);
        if (eventData[b].patient !== null && eventData[b].patient !== "") {
          const updatedPatient = await Patient.findOneAndUpdate(
            { _id: eventData[b].patient },
            { $push: { appointments: appointment } }
          ).exec();
          console.log("updatedPatient: ", updatedPatient);
        }
      } catch (err) {
        console.log("Changed-error: ", error);
      }
    }
  }

  if (
    req.body.action === "remove" ||
    (req.body.action === "batch" && req.body.deleted.length > 0)
  ) {
    req.body.action === "remove"
      ? eventData.push({ Id: req.body.key })
      : (eventData = req.body.deleted);
    for (var c = 0; c < eventData.length; c++) {
      const doc1 = await Patient.findOneAndUpdate(
        { _id: eventData[c].patient },
        { $pull: { appointments: eventData[c]._id } }
      );

      //console.log('2deleted - eventData: ',req.body.deleted[0]._id)
      const doc2 = await Appointment.findByIdAndRemove(req.body.deleted[c]._id);
    }
  }

  if (
    req.body.action === "remove111" ||
    (req.body.action === "batch111" && req.body.deleted.length > 0)
  ) {
    req.body.action === "remove"
      ? eventData.push({ Id: req.body.key })
      : (eventData = req.body.deleted);
    for (var c = 0; c < eventData.length; c++) {
      Patient.findOneAndUpdate(
        { _id: eventData[c].patient },
        { $pull: { appointments: eventData[c]._id } },
        function (err, model) {
          //console.log('2deleted - eventData: ',req.body.deleted[0]._id)
          Appointment.findByIdAndRemove(
            req.body.deleted[0]._id,
            (err, appointment) => {
              if (err) res.json(err);
            }
          );
        }
      );
    }
  }

  //return await Patient.find({})
  //return res.status(200).json(Events)
  //console.log('end of crudAppointments')
  //return res.status(200).json(await Appointment.find({}))
  res.send(req.body);
};

// @desc    Get all transactions
// @route   GET /api/v1/transactions
// @access  Public
export const getAppointments = async (req, res, next) => {
  //console.log("getAppointments: ", req.body)
  //dbo.collection('ScheduleData').find({}).toArray(function (err, cus) {

  //Tank.find({ size: 'small' }).where('createdDate').gt(oneYearAgo).exec(callback);
  try {
    const doc = await Appointment.find({
      StartTime: { $gte: req.body.StartDate },
      StartTime: { $lte: req.body.EndDate },
    }).exec();
    //res.send(doc)
    return res.status(200).json(doc);
  } catch (err) {
    return res.status(500).json();
  }

  /*
  if((eventData[b].patient)&&(prevPatientRef.patient)){
    console.log('tiene y tuvo ref: ',prevPatientRef)
    if((eventData[b].patient !== prevPatientRef.patient)){
      //delete appointmentRef from previous Patient
      const doc1 = await Patient.findOneAndUpdate({_id: prevPatientRef.patient}, 
        {$pull: {'appointments': eventData[b]._id}})
    }
    else{}             
  }
  else{
    console.log('No tiene y No tuvo ref: ',prevPatientRef) 
  }
*/

  //console.log("getTransactions", data)
  // try {
  //   const transactions = await Transaction.find();

  //   return res.status(200).json({
  //     success: true,
  //     count: transactions.length,
  //     data: transactions
  //   });
  // } catch (err) {
  //   return res.status(500).json({
  //     success: false,
  //     error: 'Server Error'
  //   });
  // }
  // return res.status(200).json({
  //       //success: true,
  //       //count: Events.length,
  //       Events: Events
  //     });
  //return res.status(200).json(Events)
  //return res.status(200).json(await Appointment.find({}))
};

// @desc    Get all transactions
// @route   GET /api/v1/transactions
// @access  Public
export const searchPatients = async (req, res, next) => {
  console.log("SCHEDULE - searchPatients: ", req.body);
  //console.log("queryPatients: ", req.body.select)
  //console.log("addTransactions: ", req.body.where[0].value)

  //return res.status(200).json(await Patient.find({}))
  //const arr1=req.query.$filter.split(',')
  //console.log(arr1)
  //return await Patient.find({ lastName: new RegExp(args.lastName) })
  //return await Patient.find({ lastName: new RegExp(searchquery) })
  //if (req.body.where!==null){
  if (typeof req.body.where !== "undefined") {
    //console.log("queryPatients.where.value: ", req.body.where[0].value)
    const searchquery = req.body.where[0].value;
    return res
      .status(200)
      .json(
        await Patient.find(
          { lastName: new RegExp(searchquery, "i") },
          "lastName lastName2 firstName historyId _id"
        )
      );

    //return res.status(200).json([])
  } else {
    return res.status(400).json([]);
  }
};
/*
  Patient.find(req.params.)
  .populate('lastName')
  .exec()
  .then(patient => {
    if (!patient) {
      return res.status(404).json({
        message: "Patient not found"
      });
    }
    res.status(200).json({
      patient: patient,
      request: {
        type: "GET",
        url: "http://localhost:3000/patients"
      }
    });
  })
  .catch(err => {
    res.status(500).json({
      error: err
    });
  });
*/
