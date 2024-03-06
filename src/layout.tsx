import { useContext } from "react";
import { BsPersonCircle } from "react-icons/bs";
import { FaRegCalendar } from "react-icons/fa";
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import { AppContext } from "./App";
import { supabase } from "./supabaseClient";

export default function Layout() {
  const { role, profile } = useContext(AppContext);
  let { teacher_id, teacher_name } = useParams();

  const navigate = useNavigate();
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate(0);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="navbar bg-neutral text-neutral-content">
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost text-xl">
            <FaRegCalendar />
            StudySync
          </Link>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            {teacher_id ? (
              <div className="center">
                <div className="join">
                  <button className="btn btn-sm btn-accent join-item">
                    Showing sessions for {teacher_name}
                  </button>
                  <Link to="/">
                    <button className="btn btn-warning btn-sm join-item">
                      X
                    </button>
                  </Link>
                </div>
              </div>
            ) : (
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

      <main className="container mx-auto p-5 flex-1 flex flex-col">
        <Outlet />
      </main>

      <footer className="p-4 flex justify-center space-x-5 bg-neutral">
        <Link to="/tos">Terms</Link>
        <Link to="/privacypolicy">Privacy Policy</Link>
      </footer>
    </div>
  );
}
