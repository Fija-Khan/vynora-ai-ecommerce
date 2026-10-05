import React, { useEffect, useState } from "react";

import axios from "axios";

import { Link, useNavigate } from "react-router-dom";

import "./chatbot.css";

const API_URL = "http://127.0.0.1:8000/api/chatbot";

const Chatbot = () => {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const accessToken = localStorage.getItem(
    "vynora_access_token"
  );

  useEffect(() => {
    if (isOpen && !conversation) {
      createConversation();
    }
  }, [isOpen]);

  const createConversation = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/conversations/`,
        {
          title: "Vynora AI Shopping Assistant",
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setConversation(response.data);
      setMessages([]);

      return response.data;
    } catch (error) {
      console.error("Conversation creation error:", error);
      return null;
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    const userMessage = input.trim();

    if (!userMessage || loading) {
      return;
    }

    setInput("");
    setLoading(true);

    try {
      let currentConversation = conversation;

      if (!currentConversation) {
        currentConversation = await createConversation();

        if (!currentConversation) {
          throw new Error(
            "Conversation could not be created."
          );
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          message: userMessage,
        },
      ]);

      const response = await axios.post(
        `${API_URL}/messages/`,
        {
          conversation: currentConversation.id,
          message: userMessage,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const aiMessage = {
        role: "assistant",
        message: response.data.message,
        products: response.data.products || [],
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Message error:", error);
      console.error(
        "Response:",
        error.response?.data
      );

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          message:
            "Sorry, I couldn't process your request right now. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // ADD TO CART
  // =========================================

  const handleAddToCart = (product) => {
    const accessToken = localStorage.getItem(
      "vynora_access_token"
    );

    // CHECK LOGIN
    if (!accessToken) {
      localStorage.setItem(
        "vynora_redirect_after_login",
        `/products/${product.id}`
      );

      navigate("/login");
      return;
    }

    // PRODUCT CHECK
    if (!product) {
      return;
    }

    const stock = Number(product.stock || 0);

    if (stock <= 0) {
      alert("Product is out of stock.");
      return;
    }

    // PREPARE CART ITEM
    const cartItem = {
      id: product.id,
      name: product.name,
      brand: product.brand || "VYNORA",
      price: Number(product.price || 0),
      mrp: Number(
        product.mrp || product.price || 0
      ),
      discount_percent: Number(
        product.discount_percent || 0
      ),
      image: product.image || "",
      quantity: 1,
      selectedColor: "",
      selectedSize: "",
      stock: stock,
    };

    // GET EXISTING CART
    let existingCart = [];

    try {
      existingCart =
        JSON.parse(
          localStorage.getItem("vynora_cart")
        ) || [];
    } catch (error) {
      console.error(
        "Failed to read cart:",
        error
      );

      existingCart = [];
    }

    // CHECK SAME PRODUCT + COLOR + SIZE
    const existingItemIndex =
      existingCart.findIndex(
        (item) =>
          item.id === cartItem.id &&
          item.selectedColor ===
            cartItem.selectedColor &&
          item.selectedSize ===
            cartItem.selectedSize
      );

    // ALREADY EXISTS
    if (existingItemIndex !== -1) {
      const existingItem =
        existingCart[existingItemIndex];

      const currentQuantity = Number(
        existingItem.quantity || 1
      );

      existingItem.quantity = Math.min(
        currentQuantity + 1,
        stock
      );
    }

    // NEW PRODUCT
    else {
      existingCart.push(cartItem);
    }

    // SAVE CART
    localStorage.setItem(
      "vynora_cart",
      JSON.stringify(existingCart)
    );

    alert("Product added to cart!");
  };

  // =========================================
  // ADD TO WISHLIST
  // =========================================

  const handleAddToWishlist = async (product) => {
    const accessToken = localStorage.getItem(
      "vynora_access_token"
    );

    // CHECK LOGIN
    if (!accessToken) {
      localStorage.setItem(
        "vynora_redirect_after_login",
        `/products/${product.id}`
      );

      navigate("/login");
      return;
    }

    try {
      await axios.post(
        "http://127.0.0.1:8000/api/wishlist/items/",
        {
          product: Number(product.id),
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("Product added to wishlist!");
    } catch (error) {
      console.error(
        "Failed to add product to wishlist:",
        error
      );

      if (error.response?.status === 400) {
        alert(
          "Product is already in your wishlist."
        );
      } else if (
        error.response?.status === 401
      ) {
        alert(
          "Your login session has expired. Please login again."
        );

        localStorage.removeItem(
          "vynora_access_token"
        );

        navigate("/login");
      } else {
        alert(
          error.response?.data?.detail ||
            "Unable to add product to wishlist."
        );
      }
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          className="chatbot-floating-button"
          onClick={() => setIsOpen(true)}
          aria-label="Open Vynora AI"
        >
          💬
        </button>
      )}

      {isOpen && (
        <div className="chatbot-widget">
          <div className="chatbot-header">
            <div>
              <h2>Vynora AI</h2>
              <p>Your AI Shopping Assistant</p>
            </div>

            <div className="chatbot-header-right">
              <div className="chatbot-status">
                <span></span>
                Online
              </div>

              <button
                className="chatbot-close"
                onClick={() => setIsOpen(false)}
                aria-label="Close chatbot"
              >
                ×
              </button>
            </div>
          </div>

          <div className="chatbot-messages">
            {messages.length === 0 && (
              <div className="chatbot-welcome">
                <div className="ai-icon">✦</div>

                <h3>Hi! I'm Vynora AI 👋</h3>

                <p>
                  I can help you find products,
                  understand product details,
                  and make better shopping
                  decisions.
                </p>

                <div className="suggestions">
                  <button
                    type="button"
                    onClick={() =>
                      setInput(
                        "Help me find a good product"
                      )
                    }
                  >
                    Find a product
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setInput(
                        "What products do you recommend?"
                      )
                    }
                  >
                    Product recommendations
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setInput(
                        "How can you help me?"
                      )
                    }
                  >
                    How can you help?
                  </button>
                </div>
              </div>
            )}

            {messages.map((msg, index) => (
              <div
                key={msg.id || index}
                className={`chat-message ${
                  msg.role === "user"
                    ? "user-message"
                    : "ai-message"
                }`}
              >
                <div className="message-bubble">
                  {msg.message}
                </div>

                {msg.role === "assistant" &&
                  msg.products &&
                  msg.products.length > 0 && (
                    <div className="chatbot-products">
                      {msg.products.map((product) => (
                        <div
                          className="chatbot-product-card"
                          key={product.id}
                        >
                          {product.image && (
                            <img
                              src={`http://127.0.0.1:8000${product.image}`}
                              alt={product.name}
                              className="chatbot-product-image"
                            />
                          )}

                          <div className="chatbot-product-info">
                            <h4>{product.name}</h4>

                            {product.brand && (
                              <p>{product.brand}</p>
                            )}

                            <strong>
                              ₹{product.price}
                            </strong>

                            {product.discount_percent >
                              0 && (
                              <span>
                                {" "}
                                {
                                  product.discount_percent
                                }
                                % OFF
                              </span>
                            )}

                            {/* VIEW PRODUCT */}
                            <Link
                              to={`/products/${product.id}`}
                              className="chatbot-view-product"
                            >
                              View Product
                            </Link>

                            {/* ADD TO CART */}
                            <button
                              type="button"
                              className="chatbot-add-cart"
                              onClick={() =>
                                handleAddToCart(
                                  product
                                )
                              }
                            >
                              Add to Cart
                            </button>

                            {/* ADD TO WISHLIST */}
                            <button
                              type="button"
                              className="chatbot-add-wishlist"
                              onClick={() =>
                                handleAddToWishlist(
                                  product
                                )
                              }
                            >
                              ♡ Wishlist
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            ))}

            {loading && (
              <div className="chat-message ai-message">
                <div className="message-bubble typing">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
          </div>

          <form
            className="chatbot-input-area"
            onSubmit={sendMessage}
          >
            <input
              type="text"
              placeholder="Ask Vynora AI anything..."
              value={input}
              onChange={(e) =>
                setInput(e.target.value)
              }
              disabled={loading}
            />

            <button
              type="submit"
              disabled={
                loading || !input.trim()
              }
              aria-label="Send message"
            >
              ➤
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;
