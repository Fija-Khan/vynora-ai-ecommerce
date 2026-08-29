import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =========================================
  // HANDLE INPUT CHANGE
  // =========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  // =========================================
  // LOGIN
  // =========================================

  const handleLogin = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.username.trim() || !formData.password) {
      setError("Please enter username and password.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://127.0.0.1:8000/api/accounts/login/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: formData.username.trim(),
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      // =========================================
      // LOGIN ERROR
      // =========================================

      if (!response.ok) {
        if (data.detail) {
          setError(data.detail);
        } else if (data.non_field_errors) {
          setError(data.non_field_errors[0]);
        } else {
          setError("Invalid username or password.");
        }

        return;
      }

      // =========================================
      // SAVE JWT TOKENS
      // =========================================

      localStorage.setItem(
        "vynora_access_token",
        data.access
      );

      localStorage.setItem(
        "vynora_refresh_token",
        data.refresh
      );

      // =========================================
      // SAVE LOGIN STATUS
      // Navbar uses this value
      // =========================================

      localStorage.setItem(
        "vynora_logged_in",
        "true"
      );

      // =========================================
      // LOGIN SUCCESS
      // =========================================

      navigate("/");
    } catch (error) {
      console.error("Login error:", error);

      setError(
        "Unable to connect to the server. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">

      <div className="login-container">

        {/* ========================================
            LOGIN CARD
        ======================================== */}

        <section className="login-card">

          {/* ========================================
              LOGIN HEADER
          ======================================== */}

          <div className="login-header">

            <span className="login-eyebrow">
              VYNORA ACCOUNT
            </span>

            <h1>
              Welcome Back
            </h1>

            <p>
              Login to continue shopping with Vynora.
            </p>

          </div>


          {/* ========================================
              ERROR MESSAGE
          ======================================== */}

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}


          {/* ========================================
              LOGIN FORM
          ======================================== */}

          <form onSubmit={handleLogin}>

            {/* USERNAME */}

            <div className="login-field">

              <label htmlFor="username">
                Username
              </label>

              <input
                id="username"
                type="text"
                name="username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                autoComplete="username"
                disabled={loading}
              />

            </div>


            {/* PASSWORD */}

            <div className="login-field">

              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                disabled={loading}
              />

            </div>


            {/* LOGIN BUTTON */}

            <button
              type="submit"
              className="login-btn"
              disabled={loading}
            >

              {loading ? (
                "Logging in..."
              ) : (
                <>
                  Login
                  <span>→</span>
                </>
              )}

            </button>

          </form>


          {/* ========================================
              REGISTER
          ======================================== */}

          <div className="login-register">

            <span>
              Don't have an account?
            </span>

            <Link to="/register">
              Create Account
            </Link>

          </div>

        </section>

      </div>

    </main>
  );
}

export default Login;
