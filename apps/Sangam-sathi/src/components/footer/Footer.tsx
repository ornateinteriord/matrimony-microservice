import React from "react";
import "./Footer.scss";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaYoutube, FaUserTie } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

function Footer() {
  const navigate = useNavigate();

  const handleSocialClick = (platform: string) => {
    // Optional social links handler
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Top Section: Main Content */}
        <div className="footer-top">
          {/* Left Column: Brand & Newsletter & Promoter CTA */}
          <div className="footer-brand-section">
            <h2 className="footer-brand-name">Sangam Sathi</h2>
            <p className="footer-brand-description">
              A Premium Matrimony Service. Connect with your life partner within your community with trust, authenticity, and elegance.
            </p>

            <div className="footer-promoter-cta">
              <button
                className="footer-promoter-btn"
                onClick={() => navigate("/promoter/login")}
                title="Access the Promoter Portal"
              >
                <FaUserTie className="promoter-btn-icon" />
                <span>Login as a Promoter</span>
              </button>
            </div>

            <div className="footer-newsletter">
              <h4 className="newsletter-title">Join Our Newsletter</h4>
              <div className="newsletter-input-group">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="footer-input"
                />
                <button className="footer-button">Subscribe</button>
              </div>
            </div>
          </div>

          {/* Right Column: Stacked Links Grid */}
          <div className="footer-links-grid">
            <div className="footer-link-group">
              <h3 className="footer-heading">Company</h3>
              <ul className="footer-list">
                <li>
                  <Link to="/" className="footer-nav-link">Home</Link>
                </li>
                <li>
                  <Link to="/about" className="footer-nav-link">About Us</Link>
                </li>
                <li>
                  <Link to="/service" className="footer-nav-link">Services</Link>
                </li>
                <li>
                  <Link to="/membership" className="footer-nav-link">Membership Plans</Link>
                </li>
              </ul>
            </div>

            <div className="footer-link-group">
              <h3 className="footer-heading">Partner Program</h3>
              <ul className="footer-list">
                <li>
                  <Link to="/promoter/login" className="footer-nav-link">Promoter Login</Link>
                </li>
                <li>
                  <Link to="/promoter/register" className="footer-nav-link">Become a Promoter</Link>
                </li>
              </ul>
            </div>

            <div className="footer-link-group">
              <h3 className="footer-heading">Legal &amp; Compliance</h3>
              <ul className="footer-list">
                <li>
                  <Link to="/privacy-policy" className="footer-nav-link">Privacy Policy (DPDP 2023)</Link>
                </li>
                <li>
                  <Link to="/terms" className="footer-nav-link">Terms and Conditions</Link>
                </li>
                <li>
                  <Link to="/cookie-policy" className="footer-nav-link">Cookie Policy</Link>
                </li>
                <li>
                  <Link to="/refund-policy" className="footer-nav-link">Refund &amp; Cancellation</Link>
                </li>
                <li>
                  <Link to="/data-disclosure" className="footer-nav-link">Data Collection Disclosure</Link>
                </li>
              </ul>
            </div>

            <div className="footer-link-group">
              <h3 className="footer-heading">Contact</h3>
              <ul className="footer-list contact-list">
                <li><span className="accent-text">Email:</span> ornateinteriord@gmail.com</li>
                <li><span className="accent-text">Call:</span> +91 91488 24442</li>
                <li>
                  <Link to="/contact" className="contact-link">Contact Support →</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section: Socials & Copyright */}
        <div className="footer-bottom">
          <div className="footer-copyright">
            Copyright © {new Date().getFullYear()} Sangam Sathi. All rights reserved.
          </div>

          <div className="social-icons">
            <span className="social-icon" onClick={() => handleSocialClick("facebook")} aria-label="Facebook">
              <FaFacebookF />
            </span>
            <span className="social-icon" onClick={() => handleSocialClick("twitter")} aria-label="Twitter">
              <FaTwitter />
            </span>
            <span className="social-icon" onClick={() => handleSocialClick("linkedin")} aria-label="LinkedIn">
              <FaLinkedinIn />
            </span>
            <span className="social-icon" onClick={() => handleSocialClick("youtube")} aria-label="YouTube">
              <FaYoutube />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
