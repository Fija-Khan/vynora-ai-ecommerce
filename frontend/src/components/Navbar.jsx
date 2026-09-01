import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";


function Navbar() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // ========================================
  // LOGIN STATUS
  // ========================================

  const isLoggedIn = localStorage.getItem("vynora_logged_in") === "true";

  // ========================================
  // LANGUAGE
  // ========================================

  const [language, setLanguage] = useState(
    localStorage.getItem("vynora_language") || "English",
  );

  // ========================================
  // SEARCH
  // ========================================

  const handleSearch = (e) => {
    e.preventDefault();

    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`);

      setSearch("");
      setMenuOpen(false);
    }
  };

  // ========================================
  // LANGUAGE CHANGE
  // ========================================

  const handleLanguageChange = (selectedLanguage) => {
    setLanguage(selectedLanguage);

    localStorage.setItem("vynora_language", selectedLanguage);

    setLanguageOpen(false);

    console.log("Selected language:", selectedLanguage);

    // Full translation system can be connected later.
  };

  // ========================================
  // SIGN OUT
  // ========================================

  const handleSignOut = () => {
    localStorage.removeItem("vynora_access");
    localStorage.removeItem("vynora_refresh");
    localStorage.removeItem("vynora_logged_in");

    setProfileOpen(false);
    setMenuOpen(false);

    navigate("/login");
  };

  // ========================================
  // CLOSE MENUS
  // ========================================

  const closeMenus = () => {
    setProfileOpen(false);
    setLanguageOpen(false);
    setMenuOpen(false);
  };

  return (
    <nav className="vynora-navbar">
      <div className="vynora-navbar-container">
        {/* ========================================
            LOGO
        ======================================== */}

        <Link to="/" className="vynora-logo" onClick={closeMenus}>
          VYNORA
        </Link>

        {/* ========================================
            MOBILE MENU BUTTON
        ======================================== */}

        <button
          className={`vynora-menu-btn ${menuOpen ? "active" : ""}`}
          type="button"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => {
            setMenuOpen(!menuOpen);
            setProfileOpen(false);
            setLanguageOpen(false);
          }}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* ========================================
            NAVBAR CONTENT
        ======================================== */}

        <div
          className={`vynora-navbar-content ${menuOpen ? "mobile-open" : ""}`}
        >
          {/* ========================================
              CATEGORY LINKS
          ======================================== */}

          <div className="vynora-category-links">
            <Link
              to="/products?gender=men"
              className="vynora-nav-link"
              onClick={closeMenus}
            >
              MEN
            </Link>

            <Link
              to="/products?gender=women"
              className="vynora-nav-link"
              onClick={closeMenus}
            >
              WOMEN
            </Link>

            <Link
              to="/products?gender=kids"
              className="vynora-nav-link"
              onClick={closeMenus}
            >
              KIDS
            </Link>

            <Link
              to="/products"
              className="vynora-nav-link"
              onClick={closeMenus}
            >
              HOME
            </Link>

            <Link
              to="/products"
              className="vynora-nav-link"
              onClick={closeMenus}
            >
              BEAUTY
            </Link>
          </div>

          {/* ========================================
              RIGHT SECTION
          ======================================== */}

          <div className="vynora-right">
            {/* ========================================
                SEARCH
            ======================================== */}

            <form className="vynora-search" onSubmit={handleSearch}>
              <span className="search-icon">🔍</span>

              <input
                type="text"
                placeholder="Search products, brands..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </form>

            {/* ========================================
                LANGUAGE
            ======================================== */}

            <div className="vynora-language-wrapper">
              <button
                type="button"
                className="vynora-language-btn"
                onClick={() => {
                  setLanguageOpen(!languageOpen);
                  setProfileOpen(false);
                }}
                aria-expanded={languageOpen}
              >
                <span>🌐</span>

                <span>{language === "English" ? "EN" : "हिं"}</span>

                <span className="language-arrow">▾</span>
              </button>

              {languageOpen && (
                <div className="vynora-language-dropdown">
                  <button
                    type="button"
                    className={language === "English" ? "active" : ""}
                    onClick={() => handleLanguageChange("English")}
                  >
                    🇬🇧 English
                  </button>

                  <button
                    type="button"
                    className={language === "Hindi" ? "active" : ""}
                    onClick={() => handleLanguageChange("Hindi")}
                  >
                    🇮🇳 हिंदी
                  </button>
                </div>
              )}
            </div>

            {/* ========================================
                PROFILE
            ======================================== */}

            <div
              className="vynora-profile-wrapper"
              onMouseEnter={() => setProfileOpen(true)}
              onMouseLeave={() => setProfileOpen(false)}
            >
              <button
                type="button"
                className="vynora-icon-link profile-button"
                onClick={() => {
                  setProfileOpen(!profileOpen);
                  setLanguageOpen(false);
                }}
                aria-expanded={profileOpen}
              >
                <span className="nav-icon">👤</span>

                <span className="nav-icon-label">Profile</span>
              </button>

              {profileOpen && (
                <div className="vynora-profile-dropdown">
                  {/* ========================================
                      DROPDOWN HEADER
                  ======================================== */}

                  <div className="profile-dropdown-header">
                    <div className="profile-dropdown-icon">👤</div>

                    <div>
                      <strong>Welcome to Vynora</strong>

                      <span>
                        {isLoggedIn
                          ? "Manage your account"
                          : "Login to your account"}
                      </span>
                    </div>
                  </div>

                  <div className="profile-dropdown-divider"></div>

                  {/* ========================================
                      LOGGED IN
                  ======================================== */}

                  {isLoggedIn ? (
                    <>
                      {/* MY PROFILE */}

                      <Link
                        to="/profile"
                        className="profile-dropdown-item"
                        onClick={() => setProfileOpen(false)}
                      >
                        <span>👤</span>

                        <span>My Profile</span>
                      </Link>

                      {/* MY ORDERS */}

                      <Link
                        to="/orders"
                        className="profile-dropdown-item"
                        onClick={() => setProfileOpen(false)}
                      >
                        <span>📦</span>

                        <span>My Orders</span>
                      </Link>

                      <Link to="/payments" className="profile-dropdown-item">
                        <span>💳</span>
                        <div>
                          <strong>My Payments</strong>
                          <small>View your payment history</small>
                        </div>
                        <span>→</span>
                      </Link>

                      {/* SIGN OUT */}

                      <button
                        type="button"
                        className="profile-dropdown-item signout"
                        onClick={handleSignOut}
                      >
                        <span>🚪</span>

                        <span>Sign Out</span>
                      </button>
                    </>
                  ) : (
                    /* ========================================
                       LOGGED OUT
                    ======================================== */

                    <>
                      {/* LOGIN */}

                      <Link
                        to="/login"
                        className="profile-dropdown-item"
                        onClick={() => setProfileOpen(false)}
                      >
                        <span>🔐</span>

                        <span>Login</span>
                      </Link>

                      {/* SIGN UP */}

                      <Link
                        to="/register"
                        className="profile-dropdown-item signup"
                        onClick={() => setProfileOpen(false)}
                      >
                        <span>✨</span>

                        <span>Sign Up</span>
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* ========================================
                WISHLIST
            ======================================== */}

            <Link
              to="/wishlist"
              className="vynora-icon-link"
              onClick={closeMenus}
            >
              <span className="nav-icon">♡</span>

              <span className="nav-icon-label">Wishlist</span>
            </Link>

            {/* ========================================
                CART
            ======================================== */}

            <Link to="/cart" className="vynora-icon-link" onClick={closeMenus}>
              <span className="nav-icon">🛒</span>

              <span className="nav-icon-label">Cart</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
