import React from "react";
import { Link } from "react-router-dom";
import "../assets/scss/_03-Componentes/_Footer.scss";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo-container">
          <img
            src="/img/02-logos/logofooter1a.png"
            alt="Logo decorativo"
            className="footer-logo"
          />
        </div>
        <div className="contact-btn-container">
          <Link
            to="/ContactoUnificado"
            className="contact-btn"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            Contacto
          </Link>
        </div>
        <div className="footer-logo-container">
          <img
            src="/img/02-logos/logofooter1a.png"
            alt="Logo decorativo"
            className="footer-logo"
          />
        </div>
      </div>
      <div className="baroque-line-bottom"></div>
      <div className="copyright-container">
        <div className="copyright-content">
          <a
            href="https://alejandrobavaro.github.io/gondraworld-dev/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="copyright-icon">✧</span>
            <span>Gondra World Dev</span>
            <span className="copyright-icon">✧</span>
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
