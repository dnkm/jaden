import { QueryData } from "@supabase/supabase-js";
import {
  addMonths,
  endOfMonth,
  format,
  isSameMonth,
  startOfMonth,
} from "date-fns";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../App";
import { supabase } from "../../supabaseClient";
import Calendar from "../calendar";
import DateView from "./date-view";
import { useParams } from "react-router-dom";

const sessionsWithTeachernameQuery = supabase
  .from("sessions")
  .select(
    "*, profiles(full_name), enroll(student_id, is_present, profiles(full_name))"
  );
type SessionsWithTeachername = QueryData<typeof sessionsWithTeachernameQuery>;

export type SessionWithTeachername = SessionsWithTeachername[number];

export default function Sessions() {
  let [mySessions, setMySessions] = useState<SessionsWithTeachername>([]);
  let [searchSessions, setSearchSessions] = useState<SessionsWithTeachername>(
    []
  );
  let [d, setD] = useState<Date>(new Date());
  let { profile, role } = useContext(AppContext);
  let { teacher_id } = useParams();

  function loadSearchSessions(d: Date) {
    if (!teacher_id) {
      setSearchSessions([]);
      return;
    }
    supabase
      .from("sessions")
      .select(
        "*, profiles!sessions_teacher_fkey(full_name), enroll(student_id, is_present, profiles(full_name))"
      )
      .eq("teacher", teacher_id)
      .gte("datetime", startOfMonth(d).toISOString())
      .lte("datetime", endOfMonth(d).toISOString())
      .order("datetime")
      .then(({ data }) => setSearchSessions(data!));
  }

  function loadMySessions(d: Date) {
    if (role?.is_teacher) {
      supabase
        .from("sessions")
        .select(
          "*, profiles!sessions_teacher_fkey(full_name), enroll(student_id, is_present, profiles(full_name))"
        )
        .eq("teacher", profile!.id)
        .gte("datetime", startOfMonth(d).toISOString())
        .lte("datetime", endOfMonth(d).toISOString())
        .order("datetime")
        .then(({ data }) => {
          setMySessions(data!);
        });
    } else {
      supabase
        .from("sessions")
        .select(
          "*, profiles!sessions_teacher_fkey(full_name), enroll!inner(student_id, is_present, profiles(full_name))"
        )
        .gte("datetime", startOfMonth(d).toISOString())
        .lte("datetime", endOfMonth(d).toISOString())
        .eq("enroll.student_id", profile!.id)
        .order("datetime")
        .then(({ data }) => {
          setMySessions(data!);
        });
    }
  }

  useEffect(() => {
    loadMySessions(new Date());
  }, []);

  useEffect(() => {
    loadSearchSessions(new Date());
  }, [teacher_id]);

  function changeDate(d2: Date) {
    if (!isSameMonth(d, d2)) {
      loadMySessions(d2);
      loadSearchSessions(d2);
    }
    setD(d2);
  }

  let sessionsMap = [...mySessions, ...searchSessions].reduce(
    (acc: { [key: number]: SessionsWithTeachername }, curr) => {
      let date = new Date(curr.datetime).getDate();
      if (!acc[date]) acc[date] = [];
      if (!acc[date].find((s) => s.session_id === curr.session_id))
        acc[date].push(curr);
      return acc;
    },
    {}
  );

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-right">{format(d, "yyyy / MM")}</h1>

        <div className="join">
          <button
            className="btn btn-sm btn-primary join-item"
            onClick={() => changeDate(addMonths(d, -1))}
          >
            {"<"}
          </button>
          <button
            className="btn btn-sm btn-primary join-item"
            onClick={() => changeDate(new Date())}
          >
            Today
          </button>
          <button
            className="btn btn-sm btn-primary join-item"
            onClick={() => changeDate(addMonths(d, 1))}
          >
            {">"}
          </button>
        </div>
      </div>
      <Calendar onDateClicked={changeDate} sessionsMap={sessionsMap} d={d} />
      {d && (
        <DateView
          selectedDate={d}
          setSessions={setMySessions}
          sessions={sessionsMap[d.getDate()] || []}
        />
      )}
    </div>
  );
}
