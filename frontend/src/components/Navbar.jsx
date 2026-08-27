import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();

    if (search.trim()) {
      navigate(
        `/products?search=${encodeURIComponent(search.trim())}`
      );
    }
  };

  return (
    <nav className="vynora-navbar">
      <div className="vynora-navbar-container">

        {/* =========================
            LOGO
        ========================= */}

        <Link to="/" className="vynora-logo">
          VYNORA
        </Link>


        {/* =========================
            MOBILE MENU BUTTON
        ========================= */}

        <button
          className="vynora-menu-btn"
          type="button"
          aria-label="Menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>


        {/* =========================
            NAVBAR CONTENT
        ========================= */}

        <div className="vynora-navbar-content">

          {/* =========================
              CATEGORY LINKS
          ========================= */}

          <div className="vynora-category-links">

            <Link
              to="/products?gender=men"
              className="vynora-nav-link"
            >
              MEN
            </Link>

            <Link
              to="/products?gender=women"
              className="vynora-nav-link"
            >
              WOMEN
            </Link>

            <Link
              to="/products?gender=kids"
              className="vynora-nav-link"
            >
              KIDS
            </Link>

            <Link
              to="/products"
              className="vynora-nav-link"
            >
              HOME
            </Link>

            <Link
              to="/products"
              className="vynora-nav-link"
            >
              BEAUTY
            </Link>

          </div>


          {/* =========================
              RIGHT SIDE
          ========================= */}

          <div className="vynora-right">

            {/* SEARCH */}

            <form
              className="vynora-search"
              onSubmit={handleSearch}
            >
              <span className="search-icon">
                🔍
              </span>

              <input
                type="text"
                placeholder="Search products, brands..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />
            </form>


            {/* PROFILE */}

            <Link
              to="/profile"
              className="vynora-icon-link"
            >
              <span className="nav-icon">
                👤
              </span>

              <span className="nav-icon-label">
                Profile
              </span>
            </Link>


            {/* WISHLIST */}

            <Link
              to="/wishlist"
              className="vynora-icon-link"
            >
              <span className="nav-icon">
                ♡
              </span>

              <span className="nav-icon-label">
                Wishlist
              </span>
            </Link>


            {/* CART */}

            <Link
              to="/cart"
              className="vynora-icon-link"
            >
              <span className="nav-icon">
                🛒
              </span>

              <span className="nav-icon-label">
                Cart
              </span>
            </Link>

          </div>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;