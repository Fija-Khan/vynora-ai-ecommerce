import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import "./createRecommendations.css";

function CreateRecommendations() {
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("product");

  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!productId) {
        setError("Product ID is required.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          `http://127.0.0.1:8000/api/recommendations/products/?product=${productId}`
        );

        setRecommendations(response.data);
      } catch (error) {
        console.error("Failed to fetch recommendations:", error);

        setError(
          error.response?.data?.detail ||
            "Unable to load recommendations."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [productId]);

  const getPrice = (product) => {
    return Number(
      product.selling_price ||
        product.price ||
        0
    );
  };

  const getMrp = (product) => {
    return Number(
      product.mrp ||
        product.price ||
        0
    );
  };

  const getDiscount = (product) => {
    return Number(
      product.discount_percent || 0
    );
  };

  if (loading) {
    return (
      <main className="recommendations-page">
        <div className="recommendations-container">
          <p className="recommendations-message">
            Finding products you may like...
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="recommendations-page">
        <div className="recommendations-container">
          <p className="recommendations-error">
            {error}
          </p>

          <Link
            to="/products"
            className="recommendations-back-link"
          >
            ← Back to Products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="recommendations-page">
      <div className="recommendations-container">

        {/* HEADER */}
        <section className="recommendations-heading">
          <span>VYNORA AI</span>

          <h1>
            Recommended For You
          </h1>

          <p>
            Discover products you may love based
            on your interests.
          </p>
        </section>

        {/* PRODUCTS */}
        {recommendations.length > 0 ? (
          <section className="recommendations-grid">
            {recommendations.map((product) => {
              const price = getPrice(product);
              const mrp = getMrp(product);
              const discount = getDiscount(product);

              return (
                <article
                  className="recommendation-card"
                  key={product.id}
                >
                  {/* IMAGE */}
                  <div className="recommendation-image">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                      />
                    ) : (
                      <span>
                        No Image
                      </span>
                    )}

                    {discount > 0 && (
                      <span className="recommendation-discount">
                        {discount}% OFF
                      </span>
                    )}
                  </div>

                  {/* CONTENT */}
                  <div className="recommendation-content">
                    <span className="recommendation-brand">
                      {product.brand || "VYNORA"}
                    </span>

                    <small>
                      {product.category_name ||
                        "Collection"}
                    </small>

                    <h2>
                      {product.name}
                    </h2>

                    <div className="recommendation-price">
                      <strong>
                        ₹
                        {price.toLocaleString("en-IN")}
                      </strong>

                      {discount > 0 && (
                        <span>
                          ₹
                          {mrp.toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>

                    <Link
                      to={`/products/${product.id}`}
                      className="recommendation-view-btn"
                    >
                      View Product →
                    </Link>
                  </div>
                </article>
              );
            })}
          </section>
        ) : (
          <div className="recommendations-message">
            No recommendations available
            for this product.
          </div>
        )}
      </div>
    </main>
  );
}

export default CreateRecommendations;
