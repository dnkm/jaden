import { useContext } from "react";
import { BsPersonCircle } from "react-icons/bs";
import { FaRegCalendar } from "react-icons/fa";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { AppContext } from "./App";
import { supabase } from "./supabaseClient";

export default function Layout() {
  const { role, profile } = useContext(AppContext);
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
            <li>
              <Link to="/student/find">Find a session</Link>
            </li>
            <li>
              <details className="flex items-center">
                <summary className="">
                  <BsPersonCircle
                    className={`text-xl ${
                      role?.is_teacher ? "text-yellow-400" : ""
                    }`}
                  />
                  {profile?.full_name}
                </summary>
                <ul className="p-2 bg-base-300 rounded-t-none">
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

      <footer>
        <Link to="/tos">Terms</Link>
        <Link to="/privacypolicy">Privacy Policy</Link>
      </footer>
    </div>
  );
}
