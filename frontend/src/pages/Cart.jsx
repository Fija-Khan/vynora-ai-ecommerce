import { useState } from "react";
import { Link } from "react-router-dom";
import "./cart.css";

function Cart() {
  // =========================================
  // LOAD CART FROM LOCAL STORAGE
  // =========================================

  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem("vynora_cart");

      if (!savedCart) {
        return [];
      }

      const parsedCart = JSON.parse(savedCart);

      return Array.isArray(parsedCart) ? parsedCart : [];
    } catch (error) {
      console.error("Failed to load cart:", error);
      return [];
    }
  });

  // =========================================
  // SAVE CART
  // =========================================

  const saveCart = (updatedCart) => {
    setCartItems(updatedCart);

    localStorage.setItem(
      "vynora_cart",
      JSON.stringify(updatedCart)
    );
  };

  // =========================================
  // IMAGE URL
  // =========================================

  const getImageUrl = (image) => {
    if (!image) {
      return "/images/product-placeholder.jpg";
    }

    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    return `http://127.0.0.1:8000${image}`;
  };

  // =========================================
  // UPDATE QUANTITY
  // =========================================

  const updateQuantity = (
    id,
    color,
    size,
    type
  ) => {
    const updatedCart = cartItems.map((item) => {
      if (
        item.id !== id ||
        item.selectedColor !== color ||
        item.selectedSize !== size
      ) {
        return item;
      }

      const currentQuantity = Number(
        item.quantity || 1
      );

      const stock = Number(
        item.stock || 999
      );

      // INCREASE
      if (type === "increase") {
        return {
          ...item,
          quantity: Math.min(
            currentQuantity + 1,
            stock
          ),
        };
      }

      // DECREASE
      if (type === "decrease") {
        return {
          ...item,
          quantity: Math.max(
            currentQuantity - 1,
            1
          ),
        };
      }

      return item;
    });

    saveCart(updatedCart);
  };

  // =========================================
  // REMOVE ITEM
  // =========================================

  const removeItem = (
    id,
    color,
    size
  ) => {
    const updatedCart = cartItems.filter(
      (item) =>
        !(
          item.id === id &&
          item.selectedColor === color &&
          item.selectedSize === size
        )
    );

    saveCart(updatedCart);
  };

  // =========================================
  // CLEAR CART
  // =========================================

  const clearCart = () => {
    setCartItems([]);

    localStorage.removeItem("vynora_cart");
  };

  // =========================================
  // PRICE CALCULATIONS
  // =========================================

  const subtotal = cartItems.reduce(
    (total, item) =>
      total +
      Number(item.price || 0) *
        Number(item.quantity || 1),
    0
  );

  const deliveryCharge =
    subtotal === 0 || subtotal >= 999
      ? 0
      : 49;

  const total =
    subtotal + deliveryCharge;

  // =========================================
  // TOTAL ITEMS
  // =========================================

  const totalItems = cartItems.reduce(
    (total, item) =>
      total +
      Number(item.quantity || 1),
    0
  );

  // =========================================
  // EMPTY CART
  // =========================================

  if (cartItems.length === 0) {
    return (
      <main className="cart-page">
        <div className="cart-container">

          {/* HEADER */}

          <div className="cart-header">
            <div>
              <span className="cart-eyebrow">
                VYNORA SHOPPING BAG
              </span>

              <h1>Your Cart</h1>

              <p>
                Review your selected products
                before checkout.
              </p>
            </div>

            <Link
              to="/products"
              className="continue-shopping"
            >
              ← Continue Shopping
            </Link>
          </div>

          {/* EMPTY CART */}

          <section className="empty-cart">

            <div className="empty-cart-icon">
              🛍
            </div>

            <h2>
              Your cart is empty
            </h2>

            <p>
              Looks like you haven't added
              anything to your cart yet.
            </p>

            <Link
              to="/products"
              className="shop-now-btn"
            >
              Shop Now
            </Link>

          </section>
        </div>
      </main>
    );
  }

  // =========================================
  // CART PAGE
  // =========================================

  return (
    <main className="cart-page">
      <div className="cart-container">

        {/* =====================================
            HEADER
        ===================================== */}

        <div className="cart-header">

          <div>
            <span className="cart-eyebrow">
              VYNORA SHOPPING BAG
            </span>

            <h1>Your Cart</h1>

            <p>
              Review your selected products
              before checkout.
            </p>
          </div>

          <Link
            to="/products"
            className="continue-shopping"
          >
            ← Continue Shopping
          </Link>

        </div>

        {/* =====================================
            CART LAYOUT
        ===================================== */}

        <section className="cart-layout">

          {/* =====================================
              LEFT SIDE
          ===================================== */}

          <div className="cart-items-section">

            {/* ITEMS HEADER */}

            <div className="cart-items-header">

              <div>
                <h2>
                  Shopping Bag
                </h2>

                <span>
                  {totalItems} item
                  {totalItems !== 1
                    ? "s"
                    : ""}
                </span>
              </div>

              <button
                type="button"
                className="clear-cart-btn"
                onClick={clearCart}
              >
                Clear All
              </button>

            </div>

            {/* =====================================
                CART ITEMS
            ===================================== */}

            <div className="cart-items">

              {cartItems.map((item) => {

                const quantity =
                  Number(
                    item.quantity || 1
                  );

                const price =
                  Number(
                    item.price || 0
                  );

                const itemTotal =
                  price * quantity;

                const stock =
                  Number(
                    item.stock || 999
                  );

                return (
                  <article
                    className="cart-item"
                    key={`${item.id}-${item.selectedColor || ""}-${item.selectedSize || ""}`}
                  >

                    {/* PRODUCT IMAGE */}

                    <div className="cart-item-image">

                      <img
                        src={getImageUrl(
                          item.image
                        )}
                        alt={
                          item.name ||
                          "Vynora product"
                        }
                        onError={(e) => {
                          e.currentTarget.src =
                            "/images/product-placeholder.jpg";
                        }}
                      />

                    </div>

                    {/* PRODUCT INFORMATION */}

                    <div className="cart-item-info">

                      <div className="cart-item-top">

                        <div>

                          <span className="cart-item-brand">
                            {item.brand ||
                              "VYNORA"}
                          </span>

                          <h3>
                            {item.name}
                          </h3>

                        </div>

                        {/* REMOVE */}

                        <button
                          type="button"
                          className="remove-item"
                          onClick={() =>
                            removeItem(
                              item.id,
                              item.selectedColor,
                              item.selectedSize
                            )
                          }
                        >
                          ×
                        </button>

                      </div>

                      {/* COLOR */}

                      {item.selectedColor && (
                        <p className="cart-variant">
                          <strong>
                            Color:
                          </strong>{" "}
                          {item.selectedColor}
                        </p>
                      )}

                      {/* SIZE */}

                      {item.selectedSize && (
                        <p className="cart-variant">
                          <strong>
                            Size:
                          </strong>{" "}
                          {item.selectedSize}
                        </p>
                      )}

                      {/* PRICE */}

                      <div className="cart-item-pricing">

                        <span className="cart-item-price">
                          ₹
                          {price.toLocaleString(
                            "en-IN"
                          )}
                        </span>

                        {item.mrp &&
                          Number(item.mrp) >
                            price && (
                            <span className="cart-item-mrp">
                              ₹
                              {Number(
                                item.mrp
                              ).toLocaleString(
                                "en-IN"
                              )}
                            </span>
                          )}

                        {item.discount_percent >
                          0 && (
                          <span className="cart-item-discount">
                            {
                              item.discount_percent
                            }
                            % OFF
                          </span>
                        )}

                      </div>

                      {/* BOTTOM ACTIONS */}

                      <div className="cart-item-actions">

                        {/* QUANTITY */}

                        <div className="quantity-wrapper">

                          <span className="quantity-label">
                            Qty
                          </span>

                          <div className="cart-quantity">

                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  item.selectedColor,
                                  item.selectedSize,
                                  "decrease"
                                )
                              }
                              disabled={
                                quantity <= 1
                              }
                            >
                              −
                            </button>

                            <span>
                              {quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  item.selectedColor,
                                  item.selectedSize,
                                  "increase"
                                )
                              }
                              disabled={
                                quantity >=
                                stock
                              }
                            >
                              +
                            </button>

                          </div>

                        </div>

                        {/* ITEM TOTAL */}

                        <div className="cart-item-total">

                          <span>
                            Item Total
                          </span>

                          <strong>
                            ₹
                            {itemTotal.toLocaleString(
                              "en-IN"
                            )}
                          </strong>

                        </div>

                      </div>

                    </div>

                  </article>
                );
              })}

            </div>

            {/* CONTINUE SHOPPING */}

            <div className="cart-bottom-action">

              <Link
                to="/products"
                className="continue-shopping-bottom"
              >
                ← Continue Shopping
              </Link>

            </div>

          </div>

          {/* =====================================
              RIGHT SIDE — PRICE DETAILS
          ===================================== */}

          <aside className="cart-summary">

            <h2>
              Price Details
            </h2>

            {/* SUBTOTAL */}

            <div className="summary-row">

              <span>
                Subtotal
              </span>

              <span>
                ₹
                {subtotal.toLocaleString(
                  "en-IN"
                )}
              </span>

            </div>

            {/* DELIVERY */}

            <div className="summary-row">

              <span>
                Delivery
              </span>

              <span
                className={
                  deliveryCharge === 0
                    ? "free-delivery"
                    : ""
                }
              >
                {deliveryCharge === 0
                  ? "FREE"
                  : `₹${deliveryCharge}`}
              </span>

            </div>

            {/* FREE DELIVERY MESSAGE */}

            {subtotal > 0 &&
              subtotal < 999 && (
                <div className="delivery-message">

                  Add ₹
                  {(999 - subtotal).toLocaleString(
                    "en-IN"
                  )}{" "}
                  more for FREE delivery

                </div>
              )}

            {subtotal >= 999 && (
              <div className="delivery-message success">
                ✓ You have FREE delivery
              </div>
            )}

            <div className="summary-divider" />

            {/* TOTAL */}

            <div className="summary-total">

              <span>
                Total Amount
              </span>

              <strong>
                ₹
                {total.toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>

            {/* =====================================
                PROCEED TO CHECKOUT
            ===================================== */}

            <Link
              to="/checkout"
              className="checkout-btn"
            >
              Proceed to Checkout
              <span>→</span>
            </Link>

            {/* BENEFITS */}

            <div className="cart-benefits">

              <div>
                <strong>✓</strong>

                <span>
                  100% Original Products
                </span>
              </div>

              <div>
                <strong>✓</strong>

                <span>
                  Easy 14 days returns
                </span>
              </div>

              <div>
                <strong>✓</strong>

                <span>
                  Secure payments
                </span>
              </div>

            </div>

          </aside>

        </section>
      </div>
    </main>
  );
}

export default Cart;