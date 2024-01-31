import { set } from "date-fns";
import { useContext, useState } from "react";
import { Enums, Tables } from "../../../types/supabase";
import { AppContext } from "../../App";
import { supabase } from "../../supabaseClient";
import { SUBJECTS } from "../../utils/constants";
import { SessionsWithTeachername } from "./component";

export default function SessionForm({
  setSessions,
  selectedDate,
  formEntry,
}: {
  setSessions: Function;
  selectedDate: Date;
  formEntry: Tables<"sessions"> | undefined;
}) {
  let [hour, setHour] = useState<number>(
    formEntry ? new Date(formEntry.datetime).getHours() : 14
  );
  let [subject, setSubject] = useState<Enums<"subject">>(
    formEntry?.subject || SUBJECTS[0]
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
      subject,
      datetime: set(selectedDate, {
        hours: hour,
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
    let entry = {
      limit,
      teacher: profile!.id,
      subject,
      datetime: set(selectedDate, {
        hours: hour,
        minutes: 0,
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
      <div className="modal-box">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>

        <h3>{!!formEntry ? "Update session" : "Add a new session"} </h3>
        <div className="form space-y-5">
          {/* time selector */}
          <div className="form-control">
            <label>Time</label>
            <div className="join">
              {[14, 15, 16, 17, 18].map((t) => (
                <button
                  type="button"
                  key={t}
                  className={
                    "btn join-item " + (hour === t ? "btn-primary" : "")
                  }
                  onClick={() => setHour(t)}
                >
                  {t - 12} pm
                </button>
              ))}
            </div>
          </div>

          {/* subject selector */}
          <div className="form-control">
            <label>Subject</label>
            <div className="join">
              {SUBJECTS.map((s) => (
                <button
                  type="button"
                  key={s}
                  className={
                    "btn join-item " + (subject === s ? "btn-primary" : "")
                  }
                  onClick={() => setSubject(s as Enums<"subject">)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* number of students */}
          <div className="form-control">
            <label>Size (number of students)</label>
            <div className="join">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
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
