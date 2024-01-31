import { useContext, useState } from "react";
import { SUBJECTS } from "../../utils/constants";
import { AppContext } from "../../App";
import { Enums, Tables } from "../../../types/supabase";
import { supabase } from "../../supabaseClient";
import { setHours } from "date-fns";

export default function SessionForm({
  setSessions,
  selectedDate,
}: {
  setSessions: Function;
  selectedDate: Date;
}) {
  let [time, setTime] = useState<number>(14);
  let [subject, setSubject] = useState<Enums<"subject">>(SUBJECTS[0]);
  let [limit, setLimit] = useState<number>(1);
  const { profile } = useContext(AppContext);

  async function handleAdd() {
    let entry = {
      limit,
      teacher: profile!.id,
      subject,
      datetime: setHours(selectedDate, time).toUTCString(),
      taken: 0,
    };
    let { data } = await supabase.from("sessions").insert(entry).single();
    setSessions((p: Tables<"sessions">[]) => [...p, data]);
  }

  return (
    <dialog className="modal" id="teacher_session_form_modal">
      <div className="modal-box">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>

        <h3>Add a new session</h3>
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
                    "btn join-item " + (time === t ? "btn-primary" : "")
                  }
                  onClick={() => setTime(t)}
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

          <button className="mt-5 btn btn-primary" onClick={handleAdd}>
            Add
          </button>
        </div>
      </div>
    </dialog>
  );
}
