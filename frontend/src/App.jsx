import { login, signup } from "./api";
import { useState, useEffect } from "react";
import "./App.css";
import JournalApp from "./JournalApp";

function App() {
  const [mode, setMode] = useState("login");
  const [loggedIn, setLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // ✅ CHECK LOCAL STORAGE ON MOUNT
  useEffect(() => {
    const storedId = localStorage.getItem("journal_user_id");
    if (storedId) {
      setUserId(parseInt(storedId));
      setLoggedIn(true);
    }
  }, []);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setError(""); // Clear error when user types
  };

  // ✅ REAL BACKEND SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (mode === "signup") {
      if (form.password !== form.confirmPassword) {
        setError("Passwords do not match ❌");
        return;
      }

      try {
        const res = await signup(form.email, form.password);

        if (!res.success) {
          setError(res.message || "Signup failed ❌");
          return;
        }

        alert("Signup successful ✅ Please login now.");
        setMode("login");
        setForm((prev) => ({ ...prev, password: "", confirmPassword: "" }));
      } catch (err) {
        console.error(err);
        setError("Backend not reachable ❌");
      }
    }
    else {
      try {
        const res = await login(form.email, form.password);

        if (!res.success) {
          setError(res.message || "Invalid credentials ❌");
          return;
        }

        // ✅ SAVE SESSION
        localStorage.setItem("journal_user_id", res.user_id);
        setUserId(res.user_id);
        setLoggedIn(true);
      } catch (err) {
        console.error(err);
        setError("Backend not reachable ❌");
      }
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setUserId(null);
    setForm({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  const isSignup = mode === "signup";

  // ✅ JOURNAL AFTER LOGIN
  if (loggedIn && userId) {
    return (
      <JournalApp
        userId={userId}
        userName={form.firstName}
        onLogout={handleLogout}
      />
    );
  }

  // ✅ LOGIN / SIGNUP PAGE
  return (
    <div className="page">
      <div className="split-container">
        {/* LEFT: BRAND PANEL */}
        <div className="brand-panel">
          <div className="brand-content">
            <h1 className="brand-title">Reflecta.</h1>
            <p className="brand-subtitle">
              Your personal AI companion for mindful journaling.
              <br />
              Unpack your thoughts, find clarity, and just breathe.
            </p>
          </div>
        </div>

        {/* RIGHT: AUTH PANEL */}
        <div className="auth-panel">
          <div className="card">
            <div className="auth-header">
              <h2 className="welcome-text">
                {isSignup ? "Create Account" : "Welcome Back"}
              </h2>
              <p className="sub-text">
                {isSignup
                  ? "Start your journey to mindfulness today."
                  : "Please enter your details to sign in."}
              </p>
            </div>

            <form className="form" onSubmit={handleSubmit}>
              {isSignup && (
                <>
                  <div className="field floating">
                    <input
                      id="firstName"
                      type="text"
                      className="floating-input"
                      placeholder=" "
                      value={form.firstName}
                      onChange={handleChange("firstName")}
                      required
                    />
                    <label htmlFor="firstName" className="floating-label">First Name</label>
                  </div>
                  <div className="field floating">
                    <input
                      id="lastName"
                      type="text"
                      className="floating-input"
                      placeholder=" "
                      value={form.lastName}
                      onChange={handleChange("lastName")}
                      required
                    />
                    <label htmlFor="lastName" className="floating-label">Last Name</label>
                  </div>
                </>
              )}

              <div className="field floating">
                <input
                  id="email"
                  type="email"
                  className="floating-input"
                  placeholder=" "
                  value={form.email}
                  onChange={handleChange("email")}
                  required
                />
                <label htmlFor="email" className="floating-label">Email Address</label>
              </div>

              <div className="field floating">
                <input
                  id="password"
                  type="password"
                  className="floating-input"
                  placeholder=" "
                  value={form.password}
                  onChange={handleChange("password")}
                  required
                />
                <label htmlFor="password" className="floating-label">Password</label>
              </div>

              {isSignup && (
                <div className="field floating">
                  <input
                    id="confirmPassword"
                    type="password"
                    className="floating-input"
                    placeholder=" "
                    value={form.confirmPassword}
                    onChange={handleChange("confirmPassword")}
                    required
                  />
                  <label htmlFor="confirmPassword" className="floating-label">Confirm Password</label>
                </div>
              )}

              {error && <div className="error-msg">{error}</div>}

              <button type="submit" className="primary-btn">
                {isSignup ? "Create Account" : "Sign In to Reflecta"}
              </button>

              <div style={{ textAlign: "center", marginTop: "24px" }}>
                <span className="sub-text">
                  {isSignup ? "Already have an account? " : "Don’t have an account? "}
                </span>
                <span
                  className="toggle-link"
                  onClick={() => {
                    setMode(isSignup ? "login" : "signup");
                    setError("");
                  }}
                >
                  {isSignup ? "Log In" : "Sign Up"}
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
