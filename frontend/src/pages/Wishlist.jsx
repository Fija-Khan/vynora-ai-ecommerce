import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./wishlist.css";

const API_URL = "http://127.0.0.1:8000";

// ========================================
// JWT AUTHENTICATED REQUEST
// ========================================

const authenticatedRequest = async (config) => {
  let accessToken = localStorage.getItem("vynora_access_token");
  const refreshToken = localStorage.getItem("vynora_refresh_token");

  if (!accessToken) {
    throw new Error("No access token");
  }

  try {
    return await axios({
      ...config,
      headers: {
        ...(config.headers || {}),
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (error) {
    // Refresh only if access token expired
    if (error.response?.status !== 401 || !refreshToken) {
      throw error;
    }

    try {
      const refreshResponse = await axios.post(
        `${API_URL}/api/accounts/token/refresh/`,
        {
          refresh: refreshToken,
        }
      );

      const newAccessToken = refreshResponse.data.access;

      localStorage.setItem(
        "vynora_access_token",
        newAccessToken
      );

      // Retry original request
      return await axios({
        ...config,
        headers: {
          ...(config.headers || {}),
          Authorization: `Bearer ${newAccessToken}`,
        },
      });
    } catch (refreshError) {
      console.error(
        "Token refresh failed:",
        refreshError.response?.data || refreshError.message
      );

      localStorage.removeItem("vynora_access_token");
      localStorage.removeItem("vynora_refresh_token");
      localStorage.removeItem("vynora_logged_in");
      localStorage.removeItem("vynora_user");

      throw refreshError;
    }
  }
};

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartLoading, setCartLoading] = useState(null);

  // ========================================
  // LOAD WISHLIST FROM DATABASE
  // ========================================

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem(
        "vynora_access_token"
      );

      if (!token) {
        console.log("User is not logged in");
        setLoading(false);
        return;
      }

      const response = await authenticatedRequest({
        method: "GET",
        url: `${API_URL}/api/wishlist/`,
      });

      console.log("Wishlist loaded:", response.data);

      setWishlist(response.data.items || []);
    } catch (error) {
      console.error(
        "Wishlist loading error:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // REMOVE FROM WISHLIST
  // ========================================

  const removeFromWishlist = async (itemId) => {
    try {
      await authenticatedRequest({
        method: "DELETE",
        url: `${API_URL}/api/wishlist/items/${itemId}/`,
      });

      setWishlist((prev) =>
        prev.filter((item) => item.id !== itemId)
      );

      console.log("Removed from wishlist:", itemId);
    } catch (error) {
      console.error(
        "Remove wishlist error:",
        error.response?.data || error.message
      );
    }
  };

  // ========================================
  // ADD TO CART
  // ========================================

  const addToCart = async (productId) => {
    try {
      const token = localStorage.getItem(
        "vynora_access_token"
      );

      if (!token) {
        console.log("Please login to add products to cart");
        return;
      }

      setCartLoading(productId);

      const response = await authenticatedRequest({
        method: "POST",
        url: `${API_URL}/api/cart/items/`,
        data: {
          product: productId,
          quantity: 1,
        },
      });

      console.log("Added to cart:", response.data);

      alert("Product added to cart!");
    } catch (error) {
      console.error(
        "Add to cart error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.detail ||
          "Unable to add product to cart."
      );
    } finally {
      setCartLoading(null);
    }
  };

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <main className="wishlist-page">
        <div className="wishlist-container">
          <div className="wishlist-header">
            <div>
              <span className="wishlist-eyebrow">
                VYNORA COLLECTION
              </span>

              <h1>My Wishlist</h1>

              <p>
                Your favorite products, saved in one place.
              </p>
            </div>
          </div>

          <section className="wishlist-empty">
            <h2>Loading Wishlist...</h2>
          </section>
        </div>
      </main>
    );
  }

  // ========================================
  // EMPTY WISHLIST
  // ========================================

  if (wishlist.length === 0) {
    return (
      <main className="wishlist-page">
        <div className="wishlist-container">
          <div className="wishlist-header">
            <div>
              <span className="wishlist-eyebrow">
                VYNORA COLLECTION
              </span>

              <h1>My Wishlist</h1>

              <p>
                Save your favorite products and find them
                whenever you're ready to shop.
              </p>
            </div>

            <Link
              to="/products"
              className="wishlist-header-btn"
            >
              Continue Shopping
              <span>→</span>
            </Link>
          </div>

          <section className="wishlist-empty">
            <div className="wishlist-empty-icon">
              <span>♡</span>
            </div>

            <span className="wishlist-empty-label">
              YOUR COLLECTION
            </span>

            <h2>Your Wishlist is Empty</h2>

            <p>
              You haven't saved any products yet.
              Explore our collection and add something
              you love to your wishlist.
            </p>

            <Link
              to="/products"
              className="wishlist-shop-btn"
            >
              Explore Products
              <span>→</span>
            </Link>
          </section>
        </div>
      </main>
    );
  }

  // ========================================
  // WISHLIST
  // ========================================

  return (
    <main className="wishlist-page">
      <div className="wishlist-container">

        {/* PAGE HEADER */}

        <div className="wishlist-header">
          <div>
            <span className="wishlist-eyebrow">
              VYNORA COLLECTION
            </span>

            <h1>My Wishlist</h1>

            <p>
              Your favorite products, saved in one place.
            </p>
          </div>

          <div className="wishlist-header-right">
            <div className="wishlist-count-box">
              <strong>{wishlist.length}</strong>

              <span>
                {wishlist.length === 1
                  ? "Item"
                  : "Items"}
              </span>
            </div>

            <Link
              to="/products"
              className="wishlist-header-btn"
            >
              Continue Shopping
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* WISHLIST LIST */}

        <div className="wishlist-grid">
          {wishlist.map((item) => {
            const productId = item.product;

            const productName =
              item.product_name || "Vynora Product";

            const price = Number(
              item.product_price || 0
            );

            const productImage =
              item.product_image || "";

            return (
              <article
                className="wishlist-card"
                key={item.id}
              >

                {/* PRODUCT IMAGE */}

                <div className="wishlist-image">
                  {productImage ? (
                    <img
                      src={productImage}
                      alt={productName}
                    />
                  ) : (
                    <span>♡</span>
                  )}

                  <button
                    type="button"
                    className="wishlist-remove"
                    aria-label="Remove from wishlist"
                    onClick={() =>
                      removeFromWishlist(item.id)
                    }
                  >
                    ×
                  </button>
                </div>

                {/* PRODUCT DETAILS */}

                <div className="wishlist-content">

                  <span className="wishlist-product-label">
                    VYNORA PRODUCT
                  </span>

                  <h2>{productName}</h2>

                  <div className="wishlist-price">
                    ₹
                    {price.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>

                  {/* ACTIONS */}

                  <div className="wishlist-actions">

                    <Link
                      to={`/products/${productId}`}
                      className="wishlist-view-btn"
                    >
                      View Product
                    </Link>

                    <button
                      type="button"
                      className="wishlist-cart-btn"
                      onClick={() =>
                        addToCart(productId)
                      }
                      disabled={
                        cartLoading === productId
                      }
                    >
                      {cartLoading === productId
                        ? "Adding..."
                        : "Add to Cart"}
                    </button>

                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* BOTTOM */}

        <div className="wishlist-bottom">
          <Link
            to="/products"
            className="wishlist-shopping-link"
          >
            ← Continue Shopping
          </Link>
        </div>

      </div>
    </main>
  );
}

export default Wishlist;