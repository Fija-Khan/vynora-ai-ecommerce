import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg vynora-navbar">
      <div className="container vynora-navbar-container">

        <Link to="/" className="navbar-brand vynora-logo">
          Vynora
        </Link>

        <button
          className="navbar-toggler vynora-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <div className="navbar-nav ms-auto vynora-links">

            <Link to="/" className="nav-link">
              Home
            </Link>

            <Link to="/products" className="nav-link">
              Products
            </Link>

            <Link to="/wishlist" className="nav-link">
              Wishlist
            </Link>

            <Link to="/cart" className="nav-link">
              Cart
            </Link>

            <Link to="/login" className="nav-link">
              Login
            </Link>

          </div>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;