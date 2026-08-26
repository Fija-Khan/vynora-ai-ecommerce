import { Link } from "react-router-dom";
import "./home.css";
import FeaturedProducts from "../components/FeaturedProducts";

function Home() {
  return (
    <main className="home-page">

      {/* =========================
          HERO SECTION
          ========================= */}

      <section className="hero-section">
        <div className="container hero-container">

          {/* Hero Content */}
          <div className="hero-content">

            <span className="hero-badge">
              ✨ AI-Powered Shopping
            </span>

            <h1>
              Shop Smarter.
              <br />
              Live Better.
            </h1>

            <p>
              Discover products you'll love with intelligent
              recommendations made just for you.
            </p>

            <div className="hero-buttons">

              <Link
                to="/products"
                className="hero-btn primary-btn"
              >
                Explore Products
              </Link>

              <Link
                to="/wishlist"
                className="hero-btn secondary-btn"
              >
                View Wishlist
              </Link>

            </div>

          </div>

          {/* AI Recommendation Card */}
          <div className="hero-visual">

            <div className="hero-card">

              <span className="ai-label">
                ✨ AI Recommendation
              </span>

              <h3>
                Picked for you
              </h3>

              <p>
                Personalized products based on your interests.
              </p>

            </div>

          </div>

        </div>
      </section>


      {/* =========================
          SHOP BY CATEGORY
          ========================= */}

      <section className="categories-section">
        <div className="container">

          {/* Section Heading */}
          <div className="section-heading">

            <span>
              Explore
            </span>

            <h2>
              Shop by Category
            </h2>

            <p>
              Find everything you need in one place.
            </p>

          </div>


          {/* Category Cards */}
          <div className="categories-grid">

            {/* Beauty */}
            <div className="category-card">

              <div className="category-image">
                <img
                  src="/images/categories/beauty.jpg"
                  alt="Beauty"
                />
              </div>

              <div className="category-content">

                <h3>
                  Beauty
                </h3>

                <p>
                  Discover beauty and skincare essentials.
                </p>

                <Link to="/products">
                  Explore →
                </Link>

              </div>

            </div>


            {/* Shoes */}
            <div className="category-card">

              <div className="category-image">
                <img
                  src="/images/categories/shoes.jpg"
                  alt="Shoes"
                />
              </div>

              <div className="category-content">

                <h3>
                  Shoes
                </h3>

                <p>
                  Step into style with the latest footwear.
                </p>

                <Link to="/products">
                  Explore →
                </Link>

              </div>

            </div>


            {/* Clothing */}
            <div className="category-card">

              <div className="category-image">
                <img
                  src="/images/categories/clothing.jpg"
                  alt="Clothing"
                />
              </div>

              <div className="category-content">

                <h3>
                  Clothing
                </h3>

                <p>
                  Find stylish clothing for every occasion.
                </p>

                <Link to="/products">
                  Explore →
                </Link>

              </div>

            </div>


            {/* Electronic */}
            <div className="category-card">

              <div className="category-image">
                <img
                  src="/images/categories/electronic.jpg"
                  alt="Electronic"
                />
              </div>

              <div className="category-content">

                <h3>
                  Electronic
                </h3>

                <p>
                  Explore smart gadgets and modern technology.
                </p>

                <Link to="/products">
                  Explore →
                </Link>

              </div>

            </div>

          </div>

        </div>
      </section>
        <FeaturedProducts />
    </main>
  );
}

export default Home;