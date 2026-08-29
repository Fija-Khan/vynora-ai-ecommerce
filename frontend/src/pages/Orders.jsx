import { Link } from "react-router-dom";
import "./orders.css";

function Orders() {
  // ========================================
  // LOAD ORDERS
  // Backend API integration will be connected later
  // ========================================

  let orders = [];

  try {
    orders = JSON.parse(
      localStorage.getItem("vynora_orders") || "[]"
    );
  } catch (error) {
    orders = [];
  }

  // ========================================
  // FORMAT DATE
  // ========================================

  const formatDate = (date) => {
    if (!date) return "Recently";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ========================================
  // EMPTY ORDERS
  // ========================================

  if (orders.length === 0) {
    return (
      <div className="orders-page">

        <div className="orders-container">

          <div className="orders-header">
            <h1>My Orders</h1>
            <p>
              Track and manage your Vynora orders
            </p>
          </div>

          <div className="orders-empty">

            <div className="orders-empty-icon">
              📦
            </div>

            <h2>No Orders Yet</h2>

            <p>
              You haven't placed any orders yet.
              Start shopping and your orders will
              appear here.
            </p>

            <Link
              to="/products"
              className="orders-shop-btn"
            >
              Continue Shopping
            </Link>

          </div>

        </div>

      </div>
    );
  }

  // ========================================
  // ORDERS LIST
  // ========================================

  return (
    <div className="orders-page">

      <div className="orders-container">

        {/* ========================================
            PAGE HEADER
        ======================================== */}

        <div className="orders-header">

          <div>
            <h1>My Orders</h1>

            <p>
              Track and manage your Vynora orders
            </p>
          </div>

          <span className="orders-count">
            {orders.length}{" "}
            {orders.length === 1
              ? "Order"
              : "Orders"}
          </span>

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
              order.total_amount ||
              order.total ||
              0;

            const status =
              order.status || "pending";

            const paymentStatus =
              order.payment_status ||
              "pending";

            const items =
              order.items || [];

            return (
              <div
                className="order-card"
                key={orderId}
              >

                {/* ========================================
                    ORDER TOP
                ======================================== */}

                <div className="order-card-top">

                  <div>

                    <span className="order-label">
                      Order ID
                    </span>

                    <h2>
                      #{orderId}
                    </h2>

                  </div>

                  <span className="order-date">
                    {formatDate(
                      order.created_at ||
                      order.date
                    )}
                  </span>

                </div>


                {/* ========================================
                    ORDER INFO
                ======================================== */}

                <div className="order-info">

                  <div className="order-info-item">

                    <span className="order-info-label">
                      Total Amount
                    </span>

                    <strong>
                      ₹
                      {Number(total).toLocaleString(
                        "en-IN",
                        {
                          minimumFractionDigits: 2,
                        }
                      )}
                    </strong>

                  </div>


                  <div className="order-info-item">

                    <span className="order-info-label">
                      Payment
                    </span>

                    <span
                      className={`order-status payment-${paymentStatus}`}
                    >
                      {paymentStatus}
                    </span>

                  </div>


                  <div className="order-info-item">

                    <span className="order-info-label">
                      Order Status
                    </span>

                    <span
                      className={`order-status status-${status}`}
                    >
                      {status}
                    </span>

                  </div>

                </div>


                {/* ========================================
                    PRODUCTS
                ======================================== */}

                {items.length > 0 && (
                  <div className="order-products">

                    <span className="order-info-label">
                      Items
                    </span>

                    <div className="order-product-list">

                      {items
                        .slice(0, 3)
                        .map((item, itemIndex) => (

                          <div
                            className="order-product"
                            key={
                              item.id ||
                              itemIndex
                            }
                          >

                            <span className="order-product-icon">
                              🛍️
                            </span>

                            <div>
                              <strong>
                                {item.product_name ||
                                  item.name ||
                                  "Product"}
                              </strong>

                              <span>
                                Qty:{" "}
                                {item.quantity || 1}
                              </span>
                            </div>

                          </div>

                        ))}

                    </div>

                    {items.length > 3 && (
                      <span className="more-items">
                        +{items.length - 3} more items
                      </span>
                    )}

                  </div>
                )}


                {/* ========================================
                    ORDER FOOTER
                ======================================== */}

                <div className="order-card-footer">

                  <Link
                    to={`/orders/${orderId}`}
                    className="view-order-btn"
                  >
                    View Order
                    <span>→</span>
                  </Link>

                </div>

              </div>
            );
          })}

        </div>


        {/* ========================================
            CONTINUE SHOPPING
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

    </div>
  );
}

export default Orders;
