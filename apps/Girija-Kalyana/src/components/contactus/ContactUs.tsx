import React, { useEffect, useState } from "react";
import "./ContactUs.scss";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import SEOHead from "../common/SEOHead";
import { FaMapMarkerAlt, FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import { toast } from "react-toastify";

const ContactUs = () => {
  const [consentChecked, setConsentChecked] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentChecked) {
      toast.error("Please agree to the privacy consent before sending your message.");
      return;
    }
    toast.success("Thank you! Your inquiry has been sent to our matrimonial support desk.");
  };

  return (
    <>
      <SEOHead
        title="Contact Us"
        description="Reach out to Girija Kalyana Matrimony support desk and Grievance Officer in Bangalore, Karnataka for matchmaking and billing assistance."
        canonicalUrl="https://girijakalyana.com/contact"
      />
      <Navbar />

      <div className="contact-container">
        {/* Header Section */}
        <div className="contact-header">
          <h1>Contact Us - Get In Touch</h1>
          <p>
            We're here to assist you! Feel free to reach out to us with any
            questions, concerns, or sacred matchmaking inquiries.
          </p>
        </div>

        <div className="contact-content-wrapper">
          <div className="contact-columns">
            {/* Right Column - Contact Details + Map */}
            <div className="contact-details-column">
              <div className="contact-details">
                <div className="contact-card">
                  <div className="icon-wrapper">
                    <FaMapMarkerAlt className="icon" />
                  </div>
                  <div className="card-content">
                    <h3>Our Office</h3>
                    <p>#148/E, 2nd Floor, 17th Main Vijaynagar, Bangalore - 560040</p>
                  </div>
                </div>

                <div className="contact-card">
                  <div className="icon-wrapper">
                    <FaEnvelope className="icon" />
                  </div>
                  <div className="card-content">
                    <h3>Email Us</h3>
                    <p>ornateinteriord@gmail.com</p>
                  </div>
                </div>

                <div className="contact-card">
                  <div className="icon-wrapper">
                    <FaPhoneAlt className="icon" />
                  </div>
                  <div className="card-content">
                    <h3>Call Us</h3>
                    <p>+91 91488 24442 / 080-23409697</p>
                  </div>
                </div>
              </div>

              {/* Map Embed */}
              <div className="map-container">
                <iframe
                  title="Office Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.8962451381395!2d77.53483931482202!3d12.978474990851412!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae3ddb4a037b3f%3A0x6b77d6f5f3e0980!2sVijaynagar%2C%20Bengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
                  width="100%"
                  height="250"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                ></iframe>
              </div>
            </div>

            <div className="contact-form-column">
              <div className="form-header">
                <h3>Send Us a Message</h3>
                <p>We typically respond within 24 hours</p>
              </div>
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Your Name</label>
                  <input type="text" id="name" placeholder="Full Name" required />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Your Email</label>
                  <input type="email" id="email" placeholder="name@example.com" required />
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input type="text" id="subject" placeholder="How can we help?" />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Your Message</label>
                  <textarea id="message" placeholder="Type your message here..." rows={5} required></textarea>
                </div>

                {/* Mandatory Consent Checkbox */}
                <div className="form-group consent-group" style={{ display: "flex", alignItems: "flex-start", gap: "10px", margin: "16px 0" }}>
                  <input
                    type="checkbox"
                    id="contactConsent"
                    required
                    checked={consentChecked}
                    onChange={(e) => setConsentChecked(e.target.checked)}
                    style={{ marginTop: "4px", width: "18px", height: "18px", accentColor: "#881337" }}
                  />
                  <label htmlFor="contactConsent" style={{ fontSize: "0.85rem", color: "#4b5563", lineHeight: 1.4 }}>
                    I consent to Girija Kalyana collecting and processing my contact details in accordance with the{" "}
                    <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: "#881337", textDecoration: "underline" }}>
                      Privacy Policy (DPDP Act 2023)
                    </a>{" "}
                    and{" "}
                    <a href="/terms" target="_blank" rel="noopener noreferrer" style={{ color: "#881337", textDecoration: "underline" }}>
                      Terms and Conditions
                    </a>.
                  </label>
                </div>

                <div className="button-group">
                  <button
                    type="submit"
                    className="subbtn"
                    disabled={!consentChecked}
                    style={{
                      opacity: consentChecked ? 1 : 0.6,
                      cursor: consentChecked ? "pointer" : "not-allowed",
                      backgroundColor: "#881337",
                      color: "#fff",
                    }}
                  >
                    Send Message
                  </button>
                  <button
                    type="reset"
                    className="clear-btn"
                    onClick={() => setConsentChecked(false)}
                    style={{ backgroundColor: "transparent", color: "#881337", border: "1px solid #881337" }}
                  >
                    Clear Form
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ContactUs;
