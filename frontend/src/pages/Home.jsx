import { Link } from "react-router-dom";
import "./Home.css";
import FeaturedProducts from "../components/FeaturedProducts";

function Home() {
  return (
    <main className="home-page">

      {/* Hero Banner */}
      <section className="hero-carousel">
        <div
          id="homeCarousel"
          className="carousel slide"
          data-bs-ride="carousel"
        >
          {/* Indicators */}
          <div className="carousel-indicators">
            <button
              type="button"
              data-bs-target="#homeCarousel"
              data-bs-slide-to="0"
              className="active"
              aria-current="true"
              aria-label="Slide 1"
            />

            <button
              type="button"
              data-bs-target="#homeCarousel"
              data-bs-slide-to="1"
              aria-label="Slide 2"
            />

            <button
              type="button"
              data-bs-target="#homeCarousel"
              data-bs-slide-to="2"
              aria-label="Slide 3"
            />
          </div>

          {/* Banner Slides */}
          <div className="carousel-inner">

            <div className="carousel-item active">
              <img
                src="/images/banners/banner-1.jpg"
                alt="Vynora Shopping"
              />

              <div className="hero-banner-action">
                <Link
                  to="/products"
                  className="hero-banner-btn"
                >
                  Shop Now
                </Link>
              </div>
            </div>

            <div className="carousel-item">
              <img
                src="/images/banners/banner-2.jpg"
                alt="Latest Collection"
              />

              <div className="hero-banner-action">
                <Link
                  to="/products"
                  className="hero-banner-btn"
                >
                  Explore Collection
                </Link>
              </div>
            </div>

            <div className="carousel-item">
              <img
                src="/images/banners/banner-3.jpg"
                alt="Special Offers"
              />

              <div className="hero-banner-action">
                <Link
                  to="/products"
                  className="hero-banner-btn"
                >
                  Discover More
                </Link>
              </div>
            </div>

          </div>

          {/* Previous */}
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#homeCarousel"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon" />
            <span className="visually-hidden">
              Previous
            </span>
          </button>

          {/* Next */}
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#homeCarousel"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon" />
            <span className="visually-hidden">
              Next
            </span>
          </button>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="categories-section">
        <div className="container">

          <div className="section-heading">
            <span>Explore</span>

            <h2>Shop by Category</h2>

            <p>
              Find everything you need in one place.
            </p>
          </div>

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
                <h3>Beauty</h3>

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
                <h3>Shoes</h3>

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
                <h3>Clothing</h3>

                <p>
                  Find stylish clothing for every occasion.
                </p>

                <Link to="/products">
                  Explore →
                </Link>
              </div>
            </div>

            {/* Electronics */}
            <div className="category-card">
              <div className="category-image">
                <img
                  src="/images/categories/electronic.jpg"
                  alt="Electronics"
                />
              </div>

              <div className="category-content">
                <h3>Electronics</h3>

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

      {/* Featured Products */}
      <FeaturedProducts />

    </main>
  );
}

export default Home;
