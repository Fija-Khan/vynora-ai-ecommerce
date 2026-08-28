import React from "react";
import { Link } from "react-router-dom";

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
          className="wishlist-btn"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();

            // Wishlist functionality will be added later
            console.log(
              "Wishlist clicked:",
              product.id
            );
          }}
          aria-label="Add to wishlist"
        >
          ♡
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