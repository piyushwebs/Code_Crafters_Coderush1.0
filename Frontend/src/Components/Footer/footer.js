import React from "react";
import {
  Brain,
  Shield,
  Heart,
  Mail,
  Phone,
  MapPin,
  FileText,
  Users,
  BookOpen,
  Activity,
} from "lucide-react";
import "./footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        {/* Left Section */}
        <div className="company-info">
          <div className="company-header">
            <div className="company-icon">
              <Brain className="icon-white" />
            </div>
            <div>
              <h3 className="company-title">NeuroDetect AI</h3>
              <p className="company-subtitle">Early Detection Technology</p>
            </div>
          </div>

          <p className="company-description">
            Pioneering EEG-based early detection of schizophrenia through
            advanced deep learning algorithms. Our CNN and Transformer models
            process neurophysiological patterns to enable faster, more accurate
            diagnosis.
          </p>

          <div className="compliance">
            <Shield className="icon-green" />
            <span>HIPAA Compliant &amp; FDA Approved</span>
          </div>

          <div className="badges">
            <div className="badge">88.3% Accuracy</div>
            <div className="badge">Real-time Processing</div>
          </div>
        </div>

        {/* Right Section */}
        <div className="footer-links">
          {/* Platform */}
          <div>
            <h2 className="link-heading">Platform</h2>
            <ul className="link-list">
              <li>
                <a href="#">
                  <Activity className="icon-small" /> EEG Analysis
                </a>
              </li>
              <li>
                <a href="#">
                  <Brain className="icon-small" /> Deep Learning Models
                </a>
              </li>
              <li>
                <a href="#">
                  <Users className="icon-small" /> Patient Dashboard
                </a>
              </li>
              <li>
                <a href="#">
                  <FileText className="icon-small" /> Clinical Reports
                </a>
              </li>
              <li>
                <a href="#">
                  <BookOpen className="icon-small" /> Documentation
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h2 className="link-heading">Get in touch</h2>
            <div className="contact-list">
              <div className="contact-item">
                <Phone className="icon-blue" />
                <span>+1-555-NEURO-AI</span>
              </div>
              <div className="contact-item">
                <Mail className="icon-blue" />
                <span>support@neurodetect.ai</span>
              </div>
              <div className="contact-item vertical">
                <MapPin className="icon-blue" />
                <div>
                  <p>NeuroTech Research Center</p>
                  <p className="address">Medical District, NY 10001</p>
                </div>
              </div>

              <div className="emergency">
                <Heart className="icon-red-small" />
                <span className="emergency-text">
                  24/7 Emergency: +1-555-911-NEURO
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <p className="footer-bottom">
        Copyright {new Date().getFullYear()} ©{" "}
        <strong className="brand">NeuroDetect AI</strong>. All Rights Reserved.{" "}
        <span className="dot">•</span>
        <span className="tagline">Advancing Early Neurological Detection</span>
      </p>
    </footer>
  );
};

export default Footer;
