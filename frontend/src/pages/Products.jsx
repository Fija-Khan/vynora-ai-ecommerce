import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../api/productApi";
import "./products.css";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();

        const activeProducts = data.filter(
          (product) => product.is_active
        );

        setProducts(activeProducts);
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
      <main className="products-page">
        <div className="container">
          <p className="products-message">Loading products...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="products-page">
        <div className="container">
          <p className="products-message">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="products-page">

      <section className="products-header">
        <div className="container">
          <span>Vynora Collection</span>
          <h1>All Products</h1>
          <p>
            Explore products selected for your everyday needs.
          </p>
        </div>
      </section>

      <section className="products-list-section">
        <div className="container">

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

                  <h3>{product.name}</h3>

                  <p className="product-price">
                    ₹{product.price}
                  </p>

                  <p className="product-stock">
                    {product.stock > 0
                      ? `${product.stock} items available`
                      : "Out of stock"}
                  </p>

                  <Link
                    to={`/products/${product.id}`}
                    className="product-btn"
                  >
                    View Details
                  </Link>

                </div>

              </div>
            ))}

          </div>

          {products.length === 0 && (
            <p className="products-message">
              No products available.
            </p>
          )}

        </div>
      </section>

    </main>
  );
}

export default Products;