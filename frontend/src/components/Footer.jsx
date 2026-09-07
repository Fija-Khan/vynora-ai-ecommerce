function Footer() {
  return (
    <footer className="vynora-footer">

      <div className="container">

        <div className="vynora-footer-grid">

          {/* Brand */}
          <div className="vynora-footer-brand">
            <h3>VYNORA</h3>

            <p>
              AI-powered shopping for a smarter,
              simpler and better experience.
            </p>
          </div>


          {/* Quick Links */}
          <div className="vynora-footer-column">
            <h4>Quick Links</h4>

            <a href="/">Home</a>
            <a href="/products">Shop</a>
            <a href="/wishlist">Wishlist</a>
            <a href="/orders">My Orders</a>
          </div>


          {/* Customer Service */}
          <div className="vynora-footer-column">
            <h4>Customer Service</h4>

            <a href="/orders">Track Order</a>
            <a href="/cart">Cart</a>
            <a href="/checkout">Checkout</a>
            <a href="/login">Login</a>
          </div>


          {/* Contact */}
          <div className="vynora-footer-column">
            <h4>Contact Us</h4>

            <p>Email: support@vynora.com</p>
            <p>Phone: +91 98765 43210</p>
            <p>India</p>
          </div>

        </div>


        {/* Bottom */}
        <div className="vynora-footer-bottom">

          <p>
            © 2026 Vynora. All rights reserved.
          </p>

          <div className="vynora-footer-social">
            <a href="#" aria-label="Instagram">
              Instagram
            </a>

            <a href="#" aria-label="Facebook">
              Facebook
            </a>

            <a href="#" aria-label="LinkedIn">
              LinkedIn
            </a>
          </div>

        </div>

      </div>

    </footer>
  );
}

export default Footer;