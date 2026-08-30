import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./checkout.css";

function Checkout() {
  const navigate = useNavigate();

  // =========================================
  // LOAD CART
  // =========================================
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

  // =========================================
  // FORM DATA
  // =========================================
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
  // FORM CHANGE
  // =========================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
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
    subtotal === 0 || subtotal >= 999 ? 0 : 49;

  const total = subtotal + deliveryCharge;

  const totalItems = cartItems.reduce(
    (total, item) =>
      total + Number(item.quantity || 1),
    0
  );

  // =========================================
  // PLACE ORDER
  // BACKEND API
  // =========================================
  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    setError("");

    // -----------------------------------------
    // EMPTY CART
    // -----------------------------------------
    if (cartItems.length === 0) {
      navigate("/products");
      return;
    }

    // -----------------------------------------
    // CLEAN FORM VALUES
    // -----------------------------------------
    const fullName = formData.fullName.trim();
    const mobile = formData.mobile.trim();
    const address = formData.address.trim();
    const city = formData.city.trim();
    const state = formData.state.trim();
    const pincode = formData.pincode.trim();

    // -----------------------------------------
    // REQUIRED FIELDS
    // -----------------------------------------
    if (
      !fullName ||
      !mobile ||
      !address ||
      !city ||
      !state ||
      !pincode
    ) {
      setError(
        "Please complete all delivery details."
      );
      return;
    }

    // -----------------------------------------
    // MOBILE VALIDATION
    // -----------------------------------------
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setError(
        "Please enter a valid 10-digit mobile number."
      );
      return;
    }

    // -----------------------------------------
    // PINCODE VALIDATION
    // -----------------------------------------
    if (!/^\d{6}$/.test(pincode)) {
      setError(
        "Please enter a valid 6-digit pincode."
      );
      return;
    }

    try {
      setLoading(true);

      // =========================================
      // GET AUTH TOKEN
      // =========================================
      const accessToken =
        localStorage.getItem("access_token");

      // =========================================
      // PREPARE ORDER DATA
      // =========================================
      const orderData = {
        items: cartItems.map((item) => ({
          product:
            item.product ||
            item.product_id ||
            item.id,

          quantity: Number(item.quantity || 1),

          price: Number(item.price || 0),

          selected_color:
            item.selectedColor || "",

          selected_size:
            item.selectedSize || "",
        })),

        full_name: fullName,
        mobile: mobile,
        address: address,
        city: city,
        state: state,
        pincode: pincode,

        payment_method: paymentMethod,

        subtotal: subtotal,
        delivery_charge: deliveryCharge,
        total_amount: total,
      };

      // =========================================
      // API CONFIG
      // =========================================
      const config = {};

      if (accessToken) {
        config.headers = {
          Authorization: `Bearer ${accessToken}`,
        };
      }

      // =========================================
      // CREATE ORDER
      // =========================================
      const response = await axios.post(
        "http://127.0.0.1:8000/api/orders/",
        orderData,
        config
      );

      console.log(
        "Order created successfully:",
        response.data
      );

      // =========================================
      // SAVE LAST ORDER
      // =========================================
      localStorage.setItem(
        "vynora_last_order",
        JSON.stringify(response.data)
      );

      // =========================================
      // SAVE ORDER FOR ORDERS PAGE
      // =========================================
      const existingOrders = JSON.parse(
        localStorage.getItem("vynora_orders") || "[]"
      );

      const updatedOrders = [
        response.data,
        ...existingOrders,
      ];

      localStorage.setItem(
        "vynora_orders",
        JSON.stringify(updatedOrders)
      );

      // =========================================
      // CLEAR CART
      // =========================================
      localStorage.removeItem("vynora_cart");

      // =========================================
      // SUCCESS PAGE
      // =========================================
      navigate("/order-success");
    } catch (error) {
      console.error(
        "Order creation failed:",
        error
      );

      // -----------------------------------------
      // BACKEND ERROR
      // -----------------------------------------
      if (error.response) {
        console.error(
          "Backend response:",
          error.response.data
        );

        if (error.response.status === 401) {
          setError(
            "Please login before placing an order."
          );
          return;
        }

        if (error.response.data) {
          const backendError =
            error.response.data.detail ||
            error.response.data.message;

          if (backendError) {
            setError(backendError);
            return;
          }
        }

        setError(
          "Unable to place order. Please check your details."
        );
      } else if (error.request) {
        setError(
          "Backend server is not responding. Please start Django server."
        );
      } else {
        setError(
          "Something went wrong. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // EMPTY CART
  // =========================================
  if (cartItems.length === 0) {
    return (
      <main className="checkout-page">
        <div className="checkout-container">
          <section className="checkout-empty">
            <div className="checkout-empty-icon">
              🛍
            </div>

            <span className="checkout-eyebrow">
              VYNORA CHECKOUT
            </span>

            <h1>Your Cart is Empty</h1>

            <p>
              There are no products in your cart.
              Add something you love and come back
              to checkout.
            </p>

            <Link
              to="/products"
              className="checkout-shop-btn"
            >
              Continue Shopping
              <span>→</span>
            </Link>
          </section>
        </div>
      </main>
    );
  }

  // =========================================
  // CHECKOUT PAGE
  // =========================================
  return (
    <main className="checkout-page">
      <div className="checkout-container">

        {/* =========================================
            HEADER
        ========================================= */}

        <div className="checkout-header">
          <div>
            <span className="checkout-eyebrow">
              VYNORA CHECKOUT
            </span>

            <h1>Complete Your Order</h1>

            <p>
              Enter your delivery details and choose
              your preferred payment method.
            </p>
          </div>

          <Link
            to="/cart"
            className="back-cart-btn"
          >
            ← Back to Cart
          </Link>
        </div>

        {/* =========================================
            ERROR MESSAGE
        ========================================= */}

        {error && (
          <div className="checkout-error">
            <span>!</span>
            <p>{error}</p>
          </div>
        )}

        {/* =========================================
            CHECKOUT LAYOUT
        ========================================= */}

        <form
          className="checkout-layout"
          onSubmit={handlePlaceOrder}
        >

          {/* =========================================
              LEFT SIDE
          ========================================= */}

          <div className="checkout-left">

            {/* =========================================
                DELIVERY ADDRESS
            ========================================= */}

            <section className="checkout-card">

              <div className="checkout-card-heading">
                <div className="checkout-number">
                  01
                </div>

                <div>
                  <h2>Delivery Address</h2>

                  <p>
                    Enter the address where you want
                    your order delivered.
                  </p>
                </div>
              </div>

              <div className="checkout-form-grid">

                {/* FULL NAME */}

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
                    autoComplete="name"
                    disabled={loading}
                  />
                </div>

                {/* MOBILE */}

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
                    autoComplete="tel"
                    disabled={loading}
                  />
                </div>

                {/* PINCODE */}

                <div className="checkout-field">
                  <label htmlFor="pincode">
                    Pincode
                  </label>

                  <input
                    id="pincode"
                    type="text"
                    name="pincode"
                    placeholder="6 digit pincode"
                    maxLength="6"
                    value={formData.pincode}
                    onChange={handleChange}
                    inputMode="numeric"
                    autoComplete="postal-code"
                    disabled={loading}
                  />
                </div>

                {/* ADDRESS */}

                <div className="checkout-field full">
                  <label htmlFor="address">
                    Address
                  </label>

                  <textarea
                    id="address"
                    name="address"
                    rows="4"
                    placeholder="House no., street, area, landmark..."
                    value={formData.address}
                    onChange={handleChange}
                    autoComplete="street-address"
                    disabled={loading}
                  />
                </div>

                {/* CITY */}

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
                    autoComplete="address-level2"
                    disabled={loading}
                  />
                </div>

                {/* STATE */}

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
                    autoComplete="address-level1"
                    disabled={loading}
                  />
                </div>

              </div>
            </section>

            {/* =========================================
                PAYMENT
            ========================================= */}

            <section className="checkout-card">

              <div className="checkout-card-heading">
                <div className="checkout-number">
                  02
                </div>

                <div>
                  <h2>Payment Method</h2>

                  <p>
                    Select how you would like to pay
                    for your order.
                  </p>
                </div>
              </div>

              <div className="payment-options">

                {/* COD */}

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
                    disabled={loading}
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

                  <div className="payment-check">
                    ✓
                  </div>
                </label>

                {/* ONLINE */}

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
                    disabled={loading}
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

                  <div className="payment-check">
                    ✓
                  </div>
                </label>

              </div>
            </section>

            {/* =========================================
                SECURITY
            ========================================= */}

            <div className="checkout-security">

              <div className="security-icon">
                ✓
              </div>

              <div>
                <strong>Secure Checkout</strong>

                <p>
                  Your information is protected and
                  securely handled by Vynora.
                </p>
              </div>

            </div>

          </div>

          {/* =========================================
              RIGHT SIDE
          ========================================= */}

          <aside className="checkout-summary">

            <div className="summary-heading">
              <div>
                <h2>Order Summary</h2>

                <span>
                  {totalItems} item
                  {totalItems !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

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
                        src={getImageUrl(item.image)}
                        alt={
                          item.name ||
                          "Vynora product"
                        }
                      />

                      <span className="product-quantity">
                        {quantity}
                      </span>

                    </div>

                    <div className="checkout-product-info">

                      <h3>
                        {item.name}
                      </h3>

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

                      <strong>
                        ₹
                        {price.toLocaleString(
                          "en-IN"
                        )}
                      </strong>

                    </div>
                  </div>
                );
              })}

            </div>

            {/* PRICE DETAILS */}

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

            {/* DELIVERY NOTE */}

            {subtotal > 0 &&
              subtotal < 999 && (
                <div className="checkout-delivery-note">
                  Add ₹
                  {(999 - subtotal).toLocaleString(
                    "en-IN"
                  )}{" "}
                  more to unlock FREE delivery.
                </div>
              )}

            {subtotal >= 999 && (
              <div className="checkout-delivery-note success">
                ✓ Free delivery unlocked
              </div>
            )}

            {/* TOTAL */}

            <div className="checkout-total">
              <span>Total Amount</span>

              <strong>
                ₹
                {total.toLocaleString(
                  "en-IN"
                )}
              </strong>
            </div>

            {/* PLACE ORDER */}

            <button
              type="submit"
              className="place-order-btn"
              disabled={loading}
            >
              {loading
                ? "Placing Order..."
                : "Place Order"}

              {!loading && (
                <span>→</span>
              )}
            </button>

            {/* BENEFITS */}

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