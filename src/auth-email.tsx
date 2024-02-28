import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";

export default function AuthEmail() {
  const [signinError, setSigninError] = useState<string | undefined>(undefined);
  const [signupError, setSignupError] = useState<string | undefined>(undefined);
  const [processing, setProcessing] = useState<boolean>(false);
  const [gradYear, setGradYear] = useState<number>(new Date().getFullYear());
  const nav = useNavigate();

  const handleSignUp = async (ev: React.SyntheticEvent<HTMLFormElement>) => {
    ev.preventDefault();
    setProcessing(true);
    setSignupError(undefined);
    const data = {
      email: ev.currentTarget["email"].value,
      password: ev.currentTarget["password"].value,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
        data: {
          full_name: ev.currentTarget["full_name"].value,
          grad_year: parseInt(ev.currentTarget["grad_year"].value, 10),
          teacher_code: ev.currentTarget["teacher_code"]?.value || -1,
        },
      },
    };
    let { error } = await supabase.auth.signUp(data);
    if (error) {
      setSignupError(error.message);
      setProcessing(false);
    } else nav(0);
  };

  const handleSignIn = async (ev: React.SyntheticEvent<HTMLFormElement>) => {
    ev.preventDefault();
    setProcessing(true);
    setSigninError(undefined);
    let { error } = await supabase.auth.signInWithPassword({
      email: ev.currentTarget["email"].value,
      password: ev.currentTarget["password"].value,
    });
    if (error) {
      setSigninError(error.message);
      setProcessing(false);
    } else nav(0);
  };

  return (
    <div>
      {/* login form */}
      <form className="form p-10 space-y-5" onSubmit={handleSignIn}>
        <h1 className="divider">Sign In</h1>
        <div className="form-control">
          <label htmlFor="email2">Email</label>
          <input id="email2" name="email" className="input input-bordered" />
        </div>

        <div className="form-control">
          <label htmlFor="password2">Password</label>
          <input
            id="password2"
            type="password"
            name="password"
            className="input input-bordered"
          />
        </div>

        <button className="btn btn-primary" disabled={processing}>
          Sign In
        </button>
        {signinError && <div className="text-red-500">{signinError}</div>}
      </form>

      {/* sign up form */}
      <form className="form p-10 space-y-5" onSubmit={handleSignUp}>
        <h1 className="divider">Sign Up</h1>
        <div className="form-control">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" className="input input-bordered" />
        </div>

        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            className="input input-bordered"
          />
        </div>

        <div className="form-control">
          <label htmlFor="full_name">Full Name</label>
          <input
            id="full_name"
            name="full_name"
            className="input input-bordered"
          />
        </div>

        <div className="form-control">
          <label htmlFor="grad_year">Graduation Year</label>
          <select
            name="grad_year"
            id="grad_year"
            className="select select-bordered"
            value={gradYear}
            onChange={(ev) => setGradYear(parseInt(ev.target.value, 10))}
          >
            {new Array(6).fill(undefined).map((_, i) => (
              <option key={i} value={new Date().getFullYear() + i}>
                {new Date().getFullYear() + i} ({12 - i}th grade)
              </option>
            ))}
            <option value={-1}>Teacher</option>
          </select>
        </div>

        {gradYear === -1 && (
          <div className="form-control">
            <label htmlFor="teacher_code">Teacher Code</label>
            <input
              id="teacher_code"
              name="teacher_code"
              className="input input-bordered"
            />
          </div>
        )}

        <button className="btn btn-primary" disabled={processing}>
          Sign up
        </button>
        {signupError && <div className="text-red-500">{signupError}</div>}
      </form>
    </div>
  );
}
