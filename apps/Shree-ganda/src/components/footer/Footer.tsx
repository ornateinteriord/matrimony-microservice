import React from "react";
import "./Footer.scss";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaYoutube, FaUserTie } from "react-icons/fa";
import { Link } from "react-router-dom";

function Footer() {
  const handleSocialClick = (platform: string) => {
    const urls: Record<string, string> = {
      facebook: "https://facebook.com",
      twitter: "https://twitter.com",
      linkedin: "https://linkedin.com",
      youtube: "https://youtube.com",
    };
    if (urls[platform]) window.open(urls[platform], "_blank");
  };

  return (
    <footer className="footer" style={{ display: "block" }}>
      <div className="footer-container">

        {/* Top Section: Main Content */}
        <div className="footer-top">

          {/* Left Column: Brand & Newsletter & Promoter CTA */}
          <div className="footer-brand-section">
            <h2 className="footer-brand-name">ShreeGandaMatrimony</h2>
            <p className="footer-brand-description">
              A Superior Matrimony Service. Register and find your special someone matches within your community.
            </p>

            <div className="footer-promoter-cta">
              <Link
                to="/promoter/login"
                className="footer-promoter-btn"
                title="Access the Promoter Portal"
                style={{ textDecoration: "none" }}
              >
                <FaUserTie className="promoter-btn-icon" />
                <span>Login as a Promoter</span>
              </Link>
            </div>

            <div className="footer-newsletter">
              <h4 className="newsletter-title">Subscribe to Newsletter</h4>
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
              <h3 className="footer-heading">About Company</h3>
              <ul className="footer-list">
                <li><Link to="/home">Home</Link></li>
                <li><Link to="/membership">Membership Plans</Link></li>
                <li><Link to="/register">Register</Link></li>
                <li><Link to="/contact">Contact Us</Link></li>
              </ul>
            </div>

            <div className="footer-link-group">
              <h3 className="footer-heading">Legal &amp; Compliance</h3>
              <ul className="footer-list">
                <li><Link to="/privacy-policy">Privacy Policy (DPDP 2023)</Link></li>
                <li><Link to="/terms-and-conditions">Terms &amp; Conditions</Link></li>
                <li><Link to="/cookie-policy">Cookie Policy</Link></li>
                <li><Link to="/refund-policy">Refund Policy</Link></li>
                <li><Link to="/data-collection-disclosure">Data Collection Disclosure</Link></li>
              </ul>
            </div>

            <div className="footer-link-group">
              <h3 className="footer-heading">Partner Program</h3>
              <ul className="footer-list">
                <li><Link to="/promoter/login" className="promoter-nav-link">Promoter Login</Link></li>
                <li><Link to="/promoter/register">Become a Promoter</Link></li>
              </ul>
            </div>

            <div className="footer-link-group">
              <h3 className="footer-heading">Contact Us</h3>
              <ul className="footer-list contact-list">
                <li><span className="accent-text">Email:</span> privacy@shreegandha.com</li>
                <li><span className="accent-text">Call Us:</span> +91 80 2345 6789</li>
                <li><Link to="/contact" className="contact-link">Contact Support →</Link></li>
              </ul>
            </div>

          </div>
        </div>

        {/* Bottom Section: Socials & Copyright */}
        <div className="footer-bottom">
          <div className="footer-copyright">
            Copyright © {new Date().getFullYear()} Shree Gandha Matrimony. All Rights Reserved. | In Compliance with DPDP Act 2023
          </div>

          <div className="social-icons">
            <span className="social-icon facebook" onClick={() => handleSocialClick("facebook")}>
              <FaFacebookF />
            </span>
            <span className="social-icon twitter" onClick={() => handleSocialClick("twitter")}>
              <FaTwitter />
            </span>
            <span className="social-icon linkedin" onClick={() => handleSocialClick("linkedin")}>
              <FaLinkedinIn />
            </span>
            <span className="social-icon youtube" onClick={() => handleSocialClick("youtube")}>
              <FaYoutube />
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
