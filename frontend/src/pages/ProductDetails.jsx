import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import "./productDetails.css";

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  const [loading, setLoading] = useState(true);
  const [relatedLoading, setRelatedLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          `http://127.0.0.1:8000/api/products/${id}/`
        );

        setProduct(response.data);
      } catch (error) {
        console.error("Failed to fetch product:", error);
        setError("Unable to load product.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  /*
    Fetch all products and find products
    from the same category.
  */
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        setRelatedLoading(true);

        const response = await axios.get(
          "http://127.0.0.1:8000/api/products/"
        );

        setRelatedProducts(
          response.data.filter(
            (item) =>
              item.category === product?.category &&
              item.id !== Number(id)
          )
        );
      } catch (error) {
        console.error(
          "Failed to fetch related products:",
          error
        );
      } finally {
        setRelatedLoading(false);
      }
    };

    if (product) {
      fetchRelatedProducts();
    }
  }, [product, id]);

  const colors = [
    ...new Set(
      product?.variants
        ?.map((variant) => variant.color)
        .filter(Boolean)
    ),
  ];

  const sizes = [
    ...new Set(
      product?.variants
        ?.map((variant) => variant.size)
        .filter(Boolean)
    ),
  ];

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return (
      <main className="product-details-page">
        <p className="product-details-message">
          Loading product...
        </p>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="product-details-page">
        <p className="product-details-message">
          {error || "Product not found."}
        </p>

        <Link
          to="/products"
          className="back-products-link"
        >
          ← Back to Products
        </Link>
      </main>
    );
  }

  return (
    <main className="product-details-page">

      <div className="container">

        {/* Back */}

        <Link
          to="/products"
          className="back-products-link"
        >
          ← Back to Products
        </Link>

        {/* =========================
            PRODUCT DETAILS
           ========================= */}

        <section className="product-details-container">

          {/* Product Image */}

          <div className="product-details-image">

            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
              />
            ) : (
              <div className="product-details-no-image">
                No Image
              </div>
            )}

          </div>

          {/* Product Information */}

          <div className="product-details-info">

            <span className="product-details-category">
              {product.category_name}
            </span>

            <h1>{product.name}</h1>

            <p className="product-details-price">
              ₹{product.price}
            </p>

            <p className="product-details-description">
              {product.description}
            </p>

            {/* Color */}

            {colors.length > 0 && (
              <div className="variant-section">

                <h4>Color</h4>

                <div className="variant-options">

                  {colors.map((color) => (
                    <button
                      key={color}
                      className={`variant-option ${
                        selectedColor === color
                          ? "selected"
                          : ""
                      }`}
                      onClick={() =>
                        setSelectedColor(color)
                      }
                    >
                      {color}
                    </button>
                  ))}

                </div>

              </div>
            )}

            {/* Size */}

            {sizes.length > 0 && (
              <div className="variant-section">

                <h4>Size</h4>

                <div className="variant-options">

                  {sizes.map((size) => (
                    <button
                      key={size}
                      className={`variant-option ${
                        selectedSize === size
                          ? "selected"
                          : ""
                      }`}
                      onClick={() =>
                        setSelectedSize(size)
                      }
                    >
                      {size}
                    </button>
                  ))}

                </div>

              </div>
            )}

            {/* Stock */}

            <div className="product-details-stock">
              {product.stock > 0
                ? `${product.stock} items available`
                : "Out of stock"}
            </div>

            {/* Quantity */}

            {product.stock > 0 && (
              <div className="quantity-section">

                <h4>Quantity</h4>

                <div className="quantity-control">

                  <button
                    onClick={decreaseQuantity}
                  >
                    −
                  </button>

                  <span>{quantity}</span>

                  <button
                    onClick={increaseQuantity}
                  >
                    +
                  </button>

                </div>

              </div>
            )}

            {/* Actions */}

            <div className="product-details-actions">

              <button
                className="add-cart-btn"
                disabled={product.stock === 0}
              >
                Add to Cart
              </button>

              <button className="wishlist-btn">
                ♡
              </button>

            </div>

          </div>

        </section>

        {/* =========================
            RELATED PRODUCTS
           ========================= */}

        <section className="related-products-section">

          <div className="related-products-heading">

            <span>Discover More</span>

            <h2>
              Related Products
            </h2>

            <p>
              You may also like these products.
            </p>

          </div>

          {relatedLoading ? (
            <p className="related-message">
              Loading related products...
            </p>
          ) : relatedProducts.length > 0 ? (

            <div className="related-products-grid">

              {relatedProducts
                .slice(0, 4)
                .map((relatedProduct) => (

                  <div
                    className="related-product-card"
                    key={relatedProduct.id}
                  >

                    <div className="related-product-image">

                      {relatedProduct.image ? (
                        <img
                          src={relatedProduct.image}
                          alt={relatedProduct.name}
                        />
                      ) : (
                        <span>
                          No Image
                        </span>
                      )}

                    </div>

                    <div className="related-product-content">

                      <span>
                        {relatedProduct.category_name}
                      </span>

                      <h3>
                        {relatedProduct.name}
                      </h3>

                      <p>
                        ₹{relatedProduct.price}
                      </p>

                      <Link
                        to={`/products/${relatedProduct.id}`}
                      >
                        View Product →
                      </Link>

                    </div>

                  </div>

                ))}

            </div>

          ) : (

            <p className="related-message">
              No related products available.
            </p>

          )}

        </section>

      </div>

    </main>
  );
}

export default ProductDetails;