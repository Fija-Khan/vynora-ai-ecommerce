import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./register.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
    setSuccess("");
  };

  // =========================================
  // REGISTER
  // =========================================

  const handleRegister = async (e) => {
    e.preventDefault();

    const username = formData.username.trim();
    const email = formData.email.trim();

    // Basic validation
    if (
      !username ||
      !email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      // =========================================
      // REGISTER API
      // =========================================

      const response = await fetch(
        "http://127.0.0.1:8000/api/accounts/register/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            email,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      // =========================================
      // REGISTRATION ERROR
      // =========================================

      if (!response.ok) {
        if (data.username) {
          setError(`Username: ${data.username[0]}`);
        } else if (data.email) {
          setError(`Email: ${data.email[0]}`);
        } else if (data.password) {
          setError(`Password: ${data.password[0]}`);
        } else if (data.detail) {
          setError(data.detail);
        } else {
          setError("Unable to create account. Please try again.");
        }

        return;
      }

      // =========================================
      // SUCCESS
      // =========================================

      setSuccess(
        "Account created successfully! Redirecting to login..."
      );

      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      // =========================================
      // REDIRECT TO LOGIN
      // =========================================

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error("Registration error:", error);

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
    <main className="register-page">
      <div className="register-container">

        {/* ========================================
            REGISTER CARD
        ======================================== */}

        <section className="register-card">

          {/* ========================================
              BRAND
          ======================================== */}

          <div className="register-brand">
            <span>V</span>
            <strong>VYNORA</strong>
          </div>

          {/* ========================================
              HEADER
          ======================================== */}

          <div className="register-header">
            <span className="register-eyebrow">
              VYNORA ACCOUNT
            </span>

            <h1>
              Create Your Account
            </h1>

            <p>
              Join Vynora and discover a better way to shop.
            </p>
          </div>

          {/* ========================================
              ERROR MESSAGE
          ======================================== */}

          {error && (
            <div className="register-error">
              <span>!</span>
              <p>{error}</p>
            </div>
          )}

          {/* ========================================
              SUCCESS MESSAGE
          ======================================== */}

          {success && (
            <div className="register-success">
              <span>✓</span>
              <p>{success}</p>
            </div>
          )}

          {/* ========================================
              REGISTER FORM
          ======================================== */}

          <form onSubmit={handleRegister}>

            {/* USERNAME */}

            <div className="register-field">
              <label htmlFor="username">
                Username
              </label>

              <div className="register-input-wrapper">
                <span className="input-icon">
                  @
                </span>

                <input
                  id="username"
                  type="text"
                  name="username"
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={handleChange}
                  autoComplete="username"
                  disabled={loading}
                />
              </div>
            </div>

            {/* EMAIL */}

            <div className="register-field">
              <label htmlFor="email">
                Email Address
              </label>

              <div className="register-input-wrapper">
                <span className="input-icon">
                  ✉
                </span>

                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  disabled={loading}
                />
              </div>
            </div>

            {/* PASSWORD */}

            <div className="register-field">
              <label htmlFor="password">
                Password
              </label>

              <div className="register-input-wrapper">
                <span className="input-icon">
                  •
                </span>

                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  disabled={loading}
                />
              </div>

              <small className="password-hint">
                Minimum 8 characters
              </small>
            </div>

            {/* CONFIRM PASSWORD */}

            <div className="register-field">
              <label htmlFor="confirmPassword">
                Confirm Password
              </label>

              <div className="register-input-wrapper">
                <span className="input-icon">
                  •
                </span>

                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  disabled={loading}
                />
              </div>
            </div>

            {/* REGISTER BUTTON */}

            <button
              type="submit"
              className="register-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="register-spinner"></span>
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <span>→</span>
                </>
              )}
            </button>
          </form>

          {/* ========================================
              LOGIN LINK
          ======================================== */}

          <div className="register-login">
            <span>
              Already have an account?
            </span>

            <Link to="/login">
              Login
            </Link>
          </div>

          {/* ========================================
              FOOTER
          ======================================== */}

          <div className="register-footer">
            <span>Secure</span>
            <span>•</span>
            <span>Private</span>
            <span>•</span>
            <span>Vynora</span>
          </div>

        </section>
      </div>
    </main>
  );
}

export default Register;
