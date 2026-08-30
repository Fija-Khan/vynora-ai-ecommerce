import { useEffect, useState } from "react";
import axios from "axios";
import "./payments.css";

function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");

        if (!accessToken) {
          setError("Please login to view your payments.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          "http://127.0.0.1:8000/api/payments/",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        setPayments(
          Array.isArray(response.data)
            ? response.data
            : response.data.results || []
        );
      } catch (error) {
        console.error("Failed to fetch payments:", error);

        if (error.response?.status === 401) {
          setError("Your session has expired. Please login again.");
        } else {
          setError("Unable to load payment history.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusClass = (status) => {
    return `payment-status ${status || "pending"}`;
  };

  if (loading) {
    return (
      <main className="payments-page">
        <div className="payments-container">
          <div className="payments-loading">
            Loading payment history...
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="payments-page">
      <div className="payments-container">

        <div className="payments-header">
          <div>
            <span className="payments-eyebrow">
              VYNORA PAYMENTS
            </span>

            <h1>Payment History</h1>

            <p>
              View your payment transactions and
              payment status in one place.
            </p>
          </div>
        </div>

        {error && (
          <div className="payments-error">
            <span>!</span>
            <p>{error}</p>
          </div>
        )}

        {!error && payments.length === 0 && (
          <section className="payments-empty">
            <div className="payments-empty-icon">
              ₹
            </div>

            <h2>No Payments Yet</h2>

            <p>
              Your payment transactions will appear here
              after you place an order.
            </p>
          </section>
        )}

        {!error && payments.length > 0 && (
          <section className="payments-list">
            {payments.map((payment) => (
              <article
                className="payment-card"
                key={payment.id}
              >
                <div className="payment-main">

                  <div className="payment-icon">
                    ₹
                  </div>

                  <div className="payment-info">
                    <span className="payment-label">
                      Payment #{payment.id}
                    </span>

                    <h2>
                      ₹
                      {Number(
                        payment.amount || payment.order_total || 0
                      ).toLocaleString("en-IN")}
                    </h2>

                    <p>
                      Order #{payment.order}
                    </p>
                  </div>

                </div>

                <div className="payment-meta">

                  <div>
                    <span>Payment Method</span>
                    <strong>
                      {payment.payment_method
                        ? payment.payment_method.toUpperCase()
                        : "—"}
                    </strong>
                  </div>

                  <div>
                    <span>Transaction ID</span>
                    <strong>
                      {payment.transaction_id || "Pending"}
                    </strong>
                  </div>

                  <div>
                    <span>Date</span>
                    <strong>
                      {formatDate(payment.created_at)}
                    </strong>
                  </div>

                  <div>
                    <span>Status</span>
                    <strong className={getStatusClass(payment.status)}>
                      {payment.status || "Pending"}
                    </strong>
                  </div>

                </div>
              </article>
            ))}
          </section>
        )}

      </div>
    </main>
  );
}

export default Payments;
