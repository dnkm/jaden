import { QueryData } from "@supabase/supabase-js";
import { format, set } from "date-fns";
import { useContext, useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { AppContext } from "../../App";
import { supabase } from "../../supabaseClient";
import { SessionsWithTeachername } from "./component";
import SessionForm from "./session-form";

export default function DateView({
  sessions,
  selectedDate,
  setSessions,
}: {
  sessions: SessionsWithTeachername[];
  selectedDate: Date;
  setSessions: Function;
}) {
  const { role, profile, loading, setLoading } = useContext(AppContext);

  function openForm() {
    (
      document.getElementById("add_session_modal") as HTMLDialogElement
    ).showModal();
  }

  async function handleAdd() {
    if (!role?.is_teacher) return;
    setLoading(true);

    let entry = {
      limit: 50,
      teacher: profile!.id,
      datetime: set(selectedDate, {
        hours: selectedDate.getDay() == 5 ? 2 : 1,
        minutes: selectedDate.getDay() == 5 ? 0 : 30,
        seconds: 0,
      }).toUTCString(),
    };
    let { data } = await supabase
      .from("sessions")
      .insert(entry)
      .select("*, profiles!sessions_teacher_fkey(full_name)");
    setSessions((p: SessionsWithTeachername[]) => [...p, ...data!]);
    setLoading(false);
  }

  return (
    <div className="border rounded p-5 my-5 space-y-5">
      <div className="flex justify-between">
        <h3>{format(selectedDate, "MM/dd EEE")}</h3>
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
        {sessions.map((s) => (
          <SessionCard s={s} key={s.session_id} setSessions={setSessions} />
        ))}
      </div>

      <SessionForm
        setSessions={setSessions}
        selectedDate={selectedDate}
        formEntry={undefined}
      />
    </div>
  );
}

function SessionCard({
  s,
  setSessions,
}: {
  s: SessionsWithTeachername;
  setSessions: Function;
}) {
  const enrollQuery = supabase
    .from("enroll")
    .select("*, profiles(full_name)")
    .eq("session_id", s.session_id);
  type SessionCardEnrolls = QueryData<typeof enrollQuery>;

  const [loading, setLoading] = useState<boolean>(false);
  const { role, profile } = useContext(AppContext);
  const [students, setStudents] = useState<SessionCardEnrolls>([]);

  useEffect(() => {
    enrollQuery.then(({ data }) => setStudents(data!));
  }, []);

  async function handleSignup() {
    setLoading(true);
    const { data, error } = await supabase
      .from("enroll")
      .insert({
        session_id: s.session_id,
        student_id: profile!.id,
      })
      .select("*, profiles(full_name)");
    if (error) {
      alert("Something went wrong!");
    } else {
      setStudents((p) => [...p, ...data]);
    }
    setLoading(false);
  }

  return (
    <div className="card bg-base-200">
      <div className="card-body">
        <h2 className="card-title flex justify-between">
          <div>{format(new Date(s.datetime), "h:mm")}</div>
          <div>{s.profiles?.full_name}</div>
        </h2>
        <div>
          {students.map((s) => (
            <div className="badge badge-accent" key={s.student_id}>
              {s.profiles?.full_name}
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
                    "edit_session" + s.session_id
                  ) as HTMLDialogElement
                ).showModal();
              }}
            >
              <FaRegEdit />
            </button>
          ) : students.find((ss) => ss.student_id === profile?.id) ? (
            <button className="btn btn-warning">Cancel</button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={handleSignup}
              disabled={loading || students.length >= s.limit}
            >
              Sign up
            </button>
          )}
        </div>
      </div>

      <SessionForm
        setSessions={setSessions}
        selectedDate={new Date(s.datetime)}
        formEntry={s}
      />
    </div>
  );
}
