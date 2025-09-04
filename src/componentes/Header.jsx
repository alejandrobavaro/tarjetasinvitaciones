import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Navbar, Container, Nav } from "react-bootstrap";
import {
  BsCardImage,        // Icono diseño invitación
  BsWhatsapp,         // Icono enviar invitaciones
  BsPeople,           // Icono lista invitados
  BsArrowRightCircle, 
  BsSendCheck,
  BsBoxArrowRight     // Icono para logout
} from "react-icons/bs";
import "../assets/scss/_03-Componentes/_Header.scss";

/**
 * COMPONENTE: Header
 * 
 * PROPÓSITO: Barra de navegación principal con acceso rápido a las secciones y logout
 * 
 * CAMBIOS PRINCIPALES:
 * - Agregado botón de logout
 * - Función para cerrar sesión
 * - Mantenida la estructura visual existente
 */
const Header = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // DEFINICIÓN DE ENLACES DE NAVEGACIÓN ACTUALIZADA
  const navLinks = [
    { 
      path: "/", 
      icon: <BsPeople />, 
      label: "Lista de Invitados",
      shortLabel: "Lista",
      tooltip: "Ver y gestionar la lista completa de invitados a la boda"
    },
    { 
      path: "/crear-invitacion", 
      icon: <BsArrowRightCircle />,
      label: "Crear y Enviar Invitación",
      shortLabel: "Crear Invitación", 
      tooltip: "Flujo completo de 5 pasos: diseñar, seleccionar, descargar y enviar invitaciones"
    }, 
    { 
      path: "/envio-masivo", 
      icon: <BsSendCheck />, 
      label: "Envío Masivo",
      shortLabel: "Masivo", 
      tooltip: "Enviar invitaciones a múltiples invitados a la vez"
    }
  ];

  // FUNCIÓN: Navegar a página
  const goToPage = (path) => {
    navigate(path);
  };

  // FUNCIÓN: Manejar logout
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <header className="app-header">
      {/* Decoración superior con efecto de flujo */}
      <div className="header-decoration-top"></div>

      {/* Barra de navegación principal */}
      <Navbar expand="lg" className="header-navbar">
        <Container className="header-container">
          {/* Logo con enlace a inicio */}
          <Navbar.Brand as={Link} to="/" className="header-logo">
            <img
              src="/img/02-logos/logo-bodaaleyfabi1d.png"
              alt="Logo Boda Ale y Fabi"
              className="logo-image"
            />
          </Navbar.Brand>

          {/* Botones de navegación rápida */}
          <Nav className="quick-access-buttons">
            {navLinks.map((link) => (
              <Nav.Link
                key={link.path}
                as={Link}
                to={link.path}
                onClick={() => goToPage(link.path)}
                className={`nav-button ${
                  location.pathname === link.path ? "active" : ""
                }`}
                title={link.tooltip}
                data-label={link.label}
              >
                <span className="icon">{link.icon}</span>
                <span className="nav-label">
                  {window.innerWidth < 768 ? link.label : link.shortLabel}
                </span>
              </Nav.Link>
            ))}
          </Nav>

          {/* Botón de logout */}
          <div className="logout-section">
            <button 
              onClick={handleLogout}
              className="btn-logout"
              title="Cerrar sesión"
            >
              <span className="logout-icon">
                <BsBoxArrowRight />
              </span>
              <span className="logout-text">
                {window.innerWidth < 768 ? "Salir" : "Cerrar sesión"}
              </span>
            </button>
          </div>
        </Container>
      </Navbar>

      {/* Decoración inferior con efecto de flujo */}
      <div className="header-decoration-bottom"></div>
    </header>
  );
};

export default Header;