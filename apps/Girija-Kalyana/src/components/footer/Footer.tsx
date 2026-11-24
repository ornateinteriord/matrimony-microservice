import React from "react";
import "./Footer.scss";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaYoutube } from "react-icons/fa";
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
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-section">
            <h2 className="footer-heading">Girija Kalyana</h2>
            <p className="footer-text">
              A Superior Sacred Matrimony Service. Register and find your special
              someone matches within your community with verified security.
            </p>
          </div>

          <div className="footer-section">
            <h3 className="footer-heading">Quick Links</h3>
            <ul className="footer-list">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/service">Services</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/membership">Membership Plans</Link></li>
              <li><Link to="/register">Register Free</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="footer-heading">Legal & Compliance</h3>
            <ul className="footer-list">
              <li><Link to="/privacy-policy">Privacy Policy (DPDP Act)</Link></li>
              <li><Link to="/terms">Terms & Conditions</Link></li>
              <li><Link to="/cookie-policy">Cookie Policy</Link></li>
              <li><Link to="/refund-policy">Refund Policy</Link></li>
              <li><Link to="/data-disclosure">Data Collection Disclosure</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="footer-heading">Contact Us</h3>
            <p className="footer-text">Email: ornateinteriord@gmail.com</p>
            <p className="footer-text">Call Us: +91 91488 24442</p>
            <p className="footer-text">Vijaynagar, Bangalore - 560040</p>
          </div>
        </div>

        <div className="social-icons">
          <span className="social-icon facebook" onClick={() => handleSocialClick("facebook")} aria-label="Facebook">
            <FaFacebookF />
          </span>
          <span className="social-icon twitter" onClick={() => handleSocialClick("twitter")} aria-label="Twitter">
            <FaTwitter />
          </span>
          <span className="social-icon linkedin" onClick={() => handleSocialClick("linkedin")} aria-label="LinkedIn">
            <FaLinkedinIn />
          </span>
          <span className="social-icon youtube" onClick={() => handleSocialClick("youtube")} aria-label="YouTube">
            <FaYoutube />
          </span>
        </div>

        <div className="footer-copyright">
          Copyright © {new Date().getFullYear()} Girija Kalyana (Ornate Pvt Ltd). All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
