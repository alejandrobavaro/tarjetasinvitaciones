import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Navbar, Container, Nav } from "react-bootstrap";
import {
  BsCardImage,        // Icono diseño invitación
  BsWhatsapp,         // Icono enviar invitaciones
  BsPeople,           // Icono lista invitados
} from "react-icons/bs";
import "../assets/scss/_03-Componentes/_Header.scss";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Definición de los enlaces de navegación con tooltips
  const navLinks = [
    { 
      path: "/", 
      icon: <BsPeople />, 
      label: "Lista de Invitados",
      shortLabel: "Lista de Invitados",
      tooltip: "Ver y gestionar la lista completa de invitados a la boda"
    },
    { 
      path: "/crear-invitacion", 
      icon: <BsCardImage />, 
      label: "Crear Tarjeta Invitación",
      shortLabel: "Crear Tarjeta Invitación",
      tooltip: "Diseña una invitación personalizada para tus invitados"
    },
    { 
      path: "/enviar-invitacion", 
      icon: <BsWhatsapp />, 
      label: "Enviar Mensaje y Tarjeta",
      shortLabel: "Enviar Mensaje y Tarjeta",
      tooltip: "Envía las invitaciones diseñadas a tus invitados por WhatsApp"
    }
  ];

  const goToPage = (path) => {
    navigate(path);
  };

  return (
    <header className="app-header">
      {/* Decoración superior */}
      <div className="header-decoration-top"></div>

      {/* Barra de navegación principal */}
      <Navbar expand="lg" className="header-navbar">
        <Container className="header-container">
          {/* Logo */}
          <Navbar.Brand as={Link} to="/" className="header-logo">
            <img
              src="/img/02-logos/logo-bodaaleyfabi1d.png"
              alt="Logo Boda Ale y Fabi"
              className="logo-image"
            />
          </Navbar.Brand>

          {/* Botones de navegación */}
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

      {/* Decoración inferior */}
      <div className="header-decoration-bottom"></div>
    </header>
  );
};

export default Header;