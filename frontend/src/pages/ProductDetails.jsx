import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./productDetails.css";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  const [loading, setLoading] = useState(true);
  const [relatedLoading, setRelatedLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================
  // FETCH PRODUCT
  // =========================================

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

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

  // =========================================
  // FETCH RELATED PRODUCTS
  // =========================================

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        setRelatedLoading(true);

        const response = await axios.get(
          "http://127.0.0.1:8000/api/products/"
        );

        const productList =
          response.data.results || response.data;

        setRelatedProducts(
          productList.filter(
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

  // =========================================
  // COLORS
  // =========================================

  const colors = product?.available_colors || [];

  // =========================================
  // SIZES
  // =========================================

  const sizes = product?.available_sizes || [];

  // =========================================
  // QUANTITY
  // =========================================

  const increaseQuantity = () => {
    if (quantity < Number(product.stock)) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  // =========================================
  // ADD TO CART
  // =========================================

  const handleAddToCart = () => {
    if (!product) {
      return;
    }

    const stock = Number(product.stock || 0);

    if (stock <= 0) {
      return;
    }

    // -----------------------------------------
    // Prepare cart item
    // -----------------------------------------

    const cartItem = {
      id: product.id,
      name: product.name,
      brand: product.brand || "VYNORA",

      price: Number(
        product.selling_price ||
        product.price ||
        0
      ),

      mrp: Number(
        product.mrp ||
        product.price ||
        0
      ),

      discount_percent: Number(
        product.discount_percent || 0
      ),

      image: product.image || "",

      quantity: quantity,

      selectedColor: selectedColor,
      selectedSize: selectedSize,

      stock: stock,
    };

    // -----------------------------------------
    // Get existing cart
    // -----------------------------------------

    const existingCart =
      JSON.parse(
        localStorage.getItem("vynora_cart")
      ) || [];

    // -----------------------------------------
    // Check same product + color + size
    // -----------------------------------------

    const existingItemIndex =
      existingCart.findIndex(
        (item) =>
          item.id === cartItem.id &&
          item.selectedColor ===
            cartItem.selectedColor &&
          item.selectedSize ===
            cartItem.selectedSize
      );

    // -----------------------------------------
    // If already exists
    // -----------------------------------------

    if (existingItemIndex !== -1) {
      const existingItem =
        existingCart[existingItemIndex];

      const currentQuantity =
        Number(existingItem.quantity || 1);

      const newQuantity =
        currentQuantity + quantity;

      existingItem.quantity = Math.min(
        newQuantity,
        stock
      );
    }

    // -----------------------------------------
    // New product
    // -----------------------------------------

    else {
      existingCart.push(cartItem);
    }

    // -----------------------------------------
    // Save cart
    // -----------------------------------------

    localStorage.setItem(
      "vynora_cart",
      JSON.stringify(existingCart)
    );

    // -----------------------------------------
    // Go to cart
    // -----------------------------------------

    navigate("/cart");
  };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <main className="product-details-page">
        <p className="product-details-message">
          Loading product...
        </p>
      </main>
    );
  }

  // =========================================
  // ERROR
  // =========================================

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

  // =========================================
  // PRODUCT VALUES
  // =========================================

  const price = Number(
    product.selling_price ||
      product.price ||
      0
  );

  const mrp = Number(
    product.mrp || price
  );

  const discount = Number(
    product.discount_percent || 0
  );

  const stock = Number(
    product.stock || 0
  );

  // =========================================
  // RETURN
  // =========================================

  return (
    <main className="product-details-page">
      <div className="container">

        {/* BACK TO PRODUCTS */}

        <Link
          to="/products"
          className="back-products-link"
        >
          ← Back to Products
        </Link>

        {/* =========================================
            PRODUCT DETAILS
            ========================================= */}

        <section className="product-details-container">

          {/* PRODUCT IMAGE */}

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

            {/* DISCOUNT BADGE */}

            {discount > 0 && (
              <span className="product-details-discount">
                {discount}% OFF
              </span>
            )}

          </div>

          {/* PRODUCT INFORMATION */}

          <div className="product-details-info">

            {/* BRAND */}

            <span className="product-details-brand">
              {product.brand || "VYNORA"}
            </span>

            {/* CATEGORY */}

            <span className="product-details-category">
              {product.category_name ||
                "Collection"}
            </span>

            {/* PRODUCT NAME */}

            <h1>{product.name}</h1>

            {/* PRICE */}

            <div className="product-details-price">

              <span className="details-selling-price">
                ₹{price.toLocaleString("en-IN")}
              </span>

              {discount > 0 && (
                <span className="details-mrp">
                  ₹{mrp.toLocaleString("en-IN")}
                </span>
              )}

              {discount > 0 && (
                <span className="details-discount">
                  {discount}% OFF
                </span>
              )}

            </div>

            {/* TAX */}

            <p className="tax-info">
              Inclusive of all taxes
            </p>

            {/* DESCRIPTION */}

            <div className="product-details-description">

              <h3>Product Details</h3>

              <p>
                {product.description ||
                  "No description available for this product."}
              </p>

            </div>

            {/* =====================================
                COLOR
                ===================================== */}

            {colors.length > 0 && (
              <div className="variant-section">

                <div className="variant-heading">

                  <h4>Color</h4>

                  {selectedColor && (
                    <span>
                      {selectedColor}
                    </span>
                  )}

                </div>

                <div className="variant-options">

                  {colors.map((color) => (
                    <button
                      type="button"
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

            {/* =====================================
                SIZE
                ===================================== */}

            {sizes.length > 0 && (
              <div className="variant-section">

                <div className="variant-heading">

                  <h4>Size</h4>

                  {selectedSize && (
                    <span>
                      {selectedSize}
                    </span>
                  )}

                </div>

                <div className="variant-options">

                  {sizes.map((size) => (
                    <button
                      type="button"
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

            {/* =====================================
                STOCK
                ===================================== */}

            <div
              className={`product-details-stock ${
                stock > 0
                  ? "stock-available"
                  : "stock-unavailable"
              }`}
            >
              {product.stock_status ||
                (stock > 0
                  ? `${stock} items available`
                  : "Out of stock")}
            </div>

            {/* =====================================
                QUANTITY
                ===================================== */}

            {stock > 0 && (
              <div className="quantity-section">

                <h4>Quantity</h4>

                <div className="quantity-control">

                  <button
                    type="button"
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                  >
                    −
                  </button>

                  <span>
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={increaseQuantity}
                    disabled={
                      quantity >= stock
                    }
                  >
                    +
                  </button>

                </div>

              </div>
            )}

            {/* =====================================
                ACTIONS
                ===================================== */}

            <div className="product-details-actions">

              <button
                type="button"
                className="add-cart-btn"
                disabled={stock === 0}
                onClick={handleAddToCart}
              >
                {stock > 0
                  ? "Add to Cart"
                  : "Out of Stock"}
              </button>

              <button
                type="button"
                className="wishlist-btn"
                aria-label="Add to wishlist"
              >
                ♡
              </button>

            </div>

          </div>

        </section>

        {/* =========================================
            RELATED PRODUCTS
            ========================================= */}

        <section className="related-products-section">

          <div className="related-products-heading">

            <span>
              Discover More
            </span>

            <h2>
              Related Products
            </h2>

            <p>
              You may also like these products.
            </p>

          </div>

          {/* RELATED LOADING */}

          {relatedLoading ? (
            <p className="related-message">
              Loading related products...
            </p>
          ) : relatedProducts.length > 0 ? (

            <div className="related-products-grid">

              {relatedProducts
                .slice(0, 4)
                .map((relatedProduct) => {

                  const relatedPrice =
                    Number(
                      relatedProduct.selling_price ||
                        relatedProduct.price ||
                        0
                    );

                  return (

                    <div
                      className="related-product-card"
                      key={relatedProduct.id}
                    >

                      {/* IMAGE */}

                      <div className="related-product-image">

                        {relatedProduct.image ? (
                          <img
                            src={relatedProduct.image}
                            alt={
                              relatedProduct.name
                            }
                          />
                        ) : (
                          <span>
                            No Image
                          </span>
                        )}

                      </div>

                      {/* CONTENT */}

                      <div className="related-product-content">

                        <span>
                          {relatedProduct.brand ||
                            "VYNORA"}
                        </span>

                        <small>
                          {relatedProduct.category_name ||
                            "Collection"}
                        </small>

                        <h3>
                          {relatedProduct.name}
                        </h3>

                        <p>
                          ₹
                          {relatedPrice.toLocaleString(
                            "en-IN"
                          )}
                        </p>

                        <Link
                          to={`/products/${relatedProduct.id}`}
                        >
                          View Product →
                        </Link>

                      </div>

                    </div>

                  );
                })}

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
