import React, { useEffect } from "react";
import "./ContactUs.scss";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import { FaMapMarkerAlt, FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import SEOHead from "../common/SEOHead";

const ContactUs = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <SEOHead
        title="Contact Us"
        description="Get in touch with the Sangam Sathi team for support, profile queries, assistance services, and office visits."
        canonicalUrl="https://sangamsathi.com/contact"
      />
      <Navbar />

      <div className="contact-container">
        {/* Header Section */}
        <div className="contact-header">
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#0B192C', marginBottom: '12px' }}>
            Get In Touch
          </h1>
          <p>
            We are here to assist you. Feel free to reach out to us with any
            questions, concerns, or feedback regarding your matrimonial journey.
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
                    <p>ornateinteriod@gmail.com</p>
                  </div>
                </div>

                <div className="contact-card">
                  <div className="icon-wrapper">
                    <FaPhoneAlt className="icon" />
                  </div>
                  <div className="card-content">
                    <h3>Call Us</h3>
                    <p>+91 9148824442</p>
                  </div>
                </div>
              </div>

              <div className="map-container">
                <h3 style={{color: '#0B192C'}}>Our Location</h3>
                <div className="map-wrapper">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.041401723144!2d77.53727429999999!3d12.9692026!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae3dde6dcd1763%3A0xfd2c0043be1b3327!2sOrnate%20Interior%20Decor%20Pvt%20Ltd!5e0!3m2!1sen!2sin!4v1743154910866!5m2!1sen!2sin" 
                    width="100%" 
                    height="400" 
                    style={{ border: 0 }} 
                    allowFullScreen={false} 
                    loading="lazy"
                    title="Location Map"
                  ></iframe>
                </div>
              </div>
            </div>

            <div className="contact-form-column">
              <div className="form-header">
                <h3>Send Us a Message</h3>
                <p>We typically respond within 24 hours</p>
              </div>
              <form className="contact-form" onSubmit={(e) => { e.preventDefault(); alert('Thank you for contacting Sangam Sathi. We will respond shortly.'); }}>
                <div className="form-group">
                  <label htmlFor="name">Your Name</label>
                  <input type="text" id="name" placeholder="John Doe" required />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Your Email</label>
                  <input type="email" id="email" placeholder="john@example.com" required />
                </div>
                
                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input type="text" id="subject" placeholder="How can we help?" required />
                </div>
                
                <div className="form-group">
                  <label htmlFor="message">Your Message</label>
                  <textarea id="message" placeholder="Type your message here..." rows={5} required></textarea>
                </div>

                <div className="form-group consent-group" style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', margin: '16px 0' }}>
                  <input type="checkbox" id="consent" required style={{ width: '18px', height: '18px', accentColor: '#0B192C', marginTop: '2px' }} />
                  <label htmlFor="consent" style={{ fontSize: '0.85rem', color: '#475569', cursor: 'pointer', lineHeight: 1.5 }}>
                    I consent to the collection and processing of my contact information in accordance with the{' '}
                    <Link to="/privacy-policy" style={{ color: '#0B192C', fontWeight: 600 }}>Privacy Policy</Link>.
                  </label>
                </div>
                
                <div className="button-group">
                  <button type="submit" className="subbtn">
                    Send Message
                  </button>
                  <button 
                    type="reset" 
                    className="clear-btn"
                    style={{backgroundColor: 'transparent', color: '#000', border: '1px solid #0B192C'}}
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
