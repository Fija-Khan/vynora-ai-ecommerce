import React, { useEffect, useState } from "react";
import axios from "axios";
import "./chatbot.css";

const API_URL = "http://127.0.0.1:8000/api/chatbot";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const accessToken = localStorage.getItem("vynora_access_token");

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
    } catch (error) {
      console.error("Conversation creation error:", error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!input.trim() || !conversation || loading) {
      return;
    }

    const userMessage = input.trim();
    setInput("");

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        message: userMessage,
      },
    ]);

    setLoading(true);

    try {
      await axios.post(
        `${API_URL}/messages/`,
        {
          conversation: conversation.id,
          message: userMessage,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const response = await axios.get(
        `${API_URL}/messages/?conversation=${conversation.id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const conversationMessages = response.data.filter(
        (msg) => msg.conversation === conversation.id
      );

      setMessages(conversationMessages);
    } catch (error) {
      console.error("Message error:", error);

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

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          className="chatbot-floating-button"
          onClick={() => setIsOpen(true)}
          aria-label="Open Vynora AI"
        >
          💬
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-widget">
          {/* Header */}
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

          {/* Messages */}
          <div className="chatbot-messages">
            {messages.length === 0 && (
              <div className="chatbot-welcome">
                <div className="ai-icon">✦</div>

                <h3>Hi! I'm Vynora AI 👋</h3>

                <p>
                  I can help you find products, understand product details,
                  and make better shopping decisions.
                </p>

                <div className="suggestions">
                  <button
                    type="button"
                    onClick={() =>
                      setInput("Help me find a good product")
                    }
                  >
                    Find a product
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setInput("What products do you recommend?")
                    }
                  >
                    Product recommendations
                  </button>

                  <button
                    type="button"
                    onClick={() => setInput("How can you help me?")}
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
                  msg.role === "user" ? "user-message" : "ai-message"
                }`}
              >
                <div className="message-bubble">{msg.message}</div>
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

          {/* Input */}
          <form className="chatbot-input-area" onSubmit={sendMessage}>
            <input
              type="text"
              placeholder="Ask Vynora AI anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />

            <button
              type="submit"
              disabled={loading || !input.trim()}
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