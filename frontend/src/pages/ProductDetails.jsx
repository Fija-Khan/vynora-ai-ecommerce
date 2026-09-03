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
  // REVIEW STATES
  // =========================================

  const [reviews, setReviews] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(true);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState("");

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
  // FETCH REVIEWS
  // =========================================

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setReviewLoading(true);

        const response = await axios.get(
          `http://127.0.0.1:8000/api/reviews/?product=${id}`
        );

        const reviewList =
          response.data.results || response.data;

        setReviews(reviewList);
      } catch (error) {
        console.error(
          "Failed to fetch reviews:",
          error
        );
      } finally {
        setReviewLoading(false);
      }
    };

    fetchReviews();
  }, [id]);

  // =========================================
  // COLORS
  // =========================================

  const colors = product?.available_colors || [];

  // =========================================
  // SIZES
  // =========================================

  const sizes = product?.available_sizes || [];

  // =========================================
  // INCREASE QUANTITY
  // =========================================

  const increaseQuantity = () => {
    if (quantity < Number(product.stock)) {
      setQuantity((prev) => prev + 1);
    }
  };

  // =========================================
  // DECREASE QUANTITY
  // =========================================

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  // =========================================
  // ADD TO CART
  // =========================================

  const handleAddToCart = () => {
    // -----------------------------------------
    // CHECK LOGIN
    // -----------------------------------------

    const accessToken = localStorage.getItem(
      "vynora_access_token"
    );

    // User is NOT logged in
    if (!accessToken) {
      localStorage.setItem(
        "vynora_redirect_after_login",
        `/products/${id}`
      );

      navigate("/login");
      return;
    }

    // -----------------------------------------
    // PRODUCT CHECK
    // -----------------------------------------

    if (!product) {
      return;
    }

    const stock = Number(product.stock || 0);

    if (stock <= 0) {
      return;
    }

    // -----------------------------------------
    // PREPARE CART ITEM
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
    // GET EXISTING CART
    // -----------------------------------------

    let existingCart = [];

    try {
      existingCart =
        JSON.parse(
          localStorage.getItem("vynora_cart")
        ) || [];
    } catch (error) {
      console.error(
        "Failed to read cart:",
        error
      );

      existingCart = [];
    }

    // -----------------------------------------
    // CHECK SAME PRODUCT + COLOR + SIZE
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
    // ALREADY EXISTS
    // -----------------------------------------

    if (existingItemIndex !== -1) {
      const existingItem =
        existingCart[existingItemIndex];

      const currentQuantity = Number(
        existingItem.quantity || 1
      );

      const newQuantity =
        currentQuantity + quantity;

      existingItem.quantity = Math.min(
        newQuantity,
        stock
      );
    }

    // -----------------------------------------
    // NEW PRODUCT
    // -----------------------------------------

    else {
      existingCart.push(cartItem);
    }

    // -----------------------------------------
    // SAVE CART
    // -----------------------------------------

    localStorage.setItem(
      "vynora_cart",
      JSON.stringify(existingCart)
    );

    // -----------------------------------------
    // GO TO CART
    // -----------------------------------------

    navigate("/cart");
  };

  // =========================================
  // SUBMIT REVIEW
  // =========================================

  const handleSubmitReview = async (event) => {
    event.preventDefault();

    const accessToken = localStorage.getItem(
      "vynora_access_token"
    );

    // -----------------------------------------
    // CHECK LOGIN
    // -----------------------------------------

    if (!accessToken) {
      localStorage.setItem(
        "vynora_redirect_after_login",
        `/products/${id}`
      );

      navigate("/login");
      return;
    }

    // -----------------------------------------
    // VALIDATE COMMENT
    // -----------------------------------------

    if (!reviewComment.trim()) {
      setReviewError(
        "Please write a comment before submitting."
      );

      return;
    }

    try {
      setReviewSubmitting(true);
      setReviewError("");

      const response = await axios.post(
        "http://127.0.0.1:8000/api/reviews/",
        {
          product: Number(id),
          rating: Number(reviewRating),
          comment: reviewComment.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Add newly created review at top
      setReviews((prevReviews) => [
        response.data,
        ...prevReviews,
      ]);

      // Reset form
      setReviewRating(5);
      setReviewComment("");
    } catch (error) {
      console.error(
        "Failed to submit review:",
        error
      );

      if (error.response?.data) {
        const data = error.response.data;

        if (data.non_field_errors) {
          setReviewError(
            data.non_field_errors[0]
          );
        } else if (data.detail) {
          setReviewError(data.detail);
        } else {
          setReviewError(
            "Unable to submit review."
          );
        }
      } else {
        setReviewError(
          "Unable to submit review."
        );
      }
    } finally {
      setReviewSubmitting(false);
    }
  };

  // =========================================
  // CALCULATE AVERAGE RATING
  // =========================================

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce(
            (total, review) =>
              total + Number(review.rating || 0),
            0
          ) / reviews.length
        ).toFixed(1)
      : "0.0";

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

        {/* =====================================
            PRODUCT DETAILS
        ===================================== */}

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
            REVIEWS SECTION
        ========================================= */}

        <section className="reviews-section">

          <div className="reviews-heading">

            <span>
              Customer Feedback
            </span>

            <h2>
              Ratings & Reviews
            </h2>

            <p>
              See what customers think about this product.
            </p>

          </div>

          {/* REVIEW SUMMARY */}

          <div className="reviews-summary">

            <div className="average-rating">

              <strong>
                {averageRating}
              </strong>

              <div className="rating-stars">
                {"★".repeat(
                  Math.round(
                    Number(averageRating)
                  )
                )}
                {"☆".repeat(
                  5 -
                    Math.round(
                      Number(averageRating)
                    )
                )}
              </div>

              <span>
                {reviews.length}{" "}
                {reviews.length === 1
                  ? "Review"
                  : "Reviews"}
              </span>

            </div>

          </div>

          {/* REVIEW FORM */}

          <div className="review-form-container">

            <h3>
              Write a Review
            </h3>

            <form
              onSubmit={handleSubmitReview}
              className="review-form"
            >

              {/* RATING */}

              <div className="review-rating-field">

                <label>
                  Your Rating
                </label>

                <div className="review-rating-buttons">

                  {[1, 2, 3, 4, 5].map(
                    (rating) => (
                      <button
                        key={rating}
                        type="button"
                        className={
                          rating <=
                          reviewRating
                            ? "rating-selected"
                            : ""
                        }
                        onClick={() =>
                          setReviewRating(
                            rating
                          )
                        }
                      >
                        ★
                      </button>
                    )
                  )}

                </div>

              </div>

              {/* COMMENT */}

              <div className="review-comment-field">

                <label htmlFor="review-comment">
                  Your Comment
                </label>

                <textarea
                  id="review-comment"
                  value={reviewComment}
                  onChange={(event) =>
                    setReviewComment(
                      event.target.value
                    )
                  }
                  placeholder="Share your experience with this product..."
                  rows="5"
                />

              </div>

              {/* ERROR */}

              {reviewError && (
                <p className="review-error">
                  {reviewError}
                </p>
              )}

              {/* SUBMIT */}

              <button
                type="submit"
                className="submit-review-btn"
                disabled={reviewSubmitting}
              >
                {reviewSubmitting
                  ? "Submitting..."
                  : "Submit Review"}
              </button>

            </form>

          </div>

          {/* EXISTING REVIEWS */}

          <div className="reviews-list">

            <h3>
              Customer Reviews
            </h3>

            {reviewLoading ? (
              <p className="review-message">
                Loading reviews...
              </p>
            ) : reviews.length > 0 ? (
              reviews.map((review) => (
                <article
                  className="review-card"
                  key={review.id}
                >

                  <div className="review-card-header">

                    <div>
                      <strong>
                        {review.user_name ||
                          "Customer"}
                      </strong>

                      <div className="review-stars">
                        {"★".repeat(
                          Number(
                            review.rating
                          )
                        )}

                        {"☆".repeat(
                          5 -
                            Number(
                              review.rating
                            )
                        )}
                      </div>
                    </div>

                    {review.created_at && (
                      <time>
                        {new Date(
                          review.created_at
                        ).toLocaleDateString(
                          "en-IN"
                        )}
                      </time>
                    )}

                  </div>

                  {review.comment && (
                    <p className="review-comment">
                      {review.comment}
                    </p>
                  )}

                </article>
              ))
            ) : (
              <p className="review-message">
                No reviews yet. Be the first to review this product!
              </p>
            )}

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
                            src={
                              relatedProduct.image
                            }
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