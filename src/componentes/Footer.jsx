// =========================================================
// IMPORTS
// =========================================================

// React y hooks
import React from "react";
import { Link, useLocation } from "react-router-dom"; // Para navegación y detección de ruta

// Estilos del Footer
import "../assets/scss/_03-Componentes/_Footer.scss";

// =========================================================
// COMPONENTE Footer
// =========================================================
function Footer() {
  const location = useLocation(); // Hook para obtener la ruta actual

  // =========================================================
  // Mapeo de pasos y rutas igual que en el Header
  // =========================================================
  const stepRoutes = [
    { path: "/organizacion/invitados", step: 1, label: "1. Lista Invitados" },
    { path: "/organizacion/previsualizar-invitacion", step: 2, label: "2. Diseñar Invitación" },
    { path: "/enviar-invitacion", step: 3, label: "3. Enviar Invitaciones" },
    // { path: "/organizacion/confirmaciones", step: 4, label: "4. Confirmaciones" },
    // { path: "/organizacion/ListadeConfirmaciones", step: 5, label: "5. Lista Confirmados" }
  ];

  // =========================================================
  // Función que determina el paso actual según la URL
  // =========================================================
  const getCurrentStep = () => {
    if (location.pathname === "/" || location.pathname.includes("invitados")) return 1;
    if (location.pathname.includes("crear-invitacion") || location.pathname.includes("previsualizar")) return 2;
    if (location.pathname.includes("enviar-invitacion")) return 3;
    if (location.pathname.includes("confirmar/")) return 4;
    if (location.pathname.includes("confirmaciones")) return 5;
    return 0;
  };

  // =========================================================
  // Render del componente
  // =========================================================
  return (
    <footer className="footer">
      {/* =========================================================
          Barra de progreso interactiva (visible solo en desktop)
          - Igual que en el Header
          - Cada paso es un botón Link con label
      ========================================================= */}
      <div className="footer-progress">
        {stepRoutes.map((step) => (
          <Link
            key={step.step}
            to={step.path}
            className={`progress-step ${getCurrentStep() >= step.step ? 'active' : ''}`}
          >
            <span className="progress-label">{step.label}</span>
          </Link>
        ))}
      </div>

      {/* Contenido principal del Footer */}
      <div className="footer-content">
        {/* Logo decorativo izquierdo */}
        <div className="footer-logo-container">
          <img 
            src="/img/02-logos/logofooter1a.png"
            alt="Logo decorativo" 
            className="footer-logo"
          />
        </div>

        {/* Botón de contacto */}
        <div className="contact-btn-container">
          <Link 
            to="/ContactoUnificado" 
            className="contact-btn"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            Contacto
          </Link>
        </div>

        {/* Logo decorativo derecho */}
        <div className="footer-logo-container">
          <img 
            src="/img/02-logos/logofooter1a.png"
            alt="Logo decorativo" 
            className="footer-logo"
          />
        </div>
      </div>

      {/* Línea barroca animada inferior */}
      <div className="baroque-line-bottom"></div>

      {/* Créditos */}
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
