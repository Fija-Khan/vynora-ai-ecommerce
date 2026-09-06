import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import "./track-order.css";

function TrackOrder() {
  const { id: orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const accessToken = localStorage.getItem("vynora_access_token");

        if (!accessToken) {
          setError("Please login to track your order.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `http://127.0.0.1:8000/api/orders/${orderId}/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("TRACK ORDER RESPONSE:", response.data);

        setOrder(response.data);
      } catch (err) {
        console.error("TRACK ORDER ERROR:", err);

        setError(
          err.response?.data?.detail ||
            "We couldn't load your order tracking details."
        );
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const steps = [
    {
      key: "pending",
      title: "Order Placed",
      description: "Your order has been placed successfully.",
    },
    {
      key: "confirmed",
      title: "Order Confirmed",
      description: "Your order has been confirmed.",
    },
    {
      key: "shipped",
      title: "Shipped",
      description: "Your order has been shipped.",
    },
    {
      key: "delivered",
      title: "Delivered",
      description: "Your order has been delivered.",
    },
  ];

  const statusOrder = [
    "pending",
    "confirmed",
    "shipped",
    "delivered",
  ];

  const getStepStatus = (stepKey) => {
    if (!order) return "upcoming";

    if (order.status === "cancelled") {
      return stepKey === "pending" ? "completed" : "upcoming";
    }

    const currentIndex = statusOrder.indexOf(order.status);
    const stepIndex = statusOrder.indexOf(stepKey);

    if (stepIndex < currentIndex) {
      return "completed";
    }

    if (stepIndex === currentIndex) {
      return "active";
    }

    return "upcoming";
  };

  if (loading) {
    return (
      <div className="track-page">
        <div className="track-loading">
          <div className="spinner-border" role="status"></div>
          <p>Loading order tracking...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="track-page">
        <div className="track-error">
          <h2>Unable to Track Order</h2>
          <p>{error}</p>

          <Link to="/orders" className="track-back-btn">
            ← Back to My Orders
          </Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="track-page">
      <div className="track-container">

        <div className="track-header">
          <div>
            <p className="track-label">ORDER TRACKING</p>
            <h1>Track Your Order</h1>
            <p>
              Order #{order.id}
            </p>
          </div>

          <Link to={`/orders/${order.id}`} className="back-order-btn">
            ← Order Details
          </Link>
        </div>

        {order.status === "cancelled" ? (
          <div className="cancelled-box">
            <div className="status-icon">×</div>

            <div>
              <h3>Order Cancelled</h3>
              <p>
                This order has been cancelled and will not be delivered.
              </p>
            </div>
          </div>
        ) : (
          <div className="tracking-card">
            <div className="tracking-title">
              <h2>Delivery Status</h2>

              <span className={`status-badge ${order.status}`}>
                {order.status}
              </span>
            </div>

            <div className="tracking-timeline">
              {steps.map((step, index) => {
                const stepStatus = getStepStatus(step.key);

                return (
                  <div
                    className={`tracking-step ${stepStatus}`}
                    key={step.key}
                  >
                    <div className="step-left">
                      <div className="step-circle">
                        {stepStatus === "completed"
                          ? "✓"
                          : stepStatus === "active"
                          ? "●"
                          : index + 1}
                      </div>

                      {index !== steps.length - 1 && (
                        <div className="step-line"></div>
                      )}
                    </div>

                    <div className="step-content">
                      <h3>{step.title}</h3>
                      <p>{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="tracking-info">

          <div className="info-card">
            <h3>Delivery Address</h3>

            <p className="customer-name">
              {order.full_name}
            </p>

            <p>
              {order.shipping_address}
            </p>

            <p>
              {order.city}, {order.state} - {order.pincode}
            </p>

            <p>
              Mobile: {order.mobile}
            </p>
          </div>

          <div className="info-card">
            <h3>Order Information</h3>

            <div className="info-row">
              <span>Order ID</span>
              <strong>#{order.id}</strong>
            </div>

            <div className="info-row">
              <span>Payment Method</span>
              <strong>
                {order.payment_method === "cod"
                  ? "Cash on Delivery"
                  : "Online Payment"}
              </strong>
            </div>

            <div className="info-row">
              <span>Payment Status</span>
              <strong>{order.payment_status}</strong>
            </div>

            <div className="info-row">
              <span>Total Amount</span>
              <strong>₹{order.total_amount}</strong>
            </div>
          </div>

        </div>

        <div className="track-actions">
          <Link to="/orders" className="all-orders-btn">
            View All Orders
          </Link>

          <Link to="/products" className="shopping-btn">
            Continue Shopping
          </Link>
        </div>

      </div>
    </div>
  );
}

export default TrackOrder;