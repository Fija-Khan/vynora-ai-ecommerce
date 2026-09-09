import { useState } from "react";
import "./Contact.css";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setSubmitted(true);

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });

    setTimeout(() => {
      setSubmitted(false);
    }, 5000);
  };

  return (
    <main className="vynora-contact-page">
      <section className="vynora-contact-hero">
        <div className="container">
          <div className="vynora-contact-hero-content">
            <span className="vynora-contact-eyebrow">VYNORA SUPPORT</span>

            <h1>Get in Touch</h1>

            <p>
              Have a question about an order, product, or your Vynora
              experience? We’re here to help.
            </p>
          </div>
        </div>
      </section>

      <section className="vynora-contact-section">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-5">
              <div className="vynora-contact-info">
                <span className="vynora-section-label">CONTACT US</span>

                <h2>We’d love to hear from you.</h2>

                <p className="vynora-contact-description">
                  Whether you need help with an order or simply want to know
                  more about Vynora, feel free to reach out to us.
                </p>

                <div className="vynora-contact-details">
                  <div className="vynora-contact-detail">
                    <div className="vynora-contact-icon">✉</div>
                    <div>
                      <span>Email</span>
                      <a href="mailto:support@vynora.com">
                        support@vynora.com
                      </a>
                    </div>
                  </div>

                  <div className="vynora-contact-detail">
                    <div className="vynora-contact-icon">☎</div>
                    <div>
                      <span>Phone</span>
                      <a href="tel:+919999999999">+91 99999 99999</a>
                    </div>
                  </div>

                  <div className="vynora-contact-detail">
                    <div className="vynora-contact-icon">⌖</div>
                    <div>
                      <span>Address</span>
                      <p>
                        Vynora Fashion Studio
                        <br />
                        Pune, Maharashtra, India
                      </p>
                    </div>
                  </div>

                  <div className="vynora-contact-detail">
                    <div className="vynora-contact-icon">◷</div>
                    <div>
                      <span>Support Hours</span>
                      <p>
                        Monday – Saturday
                        <br />
                        10:00 AM – 7:00 PM
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-7">
              <div className="vynora-contact-form-card">
                <div className="vynora-form-header">
                  <h2>Send us a message</h2>

                  <p>
                    Fill out the form below and our team will get back to you.
                  </p>
                </div>

                {submitted && (
                  <div className="vynora-success-message" role="alert">
                    ✓ Thank you! Your message has been submitted successfully.
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label htmlFor="name">Full Name</label>

                      <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="email">Email Address</label>

                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label htmlFor="subject">Subject</label>

                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        placeholder="What can we help you with?"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label htmlFor="message">Message</label>

                      <textarea
                        id="message"
                        name="message"
                        rows="6"
                        placeholder="Write your message here..."
                        value={formData.message}
                        onChange={handleChange}
                        required
                      ></textarea>
                    </div>

                    <div className="col-12">
                      <button
                        type="submit"
                        className="vynora-contact-submit"
                      >
                        Send Message
                        <span>→</span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="vynora-contact-help">
        <div className="container">
          <div className="vynora-help-content">
            <span className="vynora-section-label">NEED QUICK HELP?</span>

            <h2>We’re here when you need us.</h2>

            <p>
              For order-related questions, please keep your order details
              ready so our support team can assist you faster.
            </p>

            <a href="/orders" className="vynora-help-link">
              View My Orders →
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Contact;