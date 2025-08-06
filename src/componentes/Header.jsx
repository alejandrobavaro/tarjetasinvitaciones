import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import { BsList, BsEnvelope, BsPeopleFill, BsPersonCheck, BsCardText, BsSend } from "react-icons/bs";
import "../assets/scss/_03-Componentes/_Header.scss";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const handleToggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  // Rutas públicas
  const publicLinks = [
    { path: "/contacto", icon: <BsEnvelope />, label: "Contacto" }
  ];

  // Rutas de organización (sin números de paso)
  const orgLinks = [
    { 
      path: "/organizacion/invitados", 
      icon: <BsPeopleFill />, 
      label: "Lista Invitados"
    },
    { 
      path: "/organizacion/previsualizar-invitacion", 
      icon: <BsCardText />, 
      label: "Diseñar Invitación"
    },
    { 
      path: "/enviar-invitacion", 
      icon: <BsSend />, 
      label: "Enviar Invitaciones"
    },
    { 
      path: "/organizacion/ListadeConfirmaciones", 
      icon: <BsPersonCheck />, 
      label: "Ver Confirmaciones"
    }
  ];

  // Determinar paso actual
  const getCurrentStep = () => {
    if (location.pathname === "/" || location.pathname.includes("invitados")) return 1;
    if (location.pathname.includes("crear-invitacion") || location.pathname.includes("previsualizar")) return 2;
    if (location.pathname.includes("enviar-invitacion")) return 3;
    if (location.pathname.includes("confirmar/")) return 4;
    if (location.pathname.includes("confirmaciones")) return 5;
    return 0;
  };

  return (
    <header className="app-header">
      <div className="header-decoration-top"></div>

      {/* Barra de progreso de pasos */}
      <div className="steps-progress">
        <div className={`step ${getCurrentStep() >= 1 ? 'active' : ''}`}>1. Lista Invitados</div>
        <div className={`step ${getCurrentStep() >= 2 ? 'active' : ''}`}>2. Diseñar Invitación</div>
        <div className={`step ${getCurrentStep() >= 3 ? 'active' : ''}`}>3. Enviar Invitaciones</div>
        <div className={`step ${getCurrentStep() >= 4 ? 'active' : ''}`}>4. Confirmaciones</div>
        <div className={`step ${getCurrentStep() >= 5 ? 'active' : ''}`}>5. Lista Confirmados</div>
      </div>

      <Navbar expand="lg" className="header-navbar">
        <Container className="header-container">
          <Navbar.Brand as={Link} to="/" className="header-logo">
            <img
              src="/img/02-logos/logo-bodaaleyfabi1d.png"
              alt="Logo Boda Ale y Fabi"
              className="logo-image"
            />
          </Navbar.Brand>

          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            onClick={handleToggleMobileMenu}
            className="menu-toggle"
          >
            <BsList className="menu-icon" />
          </Navbar.Toggle>

          <Navbar.Collapse
            id="basic-navbar-nav"
            className={`navbar-menu ${isMobileMenuOpen ? "open" : ""}`}
          >
            <Nav className="ms-auto">
              <Nav.Link 
                as={Link} 
                to="/" 
                active={location.pathname === "/"}
                className="nav-link"
              >
                Inicio
              </Nav.Link>

              {orgLinks.map(({ path, icon, label }) => (
                <Nav.Link 
                  key={path} 
                  as={Link} 
                  to={path} 
                  active={location.pathname === path}
                  className="nav-link"
                >
                  {icon} <span className="link-label">{label}</span>
                </Nav.Link>
              ))}

              {publicLinks.map(({ path, icon, label }) => (
                <Nav.Link 
                  key={path} 
                  as={Link} 
                  to={path} 
                  active={location.pathname === path}
                  className="nav-link"
                >
                  {icon} <span className="link-label">{label}</span>
                </Nav.Link>
              ))}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className="header-decoration-bottom"></div>
    </header>
  );
};

export default Header;