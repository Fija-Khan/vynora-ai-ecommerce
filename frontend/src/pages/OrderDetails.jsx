import { Link, useNavigate, useParams } from "react-router-dom";

import "./order-details.css";

function OrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  // ========================================
  // LOAD ORDER
  // ========================================

  let order = null;

  try {
    const savedOrders = localStorage.getItem("vynora_orders");

    if (savedOrders) {
      const orders = JSON.parse(savedOrders);

      if (Array.isArray(orders)) {
        order = orders.find(
          (item) =>
            String(item.id || item.order_id) === String(orderId)
        );
      }
    }
  } catch (error) {
    console.error("Failed to load order:", error);
  }

  // ========================================
  // FORMAT DATE
  // ========================================

  const formatDate = (date) => {
    if (!date) return "Recently";

    const formattedDate = new Date(date);

    if (Number.isNaN(formattedDate.getTime())) {
      return "Recently";
    }

    return formattedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // ========================================
  // FORMAT STATUS
  // ========================================

  const formatStatus = (status) => {
    if (!status) return "Pending";

    return String(status)
      .replaceAll("_", " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  // ========================================
  // PAYMENT METHOD
  // ========================================

  const getPaymentMethod = () => {
    const method =
      order.payment_method ||
      order.paymentMethod ||
      "cod";

    return method === "online"
      ? "Online Payment"
      : "Cash on Delivery";
  };

  // ========================================
  // ORDER NOT FOUND
  // ========================================

  if (!order) {
    return (
      <main className="order-details-page">
        <div className="order-details-container">
          <section className="order-details-empty">
            <div className="order-details-empty-icon">
              !
            </div>

            <span className="order-details-eyebrow">
              VYNORA ORDERS
            </span>

            <h1>Order Not Found</h1>

            <p>
              We couldn't find the order you're looking
              for. It may have been removed or is no
              longer available.
            </p>

            <div className="order-details-empty-actions">
              <button
                type="button"
                className="order-details-primary-btn"
                onClick={() => navigate("/orders")}
              >
                Back to Orders
              </button>

              <Link
                to="/products"
                className="order-details-secondary-btn"
              >
                Continue Shopping
              </Link>
            </div>
          </section>
        </div>
      </main>
    );
  }

  // ========================================
  // ORDER DATA
  // ========================================

  const id = order.id || order.order_id || orderId;

  const items = Array.isArray(order.items)
    ? order.items
    : [];

  const status = order.status || "pending";

  const paymentStatus =
    order.payment_status ||
    order.paymentStatus ||
    "pending";

  const paymentMethod = getPaymentMethod();

  const totalAmount =
    order.total_amount ??
    order.total ??
    0;

  const subtotal =
    order.subtotal ??
    totalAmount;

  const deliveryCharge =
    order.delivery_charge ??
    order.deliveryCharge ??
    0;

  const totalItems = items.reduce(
    (total, item) =>
      total + Number(item.quantity || 1),
    0
  );

  const fullName =
    order.full_name ||
    order.fullName ||
    order.address?.fullName ||
    "";

  const mobile =
    order.mobile ||
    order.address?.mobile ||
    "";

  const address =
    order.shipping_address ||
    order.address?.address ||
    "";

  const city =
    order.city ||
    order.address?.city ||
    "";

  const state =
    order.state ||
    order.address?.state ||
    "";

  const pincode =
    order.pincode ||
    order.address?.pincode ||
    "";

  // ========================================
  // PAGE
  // ========================================

  return (
    <main className="order-details-page">
      <div className="order-details-container">

        {/* ========================================
            HEADER
        ======================================== */}

        <div className="order-details-header">

          <div>
            <span className="order-details-eyebrow">
              VYNORA ORDER DETAILS
            </span>

            <h1>Order #{id}</h1>

            <p>
              Placed on{" "}
              {formatDate(
                order.created_at ||
                order.createdAt ||
                order.date
              )}
            </p>
          </div>

          <Link
            to="/orders"
            className="order-details-back-btn"
          >
            ← Back to Orders
          </Link>

        </div>

        {/* ========================================
            STATUS
        ======================================== */}

        <section className="order-details-status-card">

          <div className="order-details-status-icon">
            ✓
          </div>

          <div className="order-details-status-content">
            <span>ORDER STATUS</span>

            <h2>
              {formatStatus(status)}
            </h2>

            <p>
              Your order is currently{" "}
              {String(status).toLowerCase()}.
            </p>
          </div>

          <div className="order-details-payment-status">
            <span>PAYMENT</span>

            <strong
              className={`payment-status-${String(
                paymentStatus
              ).toLowerCase()}`}
            >
              {formatStatus(paymentStatus)}
            </strong>
          </div>

        </section>

        {/* ========================================
            MAIN GRID
        ======================================== */}

        <div className="order-details-grid">

          {/* ========================================
              LEFT
          ======================================== */}

          <div className="order-details-left">

            {/* ========================================
                ORDER ITEMS
            ======================================== */}

            <section className="order-details-card">

              <div className="order-details-card-heading">

                <div className="order-details-number">
                  01
                </div>

                <div>
                  <h2>Order Items</h2>

                  <p>
                    {totalItems}{" "}
                    {totalItems === 1
                      ? "item"
                      : "items"}{" "}
                    in this order.
                  </p>
                </div>

              </div>

              <div className="order-details-items">

                {items.length === 0 ? (
                  <div className="order-details-no-items">
                    No item information available.
                  </div>
                ) : (
                  items.map((item, index) => {

                    const quantity = Number(
                      item.quantity || 1
                    );

                    const price = Number(
                      item.price || 0
                    );

                    const productName =
                      item.product_name ||
                      item.name ||
                      "Vynora Product";

                    return (
                      <div
                        className="order-details-item"
                        key={
                          item.id ||
                          `${id}-${index}`
                        }
                      >

                        <div className="order-details-product-icon">
                          ▣
                        </div>

                        <div className="order-details-item-info">

                          <h3>
                            {productName}
                          </h3>

                          <span>
                            Quantity: {quantity}
                          </span>

                        </div>

                        <div className="order-details-item-price">

                          <span>
                            ₹
                            {price.toLocaleString(
                              "en-IN",
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            )}
                          </span>

                          <small>
                            ₹
                            {(
                              price * quantity
                            ).toLocaleString(
                              "en-IN",
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            )}
                          </small>

                        </div>

                      </div>
                    );
                  })
                )}

              </div>

            </section>

            {/* ========================================
                DELIVERY ADDRESS
            ======================================== */}

            <section className="order-details-card">

              <div className="order-details-card-heading">

                <div className="order-details-number">
                  02
                </div>

                <div>
                  <h2>Delivery Address</h2>

                  <p>
                    Your order will be delivered to
                    this address.
                  </p>
                </div>

              </div>

              <div className="order-details-address">

                <strong>
                  {fullName || "Customer"}
                </strong>

                <p>
                  {address || "Address not available"}
                  <br />

                  {city && `${city}, `}
                  {state}
                  {pincode && ` - ${pincode}`}

                  {mobile && (
                    <>
                      <br />
                      Mobile: {mobile}
                    </>
                  )}
                </p>

              </div>

            </section>

            {/* ========================================
                PAYMENT
            ======================================== */}

            <section className="order-details-card">

              <div className="order-details-card-heading">

                <div className="order-details-number">
                  03
                </div>

                <div>
                  <h2>Payment Information</h2>

                  <p>
                    Payment details for this order.
                  </p>
                </div>

              </div>

              <div className="order-details-payment-box">

                <div>
                  <span>Payment Method</span>

                  <strong>
                    {paymentMethod}
                  </strong>
                </div>

                <div>
                  <span>Payment Status</span>

                  <strong>
                    {formatStatus(paymentStatus)}
                  </strong>
                </div>

              </div>

            </section>

          </div>

          {/* ========================================
              RIGHT — SUMMARY
          ======================================== */}

          <aside className="order-details-summary">

            <div className="order-details-summary-heading">
              <h2>Order Summary</h2>

              <span>
                #{id}
              </span>
            </div>

            <div className="order-details-price">

              <div>
                <span>Subtotal</span>

                <strong>
                  ₹
                  {Number(subtotal).toLocaleString(
                    "en-IN",
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}
                </strong>
              </div>

              <div>
                <span>Delivery</span>

                <strong
                  className={
                    Number(deliveryCharge) === 0
                      ? "free"
                      : ""
                  }
                >
                  {Number(deliveryCharge) === 0
                    ? "FREE"
                    : `₹${Number(
                        deliveryCharge
                      ).toLocaleString("en-IN")}`}
                </strong>
              </div>

            </div>

            <div className="order-details-total">

              <span>Total Amount</span>

              <strong>
                ₹
                {Number(totalAmount).toLocaleString(
                  "en-IN",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}
              </strong>

            </div>

            <div className="order-details-summary-actions">

              <Link
                to="/orders"
                className="order-details-orders-btn"
              >
                View All Orders
              </Link>

              <Link
                to="/products"
                className="order-details-shop-btn"
              >
                Continue Shopping
                <span>→</span>
              </Link>

            </div>

            <div className="order-details-security">
              <strong>✓ Secure Order</strong>

              <p>
                Your order information is safely
                stored with Vynora.
              </p>
            </div>

          </aside>

        </div>

      </div>
    </main>
  );
}

export default OrderDetails;
