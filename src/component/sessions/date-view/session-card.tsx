import { format } from "date-fns";
import { useContext } from "react";
import { FaCheck, FaRegEdit, FaUser } from "react-icons/fa";
import { AppContext } from "../../../App";
import { supabase } from "../../../supabaseClient";
import { SessionWithTeachername } from "../component";
import SessionForm from "../session-form";

export default function SessionCard({
  session,
  updateSession,
}: {
  session: SessionWithTeachername;
  updateSession: Function;
}) {
  const { role, profile, loading, setLoading } = useContext(AppContext);
  let signedup: boolean = !!session.enroll.find(
    (e) => e.student_id === profile?.id
  );

  async function handleSignup() {
    setLoading(true);
    const { error } = await supabase
      .from("enroll")
      .insert({
        session_id: session.session_id,
        student_id: profile!.id,
      })
      .select("student_id, is_present, profiles(full_name)");
    if (error) {
      alert("Oops, looks like you are already enrolled");
    } else {
      updateSession(session.session_id);
    }
    setLoading(false);
  }

  async function handleCancel() {
    setLoading(true);
    const { error } = await supabase
      .from("enroll")
      .delete()
      .eq("student_id", profile!.id)
      .eq("session_id", session.session_id);
    if (error) {
      alert("Something went wrong!");
    } else {
      updateSession(session.session_id);
    }
    setLoading(false);
  }

  async function handleChangeNote() {
    console.log(session.enroll[0].note);
    if (role?.is_teacher) return;
    let note = prompt(
      "enter a note for the teacher",
      session.enroll[0].note || ""
    );
    if (note === null) return;

    setLoading(true);
    const { error } = await supabase
      .from("enroll")
      .update({ note })
      .eq("student_id", profile!.id)
      .eq("session_id", session.session_id);
    if (error) {
      alert("Something went wrong!");
    } else {
      updateSession(session.session_id);
    }
    setLoading(false);
  }

  async function togglePresence(student_id: string) {
    if (!role?.is_teacher) return;
    setLoading(true);
    let record = session.enroll.find((e) => e.student_id === student_id);
    await supabase
      .from("enroll")
      .update({ is_present: !record!.is_present })
      .eq("student_id", student_id)
      .eq("session_id", session.session_id);
    updateSession(session.session_id);
    setLoading(false);
  }

  const isFull = session.limit <= session.taken;

  return (
    <div className="card bg-base-200">
      <div className="card-body">
        <h2 className="card-title flex justify-between">
          <div>{format(new Date(session.datetime), "h:mm")}</div>
          <div>{session.name}</div>
          <div className="text-sm">{session.profiles?.full_name}</div>
        </h2>
        {/* show enrolled students for teachers */}
        <div>
          {session.enroll.map((s) => (
            <div
              className="flex items-center m-0.5 space-x-2 bg-base-300 rounded"
              key={s.student_id}
            >
              <div
                className="hover:bg-base-100 h-7 w-7 cursor-pointer center"
                onClick={() => togglePresence(s.student_id)}
              >
                {s.is_present ? (
                  <FaCheck className="text-success" />
                ) : (
                  <FaUser className="text-primary" />
                )}
              </div>
              <span className="font-bold">{s.profiles?.full_name}</span>
              <div className="flex items-center">
                <div
                  className="hover:bg-base-100 h-7 w-7 cursor-pointer center"
                  onClick={() => handleChangeNote()}
                >
                  <FaRegEdit className="" />
                </div>
                {s.note}
              </div>
            </div>
          ))}
        </div>
        <div className="card-actions justify-end">
          {role?.is_teacher ? (
            <button
              className="btn btn-primary"
              onClick={() => {
                (
                  document.getElementById(
                    "edit_session" + session.session_id
                  ) as HTMLDialogElement
                ).showModal();
              }}
            >
              <FaRegEdit />
            </button>
          ) : signedup ? (
            <button className="btn btn-warning" onClick={handleCancel}>
              Cancel
            </button>
          ) : isFull ? (
            <button className="btn btn-disabled">Full</button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={handleSignup}
              disabled={loading}
            >
              Sign up
            </button>
          )}
        </div>
      </div>

      <SessionForm updateSession={updateSession} session={session} />
    </div>
  );
}
