import React, { useState, useRef, useEffect } from "react";
import Tooltip from "@mui/material/Tooltip";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import { myclient } from "@/graphqlClient/myclient";
import EventDialog from "./EventDialog";
import { statusToColor } from "@/features/scheduler/statusToColor";
import { defaultEvent } from "@/features/scheduler/defaultEvent";
import "./styling.css";

import {
  ADD_APPOINTMENT,
  UPDATE_APPOINTMENT,
  DELETE_APPOINTMENT,
} from "@/features/scheduler/api/gqlQueries_appointments";





// ---------- Helpers ----------
const parseDate = (value) => (value ? new Date(value) : null);

const mapEventToInput = (input= false) => {
  if (!input) return null;
  const evt = input.event || {};
  return {
    id: evt.id ?? input.id ?? null,
    appointmentId: evt.extendedProps?.appointmentId ?? input.appointmentId ?? null,
    start: evt.startStr ?? input.start ?? "",
    end: evt.endStr ?? input.end ?? "",
    type: evt.extendedProps?.type ?? input.type ?? "CONSULTA",
    status: evt.extendedProps?.status ?? input.status ?? "PROGRAMADA",
    patientId: evt.extendedProps?.patientId ?? input.patientId ?? null,
    fullName: evt.extendedProps?.fullName ?? input.fullName ?? "",
    notRegistered:
      (evt.extendedProps?.notRegistered ?? input.notRegistered ?? "").toUpperCase(),
    description: evt.extendedProps?.description ?? input.description ?? "",

  };
};

const buildAppointmentInput = (eventData) => {
  const patientId = eventData.patientId ? Number(eventData.patientId) : null;
  const isRegistered = !!patientId;
  return {
    start: eventData.start,
    end: eventData.end,
    type: eventData.type,
    status: eventData.status,
    patientId,
    notRegistered: isRegistered ? "" : eventData.notRegistered ?? "",
    description: eventData.description ?? "",
  };
};

// ---------- Event content ----------
const truncate = (str, n = 40) =>
  str && str.length > n ? str.slice(0, n) + "…" : str;

function renderEventContent(eventInfo) {
  const { timeText, event, view } = eventInfo;
  const { type, fullName, notRegistered, status = "", description } =
    event.extendedProps || {};

  return (
    <Tooltip
      placement="bottom-start"
      title={
        <>
          <b>{timeText}</b>&nbsp;<span className="event-type">{type}</span>
          <br />
          <span style={{ fontWeight: 500 }}>{fullName}</span>{" "}
          {notRegistered && <span style={{ color: "red" }}>({notRegistered})</span>}
          <br />
          <span>Status: <b>{status}</b></span>
          {description && (
            <>
              <br />
              <span>{description}</span>
            </>
          )}
        </>
      }
    >
      <div className={`fc-event-main ${status.toLowerCase()}`}>
        {view.type === "timeGridDay" ? (
          <>
            <b>{timeText}</b>&nbsp;<span className="event-type">{type}</span>
            <br />
            <span>{fullName}</span>{" "}
            {notRegistered && <span style={{ color: "red" }}>({notRegistered})</span>}
            {description && (
              <>
                <br />
                <small style={{ color: "#666" }}>{truncate(description)}</small>
              </>
            )}
          </>
        ) : (
          <>
            <b>{timeText}</b>
            <br />
            <span className="event-type">{type}</span>
          </>
        )}
      </div>
    </Tooltip>
  );
}

// ---------- GraphQL error logger ----------
const logGraphQLError = (context, err) => {
  if (err.response?.errors?.length) {
    console.error(`[Appointments] ${context} failed:`, err.response.errors);
    return err.response.errors.map((e) => e.message).join(", ");
  } else if (err.message) {
    console.error(`[Appointments] ${context} failed:`, err.message);
    return err.message;
  } else {
    console.error(`[Appointments] ${context} failed:`, err);
    return "Unknown error occurred";
  }
};

