import { format, set } from "date-fns";
import { useContext } from "react";
import { AppContext } from "../../../App";
import { supabase } from "../../../supabaseClient";
import { SessionWithTeachername } from "../component";
import SessionCard from "./session-card";

export default function DateView({
  sessions,
  selectedDate,
  setSessions,
}: {
  sessions: SessionWithTeachername[];
  selectedDate: Date;
  setSessions: Function;
}) {
  const { role, profile, loading, setLoading } = useContext(AppContext);

  async function handleAdd() {
    if (!role?.is_teacher) return;
    setLoading(true);

    let entry = {
      limit: 10,
      teacher: profile!.id,
      datetime: set(selectedDate, {
        hours: selectedDate.getDay() == 5 ? 12 : 11,
        minutes: selectedDate.getDay() == 5 ? 0 : 35,
        seconds: 0,
      }).toUTCString(),
    };
    let { data } = await supabase
      .from("sessions")
      .insert(entry)
      .select("*, enroll(student_id, is_present, profiles(full_name))");
    setSessions((p: SessionWithTeachername[]) => [...p, ...data!]);
    setLoading(false);
  }

  return (
    <div className="mt-5">
      <h2>{format(selectedDate, "MM/dd EEE")}</h2>
      <div className="border rounded p-5 my-5 space-y-5">
        <div className="flex justify-between">
          {role?.is_teacher && sessions.length == 0 && (
            <div>
              <button
                className="btn btn-primary"
                onClick={handleAdd}
                disabled={loading}
              >
                Add Session
              </button>
            </div>
          )}
        </div>

        <div className="space-y-2">
          {sessions.length == 0 && (
            <div className="text-center">No sessions available</div>
          )}
          {sessions.map((s) => (
            <SessionCard
              session={s}
              key={s.session_id}
              setSessions={setSessions}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
