import { useContext } from "react";
import { SessionWithTeachername } from "../component";
import { AppContext } from "../../../App";
import { supabase } from "../../../supabaseClient";
import { format } from "date-fns";
import { FaRegEdit } from "react-icons/fa";
import SessionForm from "../session-form";

export default function SessionCard({
  session,
  setSessions,
}: {
  session: SessionWithTeachername;
  setSessions: Function;
}) {
  const { role, profile, loading, setLoading } = useContext(AppContext);
  let signedup: boolean = !!session.enroll.find(
    (e) => e.student_id === profile?.id
  );

  async function handleSignup() {
    setLoading(true);
    const { data, error } = await supabase
      .from("enroll")
      .insert({
        session_id: session.session_id,
        student_id: profile!.id,
      })
      .select("student_id, is_present, profiles(full_name)");
    if (error) {
      alert("Something went wrong!");
    } else {
      setSessions((p: SessionWithTeachername[]) =>
        p.find((s) => s.session_id === session.session_id)
          ? p.map((s) =>
              s.session_id === session.session_id
                ? { ...s, enroll: [{ student_id: profile!.id }] }
                : s
            )
          : [...p, { ...session, enroll: [...session.enroll, data[0]] }]
      );
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
      setSessions((p: SessionWithTeachername[]) =>
        p.map((s) =>
          s.session_id !== session.session_id ? s : { ...s, enroll: [] }
        )
      );
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
    setSessions((p: SessionWithTeachername[]) =>
      p.map((s) =>
        s.session_id !== session.session_id
          ? s
          : {
              ...s,
              enroll: session.enroll.map((en) =>
                en.student_id === student_id
                  ? { ...en, is_present: !en.is_present }
                  : en
              ),
            }
      )
    );
    setLoading(false);
  }

  return (
    <div className="card bg-base-200">
      <div className="card-body">
        <h2 className="card-title flex justify-between">
          <div>{format(new Date(session.datetime), "h:mm")}</div>
          <div>{session.name}</div>
          <div className="text-sm">{session.profiles?.full_name}</div>
        </h2>
        <div>
          {session.enroll.map((s) => (
            <div
              className="badge badge-accent m-0.5 cursor-pointer"
              key={s.student_id}
              onClick={() => togglePresence(s.student_id)}
            >
              {s.profiles?.full_name} {s.is_present ? "✔" : ""}
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

      <SessionForm setSessions={setSessions} session={session} />
    </div>
  );
}
