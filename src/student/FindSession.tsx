import { QueryData } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";

const teachersQuery = supabase
  .from("profiles")
  .select("*, roles!inner(is_teacher), subjects(subject_id,name)");
type ProfilesWithRole = QueryData<typeof teachersQuery>;
// type ProfileWithRole = ProfilesWithRole[number];

export default function FindSession() {
  let [teachers, setTeachers] = useState<ProfilesWithRole>([]);

  useEffect(() => {
    teachersQuery.eq("roles.is_teacher", true).then(({ data }) => {
      setTeachers(data!);
    });
  }, []);

  return (
    <div className="space-y-3">
      <h1>Find a session</h1>
      <div className="divider"></div>
      <h2>Teachers</h2>
      <table className="table table-zebra">
        <thead>
          <tr className="bg-base-300">
            <th>Name</th>
            <th>Subjects</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {teachers.map((p) => (
            <tr key={p.id}>
              <td>{p.full_name}</td>
              <td>
                {p.subjects.map((s) => (
                  <div key={s.subject_id}>{s.name}</div>
                ))}
              </td>
              <td>
                <Link to={`/student/find/${p.full_name}/${p.id}`}>
                  <button className="btn btn-primary">Sessions</button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
