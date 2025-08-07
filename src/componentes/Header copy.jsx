import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import { BsList, BsEnvelope, BsPeopleFill, BsPersonCheck, BsCardText, BsSend } from "react-icons/bs";
import "../assets/scss/_03-Componentes/_Header.scss";

const Header = () => {
  // Estado para controlar el menú móvil
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Hook para obtener la ruta actual
  const location = useLocation();

  // Función para alternar el menú móvil
  const handleToggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  // Rutas públicas (ContactoUnificado)
  const publicLinks = [
    { path: "/ContactoUnificado", icon: <BsEnvelope />, label: "ContactoUnificado" }
  ];

  // Rutas de organización (área privada)
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

  // Mapeo de pasos a rutas
  const stepRoutes = [
    { path: "/organizacion/invitados", step: 1 }, // Paso 1
    { path: "/organizacion/previsualizar-invitacion", step: 2 }, // Paso 2
    { path: "/enviar-invitacion", step: 3 }, // Paso 3
    { path: "/organizacion/confirmaciones", step: 4 }, // Paso 4 (asumiendo que existe esta ruta)
    { path: "/organizacion/ListadeConfirmaciones", step: 5 } // Paso 5
  ];

  // Determina el paso actual basado en la ruta
  const getCurrentStep = () => {
    if (location.pathname === "/" || location.pathname.includes("invitados")) return 1;
    if (location.pathname.includes("crear-invitacion") || location.pathname.includes("previsualizar")) return 2;
    if (location.pathname.includes("enviar-invitacion")) return 3;
    if (location.pathname.includes("confirmar/")) return 4;
    if (location.pathname.includes("confirmaciones")) return 5;
    return 0;
  };

  // Obtiene la ruta correspondiente a un paso específico
  const getRouteForStep = (step) => {
    const route = stepRoutes.find(item => item.step === step);
    return route ? route.path : "/";
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

          {/* Botón menú móvil */}
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            onClick={handleToggleMobileMenu}
            className="menu-toggle"
          >
            <BsList className="menu-icon" />
          </Navbar.Toggle>

          {/* Contenido del menú */}
          <Navbar.Collapse
            id="basic-navbar-nav"
            className={`navbar-menu ${isMobileMenuOpen ? "open" : ""}`}
          >
            <Nav className="ms-auto">
              {/* Enlace a Inicio */}
              <Nav.Link 
                as={Link} 
                to="/" 
                active={location.pathname === "/"}
                className="nav-link"
              >
                Inicio
              </Nav.Link>

              {/* Enlaces de organización */}
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

              {/* Enlaces públicos */}
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

      {/* Decoración inferior */}
      <div className="header-decoration-bottom"></div>

      {/* Barra de progreso de pasos - Versión mejorada */}
      <div className="steps-progress">
        {/* Paso 1 - Lista de Invitados */}
        <Link 
          to={getRouteForStep(1)} 
          className={`step ${getCurrentStep() >= 1 ? 'active' : ''}`}
        >
          <span className="step-number">1</span>
          <span className="step-label">Lista Invitados</span>
        </Link>
        
        {/* Paso 2 - Diseñar Invitación */}
        <Link 
          to={getRouteForStep(2)} 
          className={`step ${getCurrentStep() >= 2 ? 'active' : ''}`}
        >
          <span className="step-number">2</span>
          <span className="step-label">Diseñar Invitación</span>
        </Link>
        
        {/* Paso 3 - Enviar Invitaciones */}
        <Link 
          to={getRouteForStep(3)} 
          className={`step ${getCurrentStep() >= 3 ? 'active' : ''}`}
        >
          <span className="step-number">3</span>
          <span className="step-label">Enviar Invitaciones</span>
        </Link>
        
        {/* Paso 4 - Confirmaciones */}
        <Link 
          to={getRouteForStep(4)} 
          className={`step ${getCurrentStep() >= 4 ? 'active' : ''}`}
        >
          <span className="step-number">4</span>
          <span className="step-label">Confirmaciones</span>
        </Link>
        
        {/* Paso 5 - Lista Confirmados */}
        <Link 
          to={getRouteForStep(5)} 
          className={`step ${getCurrentStep() >= 5 ? 'active' : ''}`}
        >
          <span className="step-number">5</span>
          <span className="step-label">Lista Confirmados</span>
        </Link>
      </div>
    </header>
  );
};

export default Header;