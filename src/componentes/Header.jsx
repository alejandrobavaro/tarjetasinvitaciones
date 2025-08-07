import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Navbar, Container } from "react-bootstrap";
import "../assets/scss/_03-Componentes/_Header.scss";

const Header = () => {
  const location = useLocation();

  // Mapeo de pasos a rutas
  const stepRoutes = [
    { path: "/organizacion/invitados", step: 1, label: "1. Lista Invitados" },
    { path: "/organizacion/previsualizar-invitacion", step: 2, label: "2. Diseñar Invitación" },
    { path: "/enviar-invitacion", step: 3, label: "3. Enviar Invitaciones" },
    { path: "/organizacion/confirmaciones", step: 4, label: "4. Confirmaciones" },
    { path: "/organizacion/ListadeConfirmaciones", step: 5, label: "5. Lista Confirmados" }
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

  return (
    <header className="app-header">
      {/* Decoración superior */}
      <div className="header-decoration-top"></div>

      {/* Barra de navegación principal integrada con progreso */}
      <Navbar expand="lg" className="header-navbar">
        <Container className="header-container">
          {/* Logo que lleva al inicio */}
          <Navbar.Brand as={Link} to="/" className="header-logo">
            <img
              src="/img/02-logos/logo-bodaaleyfabi1d.png"
              alt="Logo Boda Ale y Fabi"
              className="logo-image"
            />
          </Navbar.Brand>

          {/* Barra de progreso integrada */}
          <div className="steps-progress">
            {stepRoutes.map((step) => (
              <Link
                key={step.step}
                to={step.path}
                className={`step ${getCurrentStep() >= step.step ? 'active' : ''}`}
              >
                <span className="step-label">{step.label}</span>
              </Link>
            ))}
          </div>
        </Container>
      </Navbar>

      {/* Decoración inferior */}
      <div className="header-decoration-bottom"></div>
    </header>
  );
};

export default Header;