import { set } from "date-fns";
import { useContext, useState } from "react";
import { Tables } from "../../../types/supabase";
import { AppContext } from "../../App";
import { supabase } from "../../supabaseClient";
import { SessionsWithTeachername } from "./component";

const TIMES = [
  { id: 1, display: "1:35PM", hour: 13, minute: 35 },
  { id: 2, display: "2:00PM", hour: 14, minute: 0 },
];

export default function SessionForm({
  setSessions,
  selectedDate,
  formEntry,
}: {
  setSessions: Function;
  selectedDate: Date;
  formEntry: Tables<"sessions"> | undefined;
}) {
  let [timeId, setTimeId] = useState<number>(
    formEntry
      ? TIMES.find((t) => new Date(formEntry.datetime).getHours() === t.hour)
          ?.id || 1
      : 1
  );
  let [limit, setLimit] = useState<number>(formEntry?.limit || 1);
  let [loading, setLoading] = useState<boolean>(false);
  const { profile } = useContext(AppContext);
  const modal_id = formEntry
    ? "edit_session" + formEntry.session_id
    : "add_session_modal";

  async function handleUpdate() {
    console.log("updating");
    setLoading(true);
    let entry = {
      limit,
      datetime: set(selectedDate, {
        hours: timeId,
        minutes: 0,
        seconds: 0,
      }).toUTCString(),
    };
    let { error } = await supabase
      .from("sessions")
      .update(entry)
      .eq("session_id", 6);

    if (error) {
      alert("Something went wrong!");
    } else {
      setSessions((p: SessionsWithTeachername[]) =>
        p.map((ss) =>
          ss.session_id === formEntry!.session_id ? { ...ss, ...entry } : ss
        )
      );
    }

    setLoading(false);
    (document.getElementById(modal_id) as HTMLDialogElement).close();
  }

  async function handleAdd() {
    setLoading(true);
    let time = TIMES.find((t) => t.id === timeId);
    let entry = {
      limit,
      teacher: profile!.id,
      datetime: set(selectedDate, {
        hours: time!.hour,
        minutes: time!.minute,
        seconds: 0,
      }).toUTCString(),
    };
    let { data } = await supabase
      .from("sessions")
      .insert(entry)
      .select("*, profiles!sessions_teacher_fkey(full_name)");
    setSessions((p: SessionsWithTeachername[]) => [...p, ...data!]);
    setLoading(false);
    (document.getElementById(modal_id) as HTMLDialogElement).close();
  }

  return (
    <dialog className="modal" id={modal_id}>
      <div className="modal-box max-w-screen-2xl">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>

        <h1>***{timeId}</h1>

        <h3>{!!formEntry ? "Update session" : "Add a new session"} </h3>
        <div className="form space-y-5">
          {/* time selector */}
          <div className="form-control">
            <label>Time</label>
            <div className="join">
              {TIMES.map((t) => (
                <button
                  type="button"
                  key={t.id}
                  className={
                    "btn join-item " + (timeId === t.id ? "btn-primary" : "")
                  }
                  onClick={() => setTimeId(t.id)}
                >
                  {t.display}
                </button>
              ))}
            </div>
          </div>

          {/* number of students */}
          <div className="form-control">
            <label>Size (number of students)</label>
            <div className="join">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40, 50].map((s) => (
                <button
                  type="button"
                  key={s}
                  className={
                    "btn join-item " + (limit === s ? "btn-primary" : "")
                  }
                  onClick={() => setLimit(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button
            className="mt-5 btn btn-primary"
            onClick={formEntry ? handleUpdate : handleAdd}
            disabled={loading}
          >
            {formEntry ? "Update" : "Add"}
          </button>
        </div>
      </div>
    </dialog>
  );
}
