import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
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

    if (!formData.username.trim() || !formData.password) {
      setError("Please enter your username and password.");
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
        } else if (data.non_field_errors?.length > 0) {
          setError(data.non_field_errors[0]);
        } else if (data.username?.length > 0) {
          setError(data.username[0]);
        } else if (data.password?.length > 0) {
          setError(data.password[0]);
        } else {
          setError("Invalid username or password.");
        }

        return;
      }

      // =========================================
      // SAVE JWT TOKENS
      // =========================================

      if (data.access) {
        localStorage.setItem(
          "vynora_access_token",
          data.access
        );
      }

      if (data.refresh) {
        localStorage.setItem(
          "vynora_refresh_token",
          data.refresh
        );
      }

      // =========================================
      // LOGIN STATUS
      // =========================================

      localStorage.setItem(
        "vynora_logged_in",
        "true"
      );

      // =========================================
      // SAVE USER DATA
      // =========================================

      if (data.user) {
        localStorage.setItem(
          "vynora_user",
          JSON.stringify(data.user)
        );
      }

      // =========================================
      // REMEMBER ME
      // =========================================

      localStorage.setItem(
        "vynora_remember_me",
        rememberMe ? "true" : "false"
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

  // =========================================
  // RETURN
  // =========================================

  return (
    <main className="login-page">

      <div className="login-background-decoration login-decoration-one" />
      <div className="login-background-decoration login-decoration-two" />

      <div className="login-wrapper">

        {/* =====================================
            BRAND
        ====================================== */}

        <div className="login-brand">
          <Link to="/" className="login-logo">
            VYNORA
          </Link>

          <span className="login-brand-subtitle">
            MODERN · ELEGANT · ESSENTIAL
          </span>
        </div>

        {/* =====================================
            LOGIN CARD
        ====================================== */}

        <section className="login-card">

          {/* HEADER */}

          <div className="login-header">

            <span className="login-eyebrow">
              WELCOME BACK
            </span>

            <h1>
              Sign in to your account
            </h1>

            <p>
              Continue your journey with Vynora.
            </p>

          </div>

          {/* ERROR */}

          {error && (
            <div className="login-error">
              <span className="login-error-icon">
                !
              </span>

              <span>
                {error}
              </span>
            </div>
          )}

          {/* FORM */}

          <form
            className="login-form"
            onSubmit={handleLogin}
          >

            {/* USERNAME */}

            <div className="login-field">

              <label htmlFor="username">
                Username
              </label>

              <div className="login-input-container">

                <span className="login-field-icon">
                  ◯
                </span>

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

            </div>

            {/* PASSWORD */}

            <div className="login-field">

              <div className="login-label-row">

                <label htmlFor="password">
                  Password
                </label>

                <Link
                  to="/forgot-password"
                  className="forgot-password"
                  onClick={(e) =>
                    e.preventDefault()
                  }
                >
                  Forgot Password?
                </Link>

              </div>

              <div className="login-input-container">

                <span className="login-field-icon">
                  ◉
                </span>

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  disabled={loading}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (previous) => !previous
                    )
                  }
                  disabled={loading}
                >
                  {showPassword
                    ? "Hide"
                    : "Show"}
                </button>

              </div>

            </div>

            {/* REMEMBER ME */}

            <div className="login-options">

              <label className="remember-me">

                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) =>
                    setRememberMe(
                      e.target.checked
                    )
                  }
                  disabled={loading}
                />

                <span className="custom-checkbox">
                  ✓
                </span>

                <span>
                  Remember me
                </span>

              </label>

            </div>

            {/* SIGN IN */}

            <button
              type="submit"
              className="login-btn"
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="login-spinner" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <span className="login-btn-arrow">
                    →
                  </span>
                </>
              )}

            </button>

          </form>

          {/* DIVIDER */}

          <div className="login-divider">
            <span>OR</span>
          </div>

          {/* REGISTER */}

          <div className="login-register">

            <span>
              Don't have an account?
            </span>

            <Link to="/register">
              Create Account
            </Link>

          </div>

          {/* SECURITY */}

          <div className="login-security">

            <span className="security-icon">
              ✓
            </span>

            <span>
              Secure &amp; private shopping experience
            </span>

          </div>

        </section>

        {/* FOOTER */}

        <p className="login-footer">
          © {new Date().getFullYear()} Vynora
        </p>

      </div>
    </main>
  );
}

export default Login;
