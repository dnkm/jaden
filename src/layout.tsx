import { useContext } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { AppContext } from "./App";
import { supabase } from "./supabaseClient";
import { FaChalkboardTeacher, FaRegCalendar } from "react-icons/fa";

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
          <Link to="/" className="btn btn-ghost text-xl">
            <FaRegCalendar />
            StudySync
          </Link>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            {role?.is_teacher && (
              <>
                <li>
                  <Link to="/teacher/subjects">Subjects</Link>
                </li>
              </>
            )}
            <li>
              <details>
                <summary className="flex items-center">
                  {profile?.full_name}{" "}
                  {role?.is_teacher && <FaChalkboardTeacher />}
                </summary>
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

      <main className="container mx-auto p-5">
        <Outlet />
      </main>
    </div>
  );
}
