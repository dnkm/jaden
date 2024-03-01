import { useContext, useEffect } from "react";
import { AppContext } from "./App";
import { useNavigate } from "react-router-dom";

export default function Redirect() {
  const { profile } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (profile) {
      navigate(localStorage.getItem("redirectTo") || "/");
    }
  }, [profile]);

  return (
    <div>
      <h1>Redirecting...</h1>
    </div>
  );
}
