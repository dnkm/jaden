import { createContext, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { Tables } from "../types/supabase";
import Auth from "./auth";
import Sessions from "./component/sessions/component";
import Layout from "./layout";
import { supabase } from "./supabaseClient";

type AppContextType = {
  profile: Tables<"profiles"> | null;
  role: Tables<"roles"> | null;
  loading: boolean;
  setLoading: Function; // eslint-disable-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
};
export const AppContext = createContext<AppContextType>({
  profile: null,
  role: null,
  loading: false,
  setLoading: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
});

function App() {
  const [profile, setProfile] = useState<Tables<"profiles"> | null>(null);
  const [role, setRole] = useState<Tables<"roles"> | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

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
        console.log("init login detected");
        loadUserData(session.user.id);
      }
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      if (session && !profile) {
        console.log("login detected");
        loadUserData(session.user.id);
      } else {
        setProfile(null);
        setRole(null);
      }
    });
  }, []);

  return (
    <div className="min-h-screen">
      {!profile ? (
        <Auth />
      ) : (
        <AppContext.Provider value={{ role, profile, loading, setLoading }}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path="/" element={<Sessions />} />
            </Route>
          </Routes>
        </AppContext.Provider>
      )}
    </div>
  );
}

export default App;
