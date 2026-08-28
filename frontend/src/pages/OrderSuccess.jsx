import { Link, useNavigate } from "react-router-dom";
import "./order-success.css";

function OrderSuccess() {
  const navigate = useNavigate();

  const order = JSON.parse(
    localStorage.getItem("vynora_last_order")
  );

  if (!order) {
    return (
      <main className="order-success-page">
        <div className="order-success-container">
          <div className="success-icon">✓</div>

          <h1>No Order Found</h1>

          <p>
            We couldn't find your recent order.
          </p>

          <Link
            to="/products"
            className="success-btn"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="order-success-page">
      <div className="order-success-container">

        <div className="success-icon">
          ✓
        </div>

        <span className="success-eyebrow">
          VYNORA ORDER CONFIRMED
        </span>

        <h1>
          Thank You for Your Order!
        </h1>

        <p className="success-message">
          Your order has been placed successfully.
          We’ll process it and get it ready for delivery.
        </p>

        <div className="order-number">
          <span>Order ID</span>
          <strong>{order.id}</strong>
        </div>

        <div className="success-details">

          <div>
            <span>Items</span>
            <strong>
              {order.items.reduce(
                (total, item) =>
                  total + Number(item.quantity || 1),
                0
              )}
            </strong>
          </div>

          <div>
            <span>Payment</span>
            <strong>
              {order.paymentMethod === "cod"
                ? "Cash on Delivery"
                : "Online Payment"}
            </strong>
          </div>

          <div>
            <span>Total Amount</span>
            <strong>
              ₹{Number(order.total).toLocaleString("en-IN")}
            </strong>
          </div>

        </div>

        <div className="success-address">
          <h3>Delivery Address</h3>

          <p>
            <strong>{order.address.fullName}</strong>
            <br />
            {order.address.address}
            <br />
            {order.address.city},{" "}
            {order.address.state} -{" "}
            {order.address.pincode}
            <br />
            Mobile: {order.address.mobile}
          </p>
        </div>

        <div className="success-actions">

          <button
            type="button"
            className="success-btn"
            onClick={() => navigate("/products")}
          >
            Continue Shopping
            <span>→</span>
          </button>

        </div>

        <p className="success-note">
          Thank you for shopping with Vynora ❤️
        </p>

      </div>
    </main>
  );
}

export default OrderSuccess;
