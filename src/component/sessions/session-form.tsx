import { SyntheticEvent, useContext } from "react";
import { AppContext } from "../../App";
import { supabase } from "../../supabaseClient";
import { SessionWithTeachername } from "./component";

export default function SessionForm({
  updateSession,
  session,
}: {
  updateSession: Function;
  session: SessionWithTeachername;
}) {
  const { loading, setLoading } = useContext(AppContext);
  const modal_id = "edit_session" + session.session_id;

  async function handleUpdate(ev: SyntheticEvent<HTMLFormElement>) {
    ev.preventDefault();
    setLoading(true);
    let data = Object.fromEntries(
      new FormData(ev.target as HTMLFormElement).entries()
    );
    let { error } = await supabase
      .from("sessions")
      .update(data)
      .eq("session_id", session.session_id);

    if (error) {
      alert("Something went wrong!");
    } else {
      updateSession(session.session_id);
    }
    setLoading(false);
    (document.getElementById(modal_id) as HTMLDialogElement).close();
  }

  async function handleDelete() {
    if (!confirm("Are you sure?")) return;
    setLoading(true);
    let { error } = await supabase
      .from("sessions")
      .delete()
      .eq("session_id", session.session_id);
    if (error) {
      alert("Something went wrong.");
    } else {
      updateSession(session.session_id);
    }
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

        <h3>{!!session ? "Update session" : "Add a new session"} </h3>
        <form className="form space-y-5" onSubmit={handleUpdate}>
          {/* time selector */}
          {/* <div className="form-control">
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
          </div> */}

          <div className="form-control">
            <label htmlFor="session-name-input">Session Name</label>
            <input
              id="session-name-input"
              className="input input-bordered"
              type="text"
              defaultValue={session.name || ""}
              name="name"
            />
          </div>

          {/* number of students */}
          <div className="form-control">
            <label>Student Limit</label>
            <input
              className="input input-bordered"
              type="number"
              defaultValue={session.limit}
              name="limit"
            />
          </div>

          <div className="space-x-5">
            <button className="mt-5 btn btn-primary" disabled={loading}>
              Update
            </button>

            <button
              className="mt-5 btn btn-warning"
              disabled={loading}
              type="button"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
