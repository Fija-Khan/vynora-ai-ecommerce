import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./checkout.css";

function Checkout() {
  const navigate = useNavigate();

  const [cartItems] = useState(() => {
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

  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");

  // =========================
  // IMAGE URL
  // =========================

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

  // =========================
  // FORM CHANGE
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================
  // PRICE CALCULATIONS
  // =========================

  const subtotal = cartItems.reduce(
    (total, item) =>
      total +
      Number(item.price || 0) *
        Number(item.quantity || 1),
    0
  );

  const deliveryCharge =
    subtotal === 0 || subtotal >= 999 ? 0 : 49;

  const total = subtotal + deliveryCharge;

  const totalItems = cartItems.reduce(
    (total, item) =>
      total + Number(item.quantity || 1),
    0
  );

  // =========================
  // PLACE ORDER
  // =========================

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      navigate("/products");
      return;
    }

    if (
      !formData.fullName ||
      !formData.mobile ||
      !formData.address ||
      !formData.city ||
      !formData.state ||
      !formData.pincode
    ) {
      alert("Please fill all delivery details.");
      return;
    }

    // Temporary frontend order
    const order = {
      id: `VYN-${Date.now()}`,
      items: cartItems,
      address: formData,
      paymentMethod,
      subtotal,
      deliveryCharge,
      total,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(
      "vynora_last_order",
      JSON.stringify(order)
    );

    localStorage.removeItem("vynora_cart");

    navigate("/order-success");
  };

  // =========================
  // EMPTY CART
  // =========================

  if (cartItems.length === 0) {
    return (
      <main className="checkout-page">
        <div className="checkout-container">
          <section className="checkout-empty">
            <div className="checkout-empty-icon">
              🛍
            </div>

            <h1>Your cart is empty</h1>

            <p>
              Add some products before proceeding
              to checkout.
            </p>

            <Link
              to="/products"
              className="checkout-shop-btn"
            >
              Shop Products
            </Link>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <div className="checkout-container">

        {/* =========================
            HEADER
        ========================= */}

        <div className="checkout-header">
          <div>
            <span className="checkout-eyebrow">
              VYNORA CHECKOUT
            </span>

            <h1>Checkout</h1>

            <p>
              Complete your details to place your
              order securely.
            </p>
          </div>

          <Link
            to="/cart"
            className="back-cart-btn"
          >
            ← Back to Cart
          </Link>
        </div>

        {/* =========================
            CHECKOUT LAYOUT
        ========================= */}

        <form
          className="checkout-layout"
          onSubmit={handlePlaceOrder}
        >

          {/* =========================
              LEFT SIDE
          ========================= */}

          <div className="checkout-left">

            {/* DELIVERY ADDRESS */}

            <section className="checkout-card">

              <div className="checkout-card-heading">
                <div className="checkout-number">
                  01
                </div>

                <div>
                  <h2>Delivery Address</h2>
                  <p>
                    Where should we deliver your
                    order?
                  </p>
                </div>
              </div>

              <div className="checkout-form-grid">

                <div className="checkout-field full">
                  <label htmlFor="fullName">
                    Full Name
                  </label>

                  <input
                    id="fullName"
                    type="text"
                    name="fullName"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                </div>

                <div className="checkout-field">
                  <label htmlFor="mobile">
                    Mobile Number
                  </label>

                  <input
                    id="mobile"
                    type="tel"
                    name="mobile"
                    placeholder="10 digit mobile number"
                    maxLength="10"
                    value={formData.mobile}
                    onChange={handleChange}
                  />
                </div>

                <div className="checkout-field">
                  <label htmlFor="pincode">
                    Pincode
                  </label>

                  <input
                    id="pincode"
                    type="text"
                    name="pincode"
                    placeholder="Enter pincode"
                    maxLength="6"
                    value={formData.pincode}
                    onChange={handleChange}
                  />
                </div>

                <div className="checkout-field full">
                  <label htmlFor="address">
                    Address
                  </label>

                  <textarea
                    id="address"
                    name="address"
                    rows="3"
                    placeholder="House no., street, area..."
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>

                <div className="checkout-field">
                  <label htmlFor="city">
                    City
                  </label>

                  <input
                    id="city"
                    type="text"
                    name="city"
                    placeholder="Enter city"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>

                <div className="checkout-field">
                  <label htmlFor="state">
                    State
                  </label>

                  <input
                    id="state"
                    type="text"
                    name="state"
                    placeholder="Enter state"
                    value={formData.state}
                    onChange={handleChange}
                  />
                </div>

              </div>
            </section>

            {/* PAYMENT */}

            <section className="checkout-card">

              <div className="checkout-card-heading">
                <div className="checkout-number">
                  02
                </div>

                <div>
                  <h2>Payment Method</h2>
                  <p>
                    Choose your preferred payment
                    method.
                  </p>
                </div>
              </div>

              <div className="payment-options">

                <label
                  className={`payment-option ${
                    paymentMethod === "cod"
                      ? "selected"
                      : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={
                      paymentMethod === "cod"
                    }
                    onChange={(e) =>
                      setPaymentMethod(
                        e.target.value
                      )
                    }
                  />

                  <div className="payment-icon">
                    💵
                  </div>

                  <div className="payment-info">
                    <strong>
                      Cash on Delivery
                    </strong>

                    <span>
                      Pay when your order arrives
                    </span>
                  </div>
                </label>

                <label
                  className={`payment-option ${
                    paymentMethod === "online"
                      ? "selected"
                      : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="online"
                    checked={
                      paymentMethod === "online"
                    }
                    onChange={(e) =>
                      setPaymentMethod(
                        e.target.value
                      )
                    }
                  />

                  <div className="payment-icon">
                    💳
                  </div>

                  <div className="payment-info">
                    <strong>
                      Online Payment
                    </strong>

                    <span>
                      UPI, Cards & Net Banking
                    </span>
                  </div>
                </label>

              </div>
            </section>

            {/* SECURITY */}

            <div className="checkout-security">
              <span>✓</span>

              <p>
                Your information is secure and
                protected with Vynora.
              </p>
            </div>
          </div>

          {/* =========================
              RIGHT SIDE
          ========================= */}

          <aside className="checkout-summary">

            <h2>Order Summary</h2>

            <span className="checkout-item-count">
              {totalItems} item
              {totalItems !== 1 ? "s" : ""}
            </span>

            {/* PRODUCTS */}

            <div className="checkout-products">
              {cartItems.map((item) => {
                const quantity = Number(
                  item.quantity || 1
                );

                const price = Number(
                  item.price || 0
                );

                return (
                  <div
                    className="checkout-product"
                    key={`${item.id}-${
                      item.selectedColor || ""
                    }-${
                      item.selectedSize || ""
                    }`}
                  >
                    <div className="checkout-product-image">
                      <img
                        src={getImageUrl(
                          item.image
                        )}
                        alt={
                          item.name ||
                          "Vynora product"
                        }
                      />
                    </div>

                    <div className="checkout-product-info">
                      <h3>{item.name}</h3>

                      {item.selectedColor && (
                        <span>
                          Color:{" "}
                          {item.selectedColor}
                        </span>
                      )}

                      {item.selectedSize && (
                        <span>
                          Size:{" "}
                          {item.selectedSize}
                        </span>
                      )}

                      <div>
                        <strong>
                          ₹
                          {price.toLocaleString(
                            "en-IN"
                          )}
                        </strong>

                        <small>
                          × {quantity}
                        </small>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* PRICE */}

            <div className="checkout-price-details">

              <div>
                <span>Subtotal</span>

                <strong>
                  ₹
                  {subtotal.toLocaleString(
                    "en-IN"
                  )}
                </strong>
              </div>

              <div>
                <span>Delivery</span>

                <strong
                  className={
                    deliveryCharge === 0
                      ? "checkout-free"
                      : ""
                  }
                >
                  {deliveryCharge === 0
                    ? "FREE"
                    : `₹${deliveryCharge}`}
                </strong>
              </div>

            </div>

            {subtotal > 0 &&
              subtotal < 999 && (
                <div className="checkout-delivery-note">
                  Add ₹
                  {(999 - subtotal).toLocaleString(
                    "en-IN"
                  )}{" "}
                  more for FREE delivery
                </div>
              )}

            {subtotal >= 999 && (
              <div className="checkout-delivery-note success">
                ✓ Free delivery applied
              </div>
            )}

            <div className="checkout-total">
              <span>Total Amount</span>

              <strong>
                ₹
                {total.toLocaleString(
                  "en-IN"
                )}
              </strong>
            </div>

            <button
              type="submit"
              className="place-order-btn"
            >
              Place Order

              <span>→</span>
            </button>

            <div className="checkout-benefits">
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
                  Secure checkout
                </span>
              </div>
            </div>

          </aside>
        </form>
      </div>
    </main>
  );
}

export default Checkout;