// ---------- Component ----------
export default function MyFullCalendar() {
  const [openEventDialog, setOpenEventDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [evt, setEvt] = useState(defaultEvent);
  const [shift, setShift] = useState("13:00:00");
  const [currentView, setCurrentView] = useState(
    localStorage.getItem("calendarView") || "timeGridWeek"
  );
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const calendarRef = useRef(null);

  const handleCloseDialog = () => {
    setOpenEventDialog(false);
    setErrorMsg("");
  };

  const refetchCalendar = () => calendarRef.current?.getApi().refetchEvents();
  const resetEvt = () => setEvt(defaultEvent);

  useEffect(() => {
    localStorage.setItem("calendarView", currentView);
  }, [currentView]);

  // ---------- GraphQL handlers ----------
  const handleAddingEvt = async (data) => {
    if (!data) return;
    const eventData = mapEventToInput(data, false);
    try {
      setLoading(true);
      const res = await myclient.request(ADD_APPOINTMENT, {
        input: buildAppointmentInput(eventData),
      });
      if (res?.addAppointment) refetchCalendar();
    } catch (err) {
      setErrorMsg(logGraphQLError("Add", err));
    } finally {
      setLoading(false);
      resetEvt();
    }
  };

  const handleChangingEvt = async (input) => {
    const eventData = mapEventToInput(input, true);
    if (!eventData) return;
    try {
      setLoading(true);
      const res = await myclient.request(UPDATE_APPOINTMENT, {
        id: eventData.id,
        input: buildAppointmentInput(eventData),
      });
      if (res?.updateAppointment) refetchCalendar();
    } catch (err) {
      setErrorMsg(logGraphQLError("Update", err));
    } finally {
      setLoading(false);
      resetEvt();
    }
  };

  const handleRemovingEvt = async (data) => {
    if (!data?.id) return;
    try {
      setLoading(true);
      const res = await myclient.request(DELETE_APPOINTMENT, { id: data.id });
      if (res?.deleteAppointment) refetchCalendar();
    } catch (err) {
      setErrorMsg(logGraphQLError("Delete", err));
    } finally {
      setLoading(false);
      resetEvt();
    }
  };

  // ---------- Calendar handlers ----------
  const handleDateSelect = (selectInfo) => {
    selectInfo.view.calendar.unselect();
    setIsEditing(false);
    setEvt({
      ...defaultEvent,
      start: selectInfo.startStr,
      end: selectInfo.endStr,
    });
    setOpenEventDialog(true);
  };

  const handleEventClick = (clickInfo) => {
    setIsEditing(true);
    setEvt(mapEventToInput({ event: clickInfo.event }, true));
    setOpenEventDialog(true);
  };

  // ---------- Fetch events ----------
  const fetchEvents = async (info, successCallback, failureCallback) => {
    try {
      const res = await fetch(
        `/api/v1/fullCalendar/getDataFull?start=${info.startStr}&end=${info.endStr}`
      );
      if (!res.ok) return failureCallback(new Error(`HTTP ${res.status}`));
      const data = await res.json();

      const normalized = data.map((evt) => {
        const parsedStart = parseDate(evt.start);
        const parsedEnd = parseDate(evt.end);

        return {
          ...evt,
          id: evt.id, // use DB appointment id
          start: parsedStart,
          end: parsedEnd,
          backgroundColor: statusToColor(evt.status),
        };
      });

      successCallback(normalized);
    } catch (err) {
      console.error(err);
      failureCallback(err);
    }
  };

  return (
    <div className="relative">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        contentHeight="auto"
        initialView={currentView}
        datesSet={(info) => setCurrentView(info.view.type)}
        allDaySlot={false}
        slotDuration="00:20:00"
        slotMinTime={shift}
        slotMaxTime="23:59:00"
        firstDay={1}
        nowIndicator
        editable
        selectable
        selectMirror
        dayMaxEvents
        select={handleDateSelect}
        eventContent={renderEventContent}
        eventClick={handleEventClick}
        eventChange={handleChangingEvt}
        events={fetchEvents}
        locale="es"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right:
            "dayGridMonth,timeGridWeek,timeGridDay,timeGridWeekDays,shiftButton",
        }}
        customButtons={{
          shiftButton: {
            text: "[1]-[1/2]",
            click: () =>
              setShift((prev) => (prev === "13:00:00" ? "07:00:00" : "13:00:00")),
          },
        }}
        views={{
          dayGridMonth: { titleFormat: { year: "numeric", month: "short" } },
          timeGridWeek: { titleFormat: { month: "short", day: "2-digit" } },
          timeGridDay: { titleFormat: { year: "numeric", month: "short", day: "2-digit" } },
          timeGridWeekDays: {
            type: "timeGrid",
            hiddenDays: [0, 6],
            duration: { days: 7 },
            buttonText: "5-Day",
          },
        }}
      />

      <EventDialog
        show={openEventDialog}
        isEditing={isEditing}
        evt={evt}
        closeDialog={handleCloseDialog}
        handleAddingEvt={handleAddingEvt}
        handleChangingEvt={handleChangingEvt}
        handleRemovingEvt={handleRemovingEvt}
        errorMsg={errorMsg}
      />

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white px-6 py-4 rounded-lg shadow-lg text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-gray-700 font-medium">Loading...</p>
          </div>
        </div>
      )}
    </div>
  );
}
