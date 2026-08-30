import { Link } from "react-router-dom";
import "./orders.css";

function Orders() {
  // ========================================
  // LOAD ORDERS
  // ========================================

  let orders = [];

  try {
    const savedOrders = localStorage.getItem("vynora_orders");

    if (savedOrders) {
      const parsedOrders = JSON.parse(savedOrders);
      orders = Array.isArray(parsedOrders) ? parsedOrders : [];
    }
  } catch (error) {
    console.error("Failed to load orders:", error);
    orders = [];
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
      month: "short",
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
  // EMPTY ORDERS
  // ========================================

  if (orders.length === 0) {
    return (
      <main className="orders-page">
        <div className="orders-container">
          <div className="orders-header">
            <div>
              <span className="orders-eyebrow">
                VYNORA ACCOUNT
              </span>

              <h1>My Orders</h1>

              <p>
                Track and manage your Vynora orders
                in one place.
              </p>
            </div>

            <Link
              to="/products"
              className="orders-header-btn"
            >
              Continue Shopping
              <span>→</span>
            </Link>
          </div>

          <section className="orders-empty">
            <div className="orders-empty-icon">
              <span>▣</span>
            </div>

            <span className="orders-empty-label">
              ORDER HISTORY
            </span>

            <h2>No Orders Yet</h2>

            <p>
              You haven't placed any orders yet.
              Discover something you love and your
              orders will appear here.
            </p>

            <Link
              to="/products"
              className="orders-shop-btn"
            >
              Start Shopping
              <span>→</span>
            </Link>
          </section>
        </div>
      </main>
    );
  }

  // ========================================
  // ORDERS LIST
  // ========================================

  return (
    <main className="orders-page">
      <div className="orders-container">

        {/* ========================================
            PAGE HEADER
        ======================================== */}

        <div className="orders-header">
          <div>
            <span className="orders-eyebrow">
              VYNORA ACCOUNT
            </span>

            <h1>My Orders</h1>

            <p>
              Track and manage your Vynora orders
              in one place.
            </p>
          </div>

          <div className="orders-header-right">
            <div className="orders-count-box">
              <strong>{orders.length}</strong>

              <span>
                {orders.length === 1
                  ? "Order"
                  : "Orders"}
              </span>
            </div>

            <Link
              to="/products"
              className="orders-header-btn"
            >
              Continue Shopping
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* ========================================
            ORDERS LIST
        ======================================== */}

        <div className="orders-list">
          {orders.map((order, index) => {
            const orderId =
              order.id ||
              order.order_id ||
              `VN${1000 + index}`;

            const total =
              order.total_amount ??
              order.total ??
              0;

            const status =
              order.status || "pending";

            const paymentStatus =
              order.payment_status ||
              order.paymentStatus ||
              "pending";

            const paymentMethod =
              order.payment_method ||
              order.paymentMethod ||
              "cod";

            const items = Array.isArray(order.items)
              ? order.items
              : [];

            const totalItems = items.reduce(
              (sum, item) =>
                sum + Number(item.quantity || 1),
              0
            );

            return (
              <article
                className="order-card"
                key={`${orderId}-${index}`}
              >

                {/* ========================================
                    ORDER CARD HEADER
                ======================================== */}

                <div className="order-card-top">

                  <div className="order-id-section">
                    <span className="order-label">
                      ORDER ID
                    </span>

                    <h2>
                      #{orderId}
                    </h2>
                  </div>

                  <div className="order-date-section">
                    <span className="order-label">
                      ORDER PLACED
                    </span>

                    <strong>
                      {formatDate(
                        order.created_at ||
                        order.createdAt ||
                        order.date
                      )}
                    </strong>
                  </div>

                </div>

                {/* ========================================
                    ORDER STATUS BAR
                ======================================== */}

                <div className="order-status-bar">

                  <div className="order-status-main">
                    <span className="status-dot"></span>

                    <div>
                      <span>
                        Order Status
                      </span>

                      <strong
                        className={`status-text status-${String(
                          status
                        ).toLowerCase()}`}
                      >
                        {formatStatus(status)}
                      </strong>
                    </div>
                  </div>

                  <div className="payment-status-main">
                    <span>
                      Payment
                    </span>

                    <strong
                      className={`payment-text payment-${String(
                        paymentStatus
                      ).toLowerCase()}`}
                    >
                      {formatStatus(paymentStatus)}
                    </strong>
                  </div>

                </div>

                {/* ========================================
                    ORDER DETAILS
                ======================================== */}

                <div className="order-info">

                  <div className="order-info-item">
                    <span className="order-info-label">
                      Total Amount
                    </span>

                    <strong className="order-total">
                      ₹
                      {Number(total).toLocaleString(
                        "en-IN",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}
                    </strong>
                  </div>

                  <div className="order-info-item">
                    <span className="order-info-label">
                      Payment Method
                    </span>

                    <strong>
                      {paymentMethod === "online"
                        ? "Online Payment"
                        : "Cash on Delivery"}
                    </strong>
                  </div>

                  <div className="order-info-item">
                    <span className="order-info-label">
                      Items
                    </span>

                    <strong>
                      {totalItems}{" "}
                      {totalItems === 1
                        ? "Item"
                        : "Items"}
                    </strong>
                  </div>

                </div>

                {/* ========================================
                    PRODUCTS
                ======================================== */}

                {items.length > 0 && (
                  <div className="order-products">

                    <div className="order-products-heading">
                      <span className="order-info-label">
                        ORDER ITEMS
                      </span>

                      {items.length > 3 && (
                        <span className="more-items">
                          +{items.length - 3} more
                        </span>
                      )}
                    </div>

                    <div className="order-product-list">

                      {items
                        .slice(0, 3)
                        .map((item, itemIndex) => (
                          <div
                            className="order-product"
                            key={
                              item.id ||
                              `${orderId}-${itemIndex}`
                            }
                          >

                            <div className="order-product-icon">
                              <span>▣</span>
                            </div>

                            <div className="order-product-details">

                              <strong>
                                {item.product_name ||
                                  item.name ||
                                  "Vynora Product"}
                              </strong>

                              <span>
                                Qty:{" "}
                                {item.quantity || 1}
                              </span>

                            </div>

                            {item.price && (
                              <strong className="order-product-price">
                                ₹
                                {Number(
                                  item.price
                                ).toLocaleString(
                                  "en-IN"
                                )}
                              </strong>
                            )}

                          </div>
                        ))}

                    </div>
                  </div>
                )}

                {/* ========================================
                    ORDER FOOTER
                ======================================== */}

                <div className="order-card-footer">

                  <div className="order-footer-note">
                    <span>✓</span>

                    <p>
                      Thank you for shopping with Vynora.
                    </p>
                  </div>

                  <Link
                    to={`/orders/${orderId}`}
                    className="view-order-btn"
                  >
                    View Order
                    <span>→</span>
                  </Link>

                </div>

              </article>
            );
          })}
        </div>

        {/* ========================================
            BOTTOM SHOPPING
        ======================================== */}

        <div className="orders-bottom">
          <Link
            to="/products"
            className="continue-shopping-link"
          >
            ← Continue Shopping
          </Link>
        </div>

      </div>
    </main>
  );
}

export default Orders;
