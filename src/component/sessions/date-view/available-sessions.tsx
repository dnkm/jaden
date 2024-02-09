import { useState } from "react";
import { supabase } from "../../../supabaseClient";
import { endOfDay, startOfDay } from "date-fns";

export default function AvailableSessions({
  selectedDate,
}: {
  selectedDate: Date;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [sessions, setSessions] = useState<any[] | null>(null);

  async function show() {
    setLoading(true);
    let { data } = await supabase
      .from("sessions")
      .select("*")
      .gte("datetime", startOfDay(selectedDate).toISOString())
      .lte("datetime", endOfDay(selectedDate).toISOString());
    setSessions(data);
    setLoading(false);
  }

  return (
    <div className="card bg-base-200">
      {sessions ? (
        <div className="p-2">
          <h3>{sessions.length} session{sessions.length > 1 && "s"}</h3>
        </div>
      ) : (
        <button onClick={show} className="btn btn-primary" disabled={loading}>
          Show Sessions
        </button>
      )}
    </div>
  );
}
