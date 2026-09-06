import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import "./orders.css";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ========================================
  // LOAD ORDERS FROM BACKEND
  // ========================================

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const accessToken = localStorage.getItem(
          "vynora_access_token"
        );

        // ----------------------------------------
        // LOGIN CHECK
        // ----------------------------------------

        if (!accessToken) {
          setError("Please login to view your orders.");
          setLoading(false);
          return;
        }

        // ----------------------------------------
        // GET ORDERS FROM BACKEND
        // ----------------------------------------

        const response = await axios.get(
          "http://127.0.0.1:8000/api/orders/",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log(
          "MY ORDERS RESPONSE:",
          response.data
        );

        // ----------------------------------------
        // HANDLE RESPONSE
        // ----------------------------------------

        let backendOrders = [];

        if (Array.isArray(response.data)) {
          backendOrders = response.data;
        } else if (
          Array.isArray(response.data.results)
        ) {
          backendOrders = response.data.results;
        } else if (
          Array.isArray(response.data.orders)
        ) {
          backendOrders = response.data.orders;
        }

        setOrders(backendOrders);

        // ----------------------------------------
        // SYNC LOCAL STORAGE
        // ----------------------------------------

        try {
          localStorage.setItem(
            "vynora_orders",
            JSON.stringify(backendOrders)
          );
        } catch (storageError) {
          console.error(
            "Failed to save orders to localStorage:",
            storageError
          );
        }
      } catch (error) {
        console.error(
          "Failed to fetch orders:",
          error
        );

        // ----------------------------------------
        // BACKEND ERROR
        // ----------------------------------------

        if (error.response) {
          console.error(
            "Backend status:",
            error.response.status
          );

          console.error(
            "Backend response:",
            error.response.data
          );

          if (error.response.status === 401) {
            setError(
              "Your login session is invalid or expired. Please login again."
            );
            return;
          }

          if (error.response.status === 404) {
            setError(
              "Orders API was not found. Please check your Django URL configuration."
            );
            return;
          }

          setError(
            "Unable to load your orders. Please try again."
          );

          return;
        }

        // ----------------------------------------
        // SERVER NOT RESPONDING
        // ----------------------------------------

        if (error.request) {
          setError(
            "Backend server is not responding. Please start the Django server."
          );
          return;
        }

        setError(
          "Something went wrong while loading your orders."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

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
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  };

  // ========================================
  // LOADING STATE
  // ========================================

  if (loading) {
    return (
      <main className="orders-page">
        <div className="orders-container">
          <section className="orders-empty">
            <div className="orders-empty-icon">
              <span>▣</span>
            </div>

            <span className="orders-empty-label">
              VYNORA ACCOUNT
            </span>

            <h2>Loading Orders...</h2>

            <p>
              Please wait while we load your order
              history.
            </p>
          </section>
        </div>
      </main>
    );
  }

  // ========================================
  // ERROR STATE
  // ========================================

  if (error) {
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
              <span>!</span>
            </div>

            <span className="orders-empty-label">
              ORDER HISTORY
            </span>

            <h2>Unable to Load Orders</h2>

            <p>{error}</p>

            <Link
              to="/products"
              className="orders-shop-btn"
            >
              Continue Shopping
              <span>→</span>
            </Link>
          </section>
        </div>
      </main>
    );
  }

  // ========================================
  // EMPTY ORDERS
  // ========================================

  if (orders.length === 0) {
    return (
      <main className="orders-page">
        <div className="orders-container">

          {/* PAGE HEADER */}

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

          {/* EMPTY STATE */}

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

            // ----------------------------------------
            // REAL BACKEND ORDER ID
            // ----------------------------------------

            const orderId =
              order.id ||
              order.order_id;

            // ----------------------------------------
            // SAFETY CHECK
            // ----------------------------------------

            if (!orderId) {
              console.warn(
                "Order skipped because ID is missing:",
                order
              );

              return null;
            }

            // ----------------------------------------
            // ORDER DATA
            // ----------------------------------------

            const total =
              order.total_amount ??
              order.total ??
              0;

            const status =
              order.status || "pending";

            const paymentStatus =
              order.payment_status ||
              order.paymentStatus ||
              order.payment?.status ||
              "pending";

            const paymentMethod =
              order.payment_method ||
              order.paymentMethod ||
              order.payment?.payment_method ||
              "cod";

            const items =
              Array.isArray(order.items)
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
                key={orderId}
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
                      {formatStatus(
                        paymentStatus
                      )}
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
                        .map(
                          (
                            item,
                            itemIndex
                          ) => (

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
                                  {item.quantity ||
                                    1}
                                </span>

                              </div>

                              {item.price != null && (

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

                          )
                        )}

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
                      Thank you for shopping with
                      Vynora.
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