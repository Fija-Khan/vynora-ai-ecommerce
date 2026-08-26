import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../api/productApi";

function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();

        // Show only active products
        const activeProducts = data.filter(
          (product) => product.is_active
        );

        setProducts(activeProducts.slice(0, 4));
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setError("Unable to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className="featured-products-section">
        <div className="container">
          <p>Loading products...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="featured-products-section">
        <div className="container">
          <p>{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="featured-products-section">
      <div className="container">

        <div className="section-heading">
          <span>Our Collection</span>

          <h2>Featured Products</h2>

          <p>
            Discover products selected for your shopping experience.
          </p>
        </div>

        <div className="products-grid">

          {products.map((product) => (
            <div className="product-card" key={product.id}>

              <div className="product-image">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                  />
                ) : (
                  <div className="product-image-placeholder">
                    No Image
                  </div>
                )}
              </div>

              <div className="product-info">

                <span className="product-category">
                  {product.category_name}
                </span>

                <h3>
                  {product.name}
                </h3>

                <p className="product-price">
                  ₹{product.price}
                </p>

                <Link
                  to={`/products/${product.id}`}
                  className="product-btn"
                >
                  View Product
                </Link>

              </div>

            </div>
          ))}

        </div>

        {products.length === 0 && (
          <p className="no-products">
            No products available yet.
          </p>
        )}

        <div className="view-all-products">
          <Link to="/products">
            View All Products →
          </Link>
        </div>

      </div>
    </section>
  );
}

export default FeaturedProducts;