import { FcGoogle } from "react-icons/fc";
import { supabase } from "./supabaseClient";

export default function Auth() {

  async function handleGooglesignin() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  }

  return (
    <div className="h-screen center space-y-5">
      <div className="text-3xl font-bold">Study Sync</div>
      <div>
        <button className="btn btn-neutral" onClick={handleGooglesignin}><FcGoogle /></button>
      </div>
    </div>
  );
}
