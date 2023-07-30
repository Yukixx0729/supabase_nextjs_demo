import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useState } from "react";

export default function LoginForm({ setSubmit }) {
  const supabaseClient = useSupabaseClient();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event) {
    setLoading(true);
    event.preventDefault();
    const email = event.target.elements.email.value;
    const { error } = await supabaseClient.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
        emailRedirectTo: window.location.origin,
      },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setError("");
      setLoading(false);
      setSubmit(email);
    }
  }

  return (
    <form onSubmit={onSubmit} className="content-grid home-hore">
      {error && (
        <div className="danger" role="alert">
          {error}
        </div>
      )}
      <h1>Welcome back</h1>
      <div className="email-input">
        <label htmlFor="email">Email</label>
        <input id="email" type="email" name="email" />
      </div>
      <button disabled={loading} type="submit" className="large-button">
        <div className="large-button-text">
          {loading ? "Logging..." : "Login"}
        </div>
      </button>
    </form>
  );
}
