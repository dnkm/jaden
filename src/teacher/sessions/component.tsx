import { useContext, useEffect, useState } from "react";
import { Enums, Tables } from "../../../types/supabase";
import { supabase } from "../../supabaseClient";
import DateView from "./date-view";
import Calendar from "../../component/calendar";
import { AppContext } from "../../App";

export default function TeacherSessions() {
  let [sessions, setSessions] = useState<Tables<"sessions">[]>([]);
  let [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const { profile } = useContext(AppContext);

  function load() {
    supabase
      .from("sessions")
      .select("*")
      .eq("teacher", profile!.id)
      .then(({ data }) => {
        setSessions(data!);
      });
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <pre>sessions: {JSON.stringify(sessions)}</pre>
      <h1>Sessions</h1>
      <Calendar onDateClicked={setSelectedDate} />
      {selectedDate && (
        <DateView selectedDate={selectedDate} setSessions={setSessions} />
      )}
    </div>
  );
}
