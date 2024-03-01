import { FcGoogle } from "react-icons/fc";
import { supabase } from "./supabaseClient";

export default function Auth() {
  console.log("full url", window.location.href);

  async function handleGooglesignin() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/redirect",
      },
    });
  }

  return (
    <div className="h-screen center space-y-5">
      <div className="text-3xl font-bold">Study Sync</div>
      <div>
        <button className="btn btn-neutral" onClick={handleGooglesignin}>
          <FcGoogle />
        </button>
      </div>
    </div>
  );
}
