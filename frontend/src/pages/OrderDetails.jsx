import { useEffect, useState } from "react";

import { Link, useNavigate, useParams } from "react-router-dom";

import axios from "axios";

import "./order-details.css";

function OrderDetails() {
  const { id: orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [cancelling, setCancelling] = useState(false);

  // Return Order states
  const [returning, setReturning] = useState(false);
  const [returnReason, setReturnReason] = useState("");
  const [showReturnForm, setShowReturnForm] = useState(false);

  // Reorder state
  const [reordering, setReordering] = useState(false);

  // Review states
  const [reviewing, setReviewing] = useState(false);
  const [reviewProductId, setReviewProductId] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState({});

  // ========================================
  // LOAD ORDER FROM BACKEND
  // ========================================

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError("");

        const accessToken = localStorage.getItem(
          "vynora_access_token",
        );

        if (!accessToken) {
          setError("Please login to view your order.");
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
          },
        );

        console.log(
          "ORDER DETAILS RESPONSE:",
          response.data,
        );

        setOrder(response.data);

        // Keep localStorage synchronized
        try {
          const savedOrders =
            localStorage.getItem("vynora_orders");

          let existingOrders = [];

          if (savedOrders) {
            const parsedOrders =
              JSON.parse(savedOrders);

            if (Array.isArray(parsedOrders)) {
              existingOrders = parsedOrders;
            }
          }

          const updatedOrders = [
            response.data,
            ...existingOrders.filter(
              (item) =>
                String(item.id || item.order_id) !==
                String(response.data.id),
            ),
          ];

          localStorage.setItem(
            "vynora_orders",
            JSON.stringify(updatedOrders),
          );

          localStorage.setItem(
            "vynora_last_order",
            JSON.stringify(response.data),
          );
        } catch (storageError) {
          console.error(
            "Failed to synchronize localStorage:",
            storageError,
          );
        }
      } catch (error) {
        console.error(
          "Failed to fetch order:",
          error,
        );

        if (error.response) {
          console.error(
            "Backend status:",
            error.response.status,
          );

          console.error(
            "Backend response:",
            error.response.data,
          );

          if (error.response.status === 401) {
            setError(
              "Your login session is invalid or expired. Please login again.",
            );
            return;
          }

          if (error.response.status === 404) {
            setError(
              "We couldn't find the order you're looking for. It may have been removed or is no longer available.",
            );
            return;
          }

          setError(
            "Unable to load this order. Please try again.",
          );

          return;
        }

        if (error.request) {
          setError(
            "Backend server is not responding. Please start Django server.",
          );

          return;
        }

        setError(
          "Something went wrong while loading the order.",
        );
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    } else {
      setError("Invalid order ID.");
      setLoading(false);
    }
  }, [orderId]);

  // ========================================
  // CANCEL ORDER
  // ========================================

  const handleCancelOrder = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setCancelling(true);

      const accessToken = localStorage.getItem(
        "vynora_access_token",
      );

      if (!accessToken) {
        alert("Please login again.");
        navigate("/login");
        return;
      }

      const response = await axios.post(
        `http://127.0.0.1:8000/api/orders/${orderId}/cancel/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        },
      );

      console.log(
        "CANCEL ORDER RESPONSE:",
        response.data,
      );

      // Update current order
      setOrder((previousOrder) => ({
        ...previousOrder,
        status: "cancelled",
      }));

      // Update localStorage
      try {
        const savedOrders =
          localStorage.getItem("vynora_orders");

        if (savedOrders) {
          const existingOrders =
            JSON.parse(savedOrders);

          if (Array.isArray(existingOrders)) {
            const updatedOrders =
              existingOrders.map((item) =>
                String(item.id || item.order_id) ===
                String(orderId)
                  ? {
                      ...item,
                      status: "cancelled",
                    }
                  : item,
              );

            localStorage.setItem(
              "vynora_orders",
              JSON.stringify(updatedOrders),
            );
          }
        }

        const lastOrder =
          localStorage.getItem("vynora_last_order");

        if (lastOrder) {
          const parsedLastOrder =
            JSON.parse(lastOrder);

          if (
            String(
              parsedLastOrder.id ||
                parsedLastOrder.order_id,
            ) === String(orderId)
          ) {
            localStorage.setItem(
              "vynora_last_order",
              JSON.stringify({
                ...parsedLastOrder,
                status: "cancelled",
              }),
            );
          }
        }
      } catch (storageError) {
        console.error(
          "Failed to update localStorage:",
          storageError,
        );
      }

      alert("Order cancelled successfully.");
    } catch (error) {
      console.error(
        "Failed to cancel order:",
        error,
      );

      if (error.response) {
        console.error(
          "Backend status:",
          error.response.status,
        );

        console.error(
          "Backend response:",
          error.response.data,
        );

        alert(
          error.response.data?.error ||
            "Unable to cancel this order.",
        );
      } else if (error.request) {
        alert(
          "Backend server is not responding. Please start Django server.",
        );
      } else {
        alert(
          "Something went wrong while cancelling the order.",
        );
      }
    } finally {
      setCancelling(false);
    }
  };

  // ========================================
  // RETURN ORDER
  // ========================================

  const handleReturnOrder = async () => {
    if (!returnReason.trim()) {
      alert("Please enter a return reason.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to submit this return request?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setReturning(true);

      const accessToken = localStorage.getItem(
        "vynora_access_token",
      );

      if (!accessToken) {
        alert("Please login again.");
        navigate("/login");
        return;
      }

      const response = await axios.post(
        `http://127.0.0.1:8000/api/orders/${orderId}/return/`,
        {
          reason: returnReason.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        },
      );

      console.log(
        "RETURN ORDER RESPONSE:",
        response.data,
      );

      // Update current order
      setOrder((previousOrder) => ({
        ...previousOrder,
        return_requested: true,
        return_reason: returnReason.trim(),
        return_requested_at:
          response.data.return_requested_at,
      }));

      // Update localStorage
      try {
        const savedOrders =
          localStorage.getItem("vynora_orders");

        if (savedOrders) {
          const existingOrders =
            JSON.parse(savedOrders);

          if (Array.isArray(existingOrders)) {
            const updatedOrders =
              existingOrders.map((item) =>
                String(item.id || item.order_id) ===
                String(orderId)
                  ? {
                      ...item,
                      return_requested: true,
                      return_reason:
                        returnReason.trim(),
                      return_requested_at:
                        response.data
                          .return_requested_at,
                    }
                  : item,
              );

            localStorage.setItem(
              "vynora_orders",
              JSON.stringify(updatedOrders),
            );
          }
        }

        const lastOrder =
          localStorage.getItem("vynora_last_order");

        if (lastOrder) {
          const parsedLastOrder =
            JSON.parse(lastOrder);

          if (
            String(
              parsedLastOrder.id ||
                parsedLastOrder.order_id,
            ) === String(orderId)
          ) {
            localStorage.setItem(
              "vynora_last_order",
              JSON.stringify({
                ...parsedLastOrder,
                return_requested: true,
                return_reason:
                  returnReason.trim(),
                return_requested_at:
                  response.data
                    .return_requested_at,
              }),
            );
          }
        }
      } catch (storageError) {
        console.error(
          "Failed to update localStorage:",
          storageError,
        );
      }

      setShowReturnForm(false);
      setReturnReason("");

      alert(
        "Return request submitted successfully.",
      );
    } catch (error) {
      console.error(
        "Failed to submit return request:",
        error,
      );

      if (error.response) {
        console.error(
          "Backend status:",
          error.response.status,
        );

        console.error(
          "Backend response:",
          error.response.data,
        );

        alert(
          error.response.data?.error ||
            "Unable to submit return request.",
        );
      } else if (error.request) {
        alert(
          "Backend server is not responding. Please start Django server.",
        );
      } else {
        alert(
          "Something went wrong while submitting the return request.",
        );
      }
    } finally {
      setReturning(false);
    }
  };

  // ========================================
  // REORDER / BUY AGAIN
  // ========================================

  const handleReorder = async () => {
    try {
      setReordering(true);

      const accessToken = localStorage.getItem(
        "vynora_access_token",
      );

      if (!accessToken) {
        alert("Please login again.");
        navigate("/login");
        return;
      }

      if (!items.length) {
        alert(
          "No products are available to reorder.",
        );
        return;
      }

      // Fetch latest product details
      const productRequests = items.map(
        async (item) => {
          const productId = item.product;

          if (!productId) {
            return null;
          }

          try {
            const response = await axios.get(
              `http://127.0.0.1:8000/api/products/${productId}/`,
            );

            const product = response.data;

            const stock = Number(
              product.stock || 0,
            );

            if (stock <= 0) {
              return {
                unavailable: true,
                productName:
                  product.name ||
                  item.product_name ||
                  "Product",
              };
            }

            const oldQuantity = Number(
              item.quantity || 1,
            );

            return {
              id: product.id,
              name:
                product.name ||
                item.product_name ||
                "Vynora Product",
              brand:
                product.brand || "VYNORA",
              price: Number(
                product.selling_price ||
                  product.price ||
                  0,
              ),
              mrp: Number(
                product.mrp ||
                  product.price ||
                  0,
              ),
              discount_percent: Number(
                product.discount_percent || 0,
              ),
              image: product.image || "",
              quantity: Math.min(
                oldQuantity,
                stock,
              ),

              // Current OrderItem does not store
              // previous color and size.
              selectedColor: "",
              selectedSize: "",

              stock: stock,
            };
          } catch (error) {
            console.error(
              `Failed to fetch product ${productId}:`,
              error,
            );

            return {
              unavailable: true,
              productName:
                item.product_name ||
                "Product",
            };
          }
        },
      );

      const reorderItems =
        await Promise.all(productRequests);

      const validItems =
        reorderItems.filter(Boolean);

      const unavailableItems =
        validItems.filter(
          (item) => item.unavailable,
        );

      const availableItems =
        validItems.filter(
          (item) => !item.unavailable,
        );

      if (availableItems.length === 0) {
        alert(
          "None of the products in this order are currently available.",
        );
        return;
      }

      // Read existing cart
      let existingCart = [];

      try {
        const savedCart =
          localStorage.getItem("vynora_cart");

        if (savedCart) {
          const parsedCart =
            JSON.parse(savedCart);

          if (Array.isArray(parsedCart)) {
            existingCart = parsedCart;
          }
        }
      } catch (storageError) {
        console.error(
          "Failed to read cart:",
          storageError,
        );

        existingCart = [];
      }

      // Add reorder items to cart
      availableItems.forEach((newItem) => {
        const existingItemIndex =
          existingCart.findIndex(
            (item) =>
              item.id === newItem.id &&
              item.selectedColor ===
                newItem.selectedColor &&
              item.selectedSize ===
                newItem.selectedSize,
          );

        if (existingItemIndex !== -1) {
          const existingItem =
            existingCart[existingItemIndex];

          const currentQuantity = Number(
            existingItem.quantity || 1,
          );

          const reorderQuantity = Number(
            newItem.quantity || 1,
          );

          const availableStock = Number(
            newItem.stock || 999,
          );

          existingItem.quantity = Math.min(
            currentQuantity +
              reorderQuantity,
            availableStock,
          );

          // Update latest product information
          existingItem.price =
            newItem.price;

          existingItem.mrp =
            newItem.mrp;

          existingItem.discount_percent =
            newItem.discount_percent;

          existingItem.image =
            newItem.image;

          existingItem.brand =
            newItem.brand;

          existingItem.stock =
            newItem.stock;
        } else {
          existingCart.push(newItem);
        }
      });

      localStorage.setItem(
        "vynora_cart",
        JSON.stringify(existingCart),
      );

      if (unavailableItems.length > 0) {
        alert(
          `${availableItems.length} product(s) added to cart. Some products are currently unavailable.`,
        );
      } else {
        alert(
          "Products added to cart successfully.",
        );
      }

      navigate("/cart");
    } catch (error) {
      console.error(
        "Failed to reorder:",
        error,
      );

      alert(
        "Unable to reorder this order. Please try again.",
      );
    } finally {
      setReordering(false);
    }
  };

  // ========================================
  // WRITE REVIEW
  // ========================================

  const handleStartReview = (productId) => {
    setReviewProductId(productId);
    setReviewRating(5);
    setReviewComment("");
  };

  const handleCancelReview = () => {
    setReviewProductId(null);
    setReviewRating(5);
    setReviewComment("");
  };

  const handleSubmitReview = async (productId) => {
    if (!productId) {
      alert("Product information is unavailable.");
      return;
    }

    try {
      setReviewing(true);

      const accessToken = localStorage.getItem(
        "vynora_access_token",
      );

      if (!accessToken) {
        alert("Please login again.");
        navigate("/login");
        return;
      }

      const response = await axios.post(
        "http://127.0.0.1:8000/api/reviews/",
        {
          product: productId,
          rating: Number(reviewRating),
          comment: reviewComment.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        },
      );

      console.log(
        "REVIEW RESPONSE:",
        response.data,
      );

      setReviewSubmitted((previous) => ({
        ...previous,
        [productId]: true,
      }));

      setReviewProductId(null);
      setReviewRating(5);
      setReviewComment("");

      alert("Review submitted successfully.");
    } catch (error) {
      console.error(
        "Failed to submit review:",
        error,
      );

      if (error.response) {
        console.error(
          "Backend status:",
          error.response.status,
        );

        console.error(
          "Backend response:",
          error.response.data,
        );

        const backendError =
          error.response.data;

        if (
          error.response.status === 400
        ) {
          alert(
            "You may have already reviewed this product.",
          );
        } else if (
          error.response.status === 401
        ) {
          alert(
            "Your login session has expired. Please login again.",
          );
        } else {
          alert(
            backendError?.detail ||
              "Unable to submit review.",
          );
        }
      } else if (error.request) {
        alert(
          "Backend server is not responding. Please start Django server.",
        );
      } else {
        alert(
          "Something went wrong while submitting the review.",
        );
      }
    } finally {
      setReviewing(false);
    }
  };

  // ========================================
  // FORMAT DATE
  // ========================================

  const formatDate = (date) => {
    if (!date) return "Recently";

    const formattedDate = new Date(date);

    if (
      Number.isNaN(formattedDate.getTime())
    ) {
      return "Recently";
    }

    return formattedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      },
    );
  };

  // ========================================
  // FORMAT STATUS
  // ========================================

  const formatStatus = (status) => {
    if (!status) return "Pending";

    return String(status)
      .replaceAll("_", " ")
      .replace(
        /\b\w/g,
        (letter) => letter.toUpperCase(),
      );
  };

  // ========================================
  // PAYMENT METHOD
  // ========================================

  const getPaymentMethod = () => {
    if (!order) {
      return "Cash on Delivery";
    }

    const method =
      order.payment_method ||
      order.paymentMethod ||
      order.payment?.payment_method ||
      "cod";

    return method === "online"
      ? "Online Payment"
      : "Cash on Delivery";
  };

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <main className="order-details-page">
        <div className="order-details-container">
          <section className="order-details-empty">
            <div className="order-details-empty-icon">
              ...
            </div>

            <span className="order-details-eyebrow">
              VYNORA ORDERS
            </span>

            <h1>Loading Order...</h1>

            <p>
              Please wait while we load your
              order details.
            </p>
          </section>
        </div>
      </main>
    );
  }

  // ========================================
  // ORDER NOT FOUND / ERROR
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
              {error ||
                "We couldn't find the order you're looking for. It may have been removed or is no longer available."}
            </p>

            <div className="order-details-empty-actions">
              <button
                type="button"
                className="order-details-primary-btn"
                onClick={() =>
                  navigate("/orders")
                }
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

  const id =
    order.id ||
    order.order_id ||
    orderId;

  const items = Array.isArray(order.items)
    ? order.items
    : [];

  const status =
    order.status || "pending";

  const paymentStatus =
    order.payment_status ||
    order.paymentStatus ||
    order.payment?.status ||
    "pending";

  const paymentMethod =
    getPaymentMethod();

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
      total +
      Number(item.quantity || 1),
    0,
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
  // CHECK ORDER ACTIONS
  // ========================================

  const canCancel =
    status === "pending" ||
    status === "confirmed";

  const canReturn =
    status === "delivered" &&
    !order.return_requested;

  const canReview =
    status === "delivered";

  // ========================================
  // PAGE
  // ========================================

  return (
    <main className="order-details-page">
      <div className="order-details-container">

        {/* HEADER */}

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
                  order.date,
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

        {/* STATUS */}

        <section className="order-details-status-card">
          <div className="order-details-status-icon">
            {status === "cancelled"
              ? "×"
              : "✓"}
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
                paymentStatus,
              ).toLowerCase()}`}
            >
              {formatStatus(
                paymentStatus,
              )}
            </strong>
          </div>
        </section>

        {/* MAIN GRID */}

        <div className="order-details-grid">

          {/* LEFT */}

          <div className="order-details-left">

            {/* ORDER ITEMS */}

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
                    No item information
                    available.
                  </div>
                ) : (
                  items.map(
                    (item, index) => {
                      const quantity =
                        Number(
                          item.quantity ||
                            1,
                        );

                      const price =
                        Number(
                          item.price ||
                            0,
                        );

                      const productName =
                        item.product_name ||
                        item.name ||
                        "Vynora Product";

                      const productId =
                        item.product;

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
                              Quantity:{" "}
                              {quantity}
                            </span>

                            {/* WRITE REVIEW */}

                            {canReview &&
                              productId &&
                              !reviewSubmitted[
                                productId
                              ] && (
                                <>
                                  {reviewProductId !==
                                  productId ? (
                                    <button
                                      type="button"
                                      className="order-details-write-review-btn"
                                      onClick={() =>
                                        handleStartReview(
                                          productId,
                                        )
                                      }
                                    >
                                      ★ Write Review
                                    </button>
                                  ) : (
                                    <div className="order-details-review-form">

                                      <label>
                                        Your Rating
                                      </label>

                                      <div className="order-details-rating">
                                        {[1, 2, 3, 4, 5].map(
                                          (star) => (
                                            <button
                                              type="button"
                                              key={star}
                                              className={
                                                star <=
                                                reviewRating
                                                  ? "active"
                                                  : ""
                                              }
                                              onClick={() =>
                                                setReviewRating(
                                                  star,
                                                )
                                              }
                                              disabled={
                                                reviewing
                                              }
                                            >
                                              ★
                                            </button>
                                          ),
                                        )}
                                      </div>

                                      <textarea
                                        value={
                                          reviewComment
                                        }
                                        onChange={(
                                          event,
                                        ) =>
                                          setReviewComment(
                                            event
                                              .target
                                              .value,
                                          )
                                        }
                                        placeholder="Share your experience with this product..."
                                        rows="3"
                                        disabled={
                                          reviewing
                                        }
                                      />

                                      <button
                                        type="button"
                                        className="order-details-review-submit-btn"
                                        onClick={() =>
                                          handleSubmitReview(
                                            productId,
                                          )
                                        }
                                        disabled={
                                          reviewing
                                        }
                                      >
                                        {reviewing
                                          ? "Submitting..."
                                          : "Submit Review"}
                                      </button>

                                      <button
                                        type="button"
                                        className="order-details-review-cancel-btn"
                                        onClick={
                                          handleCancelReview
                                        }
                                        disabled={
                                          reviewing
                                        }
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  )}
                                </>
                              )}

                            {canReview &&
                              productId &&
                              reviewSubmitted[
                                productId
                              ] && (
                                <div className="order-details-review-submitted">
                                  ✓ Review Submitted
                                </div>
                              )}
                          </div>

                          <div className="order-details-item-price">
                            <span>
                              ₹
                              {price.toLocaleString(
                                "en-IN",
                                {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                },
                              )}
                            </span>

                            <small>
                              ₹
                              {(
                                price *
                                quantity
                              ).toLocaleString(
                                "en-IN",
                                {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                },
                              )}
                            </small>
                          </div>
                        </div>
                      );
                    },
                  )
                )}
              </div>
            </section>

            {/* DELIVERY ADDRESS */}

            <section className="order-details-card">
              <div className="order-details-card-heading">
                <div className="order-details-number">
                  02
                </div>

                <div>
                  <h2>
                    Delivery Address
                  </h2>

                  <p>
                    Your order will be
                    delivered to this
                    address.
                  </p>
                </div>
              </div>

              <div className="order-details-address">
                <strong>
                  {fullName ||
                    "Customer"}
                </strong>

                <p>
                  {address ||
                    "Address not available"}

                  <br />

                  {city &&
                    `${city}, `}

                  {state}

                  {pincode &&
                    ` - ${pincode}`}

                  {mobile && (
                    <>
                      <br />
                      Mobile: {mobile}
                    </>
                  )}
                </p>
              </div>
            </section>

            {/* PAYMENT */}

            <section className="order-details-card">
              <div className="order-details-card-heading">
                <div className="order-details-number">
                  03
                </div>

                <div>
                  <h2>
                    Payment Information
                  </h2>

                  <p>
                    Payment details for
                    this order.
                  </p>
                </div>
              </div>

              <div className="order-details-payment-box">
                <div>
                  <span>
                    Payment Method
                  </span>

                  <strong>
                    {paymentMethod}
                  </strong>
                </div>

                <div>
                  <span>
                    Payment Status
                  </span>

                  <strong>
                    {formatStatus(
                      paymentStatus,
                    )}
                  </strong>
                </div>
              </div>
            </section>

            {/* RETURN INFORMATION */}

            {order.return_requested && (
              <section className="order-details-card">
                <div className="order-details-card-heading">
                  <div className="order-details-number">
                    04
                  </div>

                  <div>
                    <h2>
                      Return Request
                    </h2>

                    <p>
                      Your return
                      request has been
                      submitted.
                    </p>
                  </div>
                </div>

                <div className="order-details-address">
                  <strong>
                    Return Requested
                  </strong>

                  <p>
                    Reason:{" "}
                    {order.return_reason ||
                      "Reason not available"}

                    {order.return_requested_at && (
                      <>
                        <br />
                        Requested on:{" "}
                        {formatDate(
                          order.return_requested_at,
                        )}
                      </>
                    )}
                  </p>
                </div>
              </section>
            )}
          </div>

          {/* RIGHT — SUMMARY */}

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
                  {Number(
                    subtotal,
                  ).toLocaleString(
                    "en-IN",
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    },
                  )}
                </strong>
              </div>

              <div>
                <span>Delivery</span>

                <strong
                  className={
                    Number(
                      deliveryCharge,
                    ) === 0
                      ? "free"
                      : ""
                  }
                >
                  {Number(
                    deliveryCharge,
                  ) === 0
                    ? "FREE"
                    : `₹${Number(
                        deliveryCharge,
                      ).toLocaleString(
                        "en-IN",
                      )}`}
                </strong>
              </div>
            </div>

            <div className="order-details-total">
              <span>
                Total Amount
              </span>

              <strong>
                ₹
                {Number(
                  totalAmount,
                ).toLocaleString(
                  "en-IN",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  },
                )}
              </strong>
            </div>

            <div className="order-details-summary-actions">

              {/* CANCEL ORDER */}

              {canCancel && (
                <button
                  type="button"
                  className="order-details-cancel-btn"
                  onClick={
                    handleCancelOrder
                  }
                  disabled={
                    cancelling
                  }
                >
                  {cancelling
                    ? "Cancelling..."
                    : "Cancel Order"}
                </button>
              )}

              {/* RETURN ORDER */}

              {canReturn &&
                !showReturnForm && (
                  <button
                    type="button"
                    className="order-details-return-btn"
                    onClick={() =>
                      setShowReturnForm(
                        true,
                      )
                    }
                  >
                    Return Order
                  </button>
                )}

              {/* RETURN FORM */}

              {canReturn &&
                showReturnForm && (
                  <div className="order-details-return-form">
                    <label htmlFor="returnReason">
                      Return Reason
                    </label>

                    <textarea
                      id="returnReason"
                      value={
                        returnReason
                      }
                      onChange={(
                        event,
                      ) =>
                        setReturnReason(
                          event.target
                            .value,
                        )
                      }
                      placeholder="Please tell us why you want to return this product..."
                      rows="4"
                      disabled={
                        returning
                      }
                    />

                    <button
                      type="button"
                      className="order-details-return-submit-btn"
                      onClick={
                        handleReturnOrder
                      }
                      disabled={
                        returning
                      }
                    >
                      {returning
                        ? "Submitting..."
                        : "Submit Return Request"}
                    </button>

                    <button
                      type="button"
                      className="order-details-return-cancel-btn"
                      onClick={() => {
                        setShowReturnForm(
                          false,
                        );

                        setReturnReason(
                          "",
                        );
                      }}
                      disabled={
                        returning
                      }
                    >
                      Cancel
                    </button>
                  </div>
                )}

              {/* RETURN REQUESTED */}

              {order.return_requested && (
                <div className="order-details-return-requested">
                  ✓ Return Requested
                </div>
              )}

              {/* REORDER / BUY AGAIN */}

              {items.length > 0 && (
                <button
                  type="button"
                  className="order-details-reorder-btn"
                  onClick={
                    handleReorder
                  }
                  disabled={
                    reordering
                  }
                >
                  {reordering
                    ? "Adding to Cart..."
                    : "Buy Again"}
                </button>
              )}

              {/* TRACK ORDER */}

              <Link
                to={`/orders/${id}/track`}
                className="order-details-track-btn"
              >
                Track Order
                <span>→</span>
              </Link>

              {/* ALL ORDERS */}

              <Link
                to="/orders"
                className="order-details-orders-btn"
              >
                View All Orders
              </Link>

              {/* CONTINUE SHOPPING */}

              <Link
                to="/products"
                className="order-details-shop-btn"
              >
                Continue Shopping
                <span>→</span>
              </Link>
            </div>

            <div className="order-details-security">
              <strong>
                ✓ Secure Order
              </strong>

              <p>
                Your order information
                is safely stored with
                Vynora.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default OrderDetails;