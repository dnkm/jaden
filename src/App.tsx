import { createContext, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { Tables } from "../types/supabase";
import Auth from "./auth";
import Sessions from "./component/sessions/component";
import Layout from "./layout";
import PrivacyPolicy from "./other/privacy";
import TOS from "./other/tos";
import FindSession from "./student/FindSession";
import { supabase } from "./supabaseClient";
import TeacherSubjects from "./teacher/subjects";

type AppContextType = {
  profile: Tables<"profiles"> | null;
  role: Tables<"roles"> | null;
  loading: boolean;
  setLoading: Function; // eslint-disable-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  teacherFilter: string[];
  setTeacherFilter: Function;
};
export const AppContext = createContext<AppContextType>({
  profile: null,
  role: null,
  loading: false,
  setLoading: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  teacherFilter: [],
  setTeacherFilter: () => {},
});

function App() {
  const [profile, setProfile] = useState<Tables<"profiles"> | null>(null);
  const [role, setRole] = useState<Tables<"roles"> | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [teacherFilter, setTeacherFilter] = useState<string[]>([]);

  useEffect(() => {
    const loadUserData = (id: string) => {
      Promise.all([
        supabase.from("profiles").select("*").eq("id", id).single(),
        supabase.from("roles").select("*").eq("id", id).single(),
      ]).then((results) => {
        setProfile(results[0].data);
        setRole(results[1].data);
      });
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        loadUserData(session.user.id);
      }
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      if (session && !profile) {
        loadUserData(session.user.id);
      } else {
        setProfile(null);
        setRole(null);
      }
    });
  }, []);

  return (
    <div className="min-h-screen">
      <AppContext.Provider
        value={{
          role,
          profile,
          loading,
          setLoading,
          teacherFilter,
          setTeacherFilter,
        }}
      >
        <Routes>
          <Route element={<Layout useronly={false} />}>
            <Route path="/privacypolicy" element={<PrivacyPolicy />} />
            <Route path="/tos" element={<TOS />} />
            <Route path="/auth" element={<Auth />} />
          </Route>
          <Route element={<Layout useronly={true} />}>
            <Route path="/" element={<Sessions />} />
            <Route path="/teacher/subjects" element={<TeacherSubjects />} />
            <Route path="/student/find" element={<FindSession />} />
            <Route
              path="/student/find/:teacher_name/:teacher_id"
              element={<Sessions />}
            />
          </Route>
        </Routes>
      </AppContext.Provider>
    </div>
  );
}

export default App;
