import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const ProductCard = ({ product }) => {
  // Product price
  const price = Number(product.price || 0);

  // Discount percentage
  const discount = Number(product.discount_percent || 0);

  // Calculate original MRP
  const mrp =
    discount > 0
      ? Math.round(price / (1 - discount / 100))
      : price;

  // =================================
  // WISHLIST STATE
  // =================================

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistItemId, setWishlistItemId] = useState(null);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  // =================================
  // CHECK WISHLIST
  // =================================

  useEffect(() => {
    const checkWishlist = async () => {
      try {
        const token = localStorage.getItem("vynora_access_token");

        if (!token) return;

        const response = await axios.get(
          "http://127.0.0.1:8000/api/wishlist/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const wishlistItems = response.data?.items || [];

        const existingItem = wishlistItems.find(
          (item) => Number(item.product) === Number(product.id)
        );

        if (existingItem) {
          setIsWishlisted(true);
          setWishlistItemId(existingItem.id);
        }
      } catch (error) {
        console.error(
          "Wishlist check error:",
          error.response?.data || error.message
        );
      }
    };

    checkWishlist();
  }, [product.id]);

  // =================================
  // ADD / REMOVE WISHLIST
  // =================================

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const token = localStorage.getItem("vynora_access_token");

      if (!token) {
        console.log("Please login to use wishlist");
        return;
      }

      setWishlistLoading(true);

      // =================================
      // REMOVE FROM WISHLIST
      // =================================

      if (isWishlisted && wishlistItemId) {
        await axios.delete(
          `http://127.0.0.1:8000/api/wishlist/items/${wishlistItemId}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setIsWishlisted(false);
        setWishlistItemId(null);

        console.log("Removed from wishlist");
        return;
      }

      // =================================
      // ADD TO WISHLIST
      // =================================

      const response = await axios.post(
        "http://127.0.0.1:8000/api/wishlist/items/",
        {
          product: product.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIsWishlisted(true);
      setWishlistItemId(response.data.id);

      console.log("Added to wishlist:", response.data);
    } catch (error) {
      console.error(
        "Wishlist error:",
        error.response?.data || error.message
      );
    } finally {
      setWishlistLoading(false);
    }
  };

  return (
    <div className="product-card">
      {/* =================================
          PRODUCT IMAGE
          ================================= */}

      <div className="product-image-wrapper">
        <img
          src={
            product.image ||
            "/images/product-placeholder.jpg"
          }
          alt={product.name || "Product"}
          className="product-image"
        />

        {/* DISCOUNT BADGE */}

        {discount > 0 && (
          <span className="discount-badge">
            {discount}% OFF
          </span>
        )}

        {/* WISHLIST BUTTON */}

        <button
          type="button"
          className={`wishlist-btn ${
            isWishlisted ? "wishlisted" : ""
          }`}
          onClick={handleWishlist}
          disabled={wishlistLoading}
          aria-label={
            isWishlisted
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
        >
          {isWishlisted ? "♥" : "♡"}
        </button>
      </div>

      {/* =================================
          PRODUCT INFORMATION
          ================================= */}

      <div className="product-info">
        {/* BRAND */}

        <span className="product-brand">
          {product.brand || "VYNORA"}
        </span>

        {/* CATEGORY */}

        <span className="product-category">
          {product.category_name || "Collection"}
        </span>

        {/* PRODUCT NAME */}

        <h3 className="product-name">
          {product.name}
        </h3>

        {/* =================================
            PRICE
            ================================= */}

        <div className="product-price">
          {/* SELLING PRICE */}

          <span className="selling-price">
            ₹{price.toLocaleString("en-IN")}
          </span>

          {/* ORIGINAL MRP */}

          {discount > 0 && (
            <span className="original-price">
              ₹{mrp.toLocaleString("en-IN")}
            </span>
          )}

          {/* DISCOUNT */}

          {discount > 0 && (
            <span className="discount-text">
              {discount}% OFF
            </span>
          )}
        </div>

        {/* =================================
            STOCK
            ================================= */}

        <div
          className={
            product.stock > 0
              ? "stock available"
              : "stock unavailable"
          }
        >
          {product.stock > 0
            ? `${product.stock} items in stock`
            : "Out of stock"}
        </div>

        {/* =================================
            VIEW DETAILS
            ================================= */}

        <Link
          to={`/products/${product.id}`}
          className="view-details-btn"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
