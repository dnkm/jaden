import { QueryData } from "@supabase/supabase-js";
import { useContext, useEffect, useState } from "react";
import Calendar from "../calendar";
import { supabase } from "../../supabaseClient";
import DateView from "./date-view";
import { AppContext } from "../../App";
import {
  addMonths,
  endOfMonth,
  format,
  isSameMonth,
  startOfMonth,
} from "date-fns";

const sessionsWithTeachernameQuery = supabase
  .from("sessions")
  .select("*, profiles(full_name), enroll(student_id, is_present, profiles(full_name))")
  .single();
export type SessionsWithTeachername = QueryData<
  typeof sessionsWithTeachernameQuery
>;

export default function Sessions() {
  let [sessions, setSessions] = useState<SessionsWithTeachername[]>([]);
  let [d, setD] = useState<Date>(new Date());
  let { profile, role } = useContext(AppContext);

  function load(d: Date) {
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
          console.log(data);
          setSessions(data!);
        });
    } else {
      supabase
        .from("sessions")
        .select(
          "*, profiles!sessions_teacher_fkey(full_name), enroll(student_id, is_present, profiles(full_name))"
        )
        .gte("datetime", startOfMonth(d).toISOString())
        .lte("datetime", endOfMonth(d).toISOString())
        // .eq("enroll.student_id", profile!.id)
        .order("datetime")
        .then(({ data }) => {
          setSessions(data!);
        });
    }
  }

  useEffect(() => {
    load(new Date());
  }, []);

  function changeDate(d2: Date) {
    if (!isSameMonth(d, d2)) {
      load(d2);
    }
    setD(d2);
  }

  let sessionsMap = sessions.reduce(
    (acc: { [key: number]: SessionsWithTeachername[] }, curr) => {
      let date = new Date(curr.datetime).getDate();
      if (!acc[date]) acc[date] = [];
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
          setSessions={setSessions}
          sessions={sessionsMap[d.getDate()] || []}
        />
      )}
    </div>
  );
}
