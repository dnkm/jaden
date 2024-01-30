import { useState } from "react";
import { Tables } from "../../../types/supabase";
import Calendar from "../../component/calendar";
import DateView from "./date-view";

export default function TeacherSessions() {
  let [sessions, setSessions] = useState<Tables<"sessions">[]>([]);
  let [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  function load() {}

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
