import { useContext, useEffect, useState } from "react";
import { Tables } from "../../types/supabase";
import { AppContext } from "../App";
import { supabase } from "../supabaseClient";
import { FaSpinner } from "react-icons/fa";

export default function TeacherSubjects() {
  let [subjects, setSubjects] = useState<Tables<"subjects">[]>([]);
  let [mySubjects, setMySubjects] = useState<number[]>([]);
  let [loadingSubjectId, setLoadingSubjectId] = useState<number | undefined>(
    undefined
  );
  const { profile } = useContext(AppContext);

  const getSubjects = async () => {
    const { data } = await supabase.from("subjects").select("*");
    setSubjects(data!);
  };
  const getMySubjects = async () => {
    const { data } = await supabase
      .from("teacher_subject_map")
      .select("*")
      .eq("teacher_id", profile!.id);
    setMySubjects(data!.map((v) => v.subject_id));
  };

  useEffect(() => {
    getSubjects();
    getMySubjects();
  }, []);

  async function handleToggle(subjectId: number) {
    setLoadingSubjectId(subjectId);
    if (!mySubjects.includes(subjectId)) {
      await supabase
        .from("teacher_subject_map")
        .insert({
          teacher_id: profile!.id,
          subject_id: subjectId,
        })
        .select("*")
        .single();
      setMySubjects((p) => [...p, subjectId]);
    } else {
      await supabase
        .from("teacher_subject_map")
        .delete()
        .eq("subject_id", subjectId);
      setMySubjects((p) => p.filter((v) => v !== subjectId));
    }
    setLoadingSubjectId(undefined);
  }

  return (
    <div>
      <h1>Subjects</h1>
      <div>
        These subjects are utilized by students to refine their search results
      </div>
      <div className="divider"></div>
      <div className="flex flex-wrap">
        {subjects.map((subject) => (
          <button
            className={`btn m-0.5 ${
              mySubjects.includes(subject.subject_id) ? "btn-primary" : ""
            }`}
            key={subject.subject_id}
            disabled={!!loadingSubjectId}
            onClick={() => handleToggle(subject.subject_id)}
          >
            {subject.name}{" "}
            {loadingSubjectId === subject.subject_id && <FaSpinner />}
          </button>
        ))}
      </div>
    </div>
  );
}
