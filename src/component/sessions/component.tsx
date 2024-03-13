import { QueryData } from "@supabase/supabase-js";
import { addMonths, endOfMonth, format, startOfMonth } from "date-fns";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../App";
import { supabase } from "../../supabaseClient";
import Calendar from "../calendar";
import DateView from "./date-view";

const sessionsWithTeachernameQuery = supabase
  .from("sessions")
  .select(
    "*, profiles!sessions_teacher_fkey(full_name), enroll(student_id, is_present, note, profiles(full_name))"
  );
type SessionsWithTeachername = QueryData<typeof sessionsWithTeachernameQuery>;
export type SessionWithTeachername = SessionsWithTeachername[number];

export default function Sessions() {
  let [sessions, setSessions] = useState<SessionsWithTeachername>([]);
  let [d, setD] = useState<Date>(new Date());
  let { profile, role } = useContext(AppContext);
  let { teacher_id } = useParams();

  async function updateSession(session_id: number) {
    let { data } = await supabase
      .from("sessions")
      .select(
        "*, profiles!sessions_teacher_fkey(full_name), enroll(student_id, is_present, note, profiles(full_name))"
      )
      .eq("session_id", session_id);

    if (data?.length == 0) {
      // deleted
      setSessions((prev) => prev.filter((v) => v.session_id !== session_id));
    } else if (sessions.find((v) => v.session_id === session_id)) {
      setSessions((prev) =>
        prev.map((v) => (v.session_id === session_id ? data![0] : v))
      );
    } else {
      setSessions((prev) => [...prev, data![0]]);
    }
  }

  function loadSessions() {
    if (teacher_id) {
      supabase
        .from("sessions")
        .select(
          "*, profiles!sessions_teacher_fkey(full_name), enroll(student_id, is_present, note, profiles(full_name))"
        )
        .eq("teacher", teacher_id)
        .gte("datetime", startOfMonth(d).toISOString())
        .lte("datetime", endOfMonth(d).toISOString())
        .order("datetime")
        .then(({ data }) => setSessions(data!));
    } else if (role?.is_teacher) {
      supabase
        .from("sessions")
        .select(
          "*, profiles!sessions_teacher_fkey(full_name), enroll(student_id, is_present, note, profiles(full_name))"
        )
        .eq("teacher", profile!.id)
        .gte("datetime", startOfMonth(d).toISOString())
        .lte("datetime", endOfMonth(d).toISOString())
        .order("datetime")
        .then(({ data }) => {
          setSessions(data!);
        });
    } else {
      supabase
        .from("sessions")
        .select(
          "*, profiles!sessions_teacher_fkey(full_name), enroll!inner(student_id, is_present, note, profiles(full_name))"
        )
        .gte("datetime", startOfMonth(d).toISOString())
        .lte("datetime", endOfMonth(d).toISOString())
        .eq("enroll.student_id", profile!.id)
        .order("datetime")
        .then(({ data }) => {
          setSessions(data!);
        });
    }
  }

  useEffect(() => {
    loadSessions();
  }, [teacher_id, d]);

  let sessionsMap = sessions.reduce(
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
            onClick={() => setD(addMonths(d, -1))}
          >
            {"<"}
          </button>
          <button
            className="btn btn-sm btn-primary join-item"
            onClick={() => setD(new Date())}
          >
            Today
          </button>
          <button
            className="btn btn-sm btn-primary join-item"
            onClick={() => setD(addMonths(d, 1))}
          >
            {">"}
          </button>
        </div>
      </div>
      <Calendar onDateClicked={setD} sessionsMap={sessionsMap} d={d} />
      {d && (
        <DateView
          selectedDate={d}
          updateSession={updateSession}
          sessions={sessionsMap[d.getDate()] || []}
        />
      )}
    </div>
  );
}
