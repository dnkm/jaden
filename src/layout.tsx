import { useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AppContext } from "./App";
import { supabase } from "./supabaseClient";

export default function Layout() {
  const { profile, role } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate(0);
  };

  return (
    <div>
      <nav className="navbar bg-neutral text-neutral-content">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">Tutor App</a>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            <li>
              <a>Link</a>
            </li>
            <li>
              <details>
                <summary>{profile?.full_name}</summary>
                <ul className="p-2 bg-base-100 rounded-t-none">
                  <li>
                    <button onClick={handleLogout}>Logout</button>
                  </li>
                </ul>
              </details>
            </li>
          </ul>
        </div>
      </nav>

      <main className="container mx-auto my-5">
        <Outlet />
      </main>
    </div>
  );
}
