import { useContext } from "react";
import { BsPersonCircle } from "react-icons/bs";
import { FaRegCalendar } from "react-icons/fa";
import { Link, Navigate, Outlet, useNavigate } from "react-router-dom";
import { AppContext } from "./App";
import { supabase } from "./supabaseClient";
import Auth from "./auth";

export default function Layout({ useronly }: { useronly: boolean }) {
  const { role, profile } = useContext(AppContext);
  const navigate = useNavigate();
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate(0);
  };

  if (!role && useronly) return <Auth />;

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
            {!role?.is_teacher && role && (
              <li>
                <Link to="/student/find">Find a session</Link>
              </li>
            )}
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
    </div>
  );
}
