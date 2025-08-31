import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Navbar, Container, Nav } from "react-bootstrap";
import {
  BsCardImage,        // Icono diseño invitación
  BsWhatsapp,         // Icono enviar invitaciones
  BsPeople,           // Icono lista invitados
  BsArrowRightCircle  // NUEVO: Icono para flujo completo
} from "react-icons/bs";
import "../assets/scss/_03-Componentes/_Header.scss";

/**
 * COMPONENTE: Header
 * 
 * PROPÓSITO: Barra de navegación principal con acceso rápido a las secciones
 * 
 * CAMBIOS PRINCIPALES:
 * - Reemplazada ruta individual de envío por flujo completo de creación
 * - Actualizados tooltips y descripciones
 * - Mantenida la estructura visual existente
 */
const Header = () => {
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
      icon: <BsArrowRightCircle />, // Icono actualizado
      label: "Crear y Enviar Invitación",
      shortLabel: "Crear Invitación", 
      tooltip: "Flujo completo de 5 pasos: diseñar, seleccionar, descargar y enviar invitaciones"
    }
  ];

  // FUNCIÓN: Navegar a página
  const goToPage = (path) => {
    navigate(path);
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
        </Container>
      </Navbar>

      {/* Decoración inferior con efecto de flujo */}
      <div className="header-decoration-bottom"></div>
    </header>
  );
};

export default Header;