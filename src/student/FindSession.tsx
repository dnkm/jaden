import { QueryData } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { supabase } from "../supabaseClient";

const teachersQuery = supabase
  .from("profiles")
  .select("*, roles!inner(is_teacher), subjects(subject_id,name)");
type ProfilesWithRole = QueryData<typeof teachersQuery>;
// type ProfileWithRole = ProfilesWithRole[number];

export default function FindSession() {
  let [teachers, setTeachers] = useState<ProfilesWithRole>([]);
  const [searchParams] = useSearchParams();
  const test = searchParams.get("test");

  useEffect(() => {
    teachersQuery.eq("roles.is_teacher", true).then(({ data }) => {
      setTeachers(data!);
    });
  }, []);

  return (
    <div className="space-y-3">
      <h1>Find a session</h1>
      <div className="divider"></div>
      <table className="table table-zebra">
        <thead>
          <tr className="bg-base-300">
            <th>Teacher</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {teachers
            .filter(
              (p) =>
                test === "true" ||
                ![
                  "9d50bc4d-ba3a-4679-9883-eed17d157f36",
                  "c47bf0d5-a625-4bc9-a0a3-7466558b3b2a",
                ].includes(p.id)
            )
            .map((p) => (
              <tr key={p.id}>
                <td>{p.full_name}</td>
                <td>
                  <Link to={`/student/find/${p.full_name}/${p.id}`}>
                    <button className="btn btn-primary">Select</button>
                  </Link>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
