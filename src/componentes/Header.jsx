import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Container, Button } from "react-bootstrap";
import {
  BsCardImage,        // Icono diseño invitación
  BsWhatsapp,         // Icono enviar invitaciones
  BsPeople,           // Icono lista invitados
} from "react-icons/bs";
import "../assets/scss/_03-Componentes/_Header.scss";

const Header = () => {
  const navigate = useNavigate();

  const goToPage = (path) => {
    navigate(path);
  };

  return (
    <header className="app-header">
      <div className="header-decoration-top"></div>
      <Navbar expand="lg" className="header-navbar">
        <Container className="header-container">
          <Navbar.Brand as={Link} to="/" className="header-logo">
            <img
              src="/img/02-logos/logo-bodaaleyfabi1d.png"
              alt="Logo Boda Ale y Fabi"
              className="logo-image"
            />
          </Navbar.Brand>
          <div className="quick-access-buttons">
            {/* Botón 1: Lista de Invitados */}
            <Button
              variant="link"
              onClick={() => goToPage("/")}
              className="nav-button"
              title="Lista de invitados"
            >
              <BsPeople className="icon" />
              <span className="d-none d-md-inline">Lista de Invitados</span>
            </Button>
            {/* Botón 2: Diseñar Invitación */}
            <Button
              variant="link"
              onClick={() => goToPage("/crear-invitacion")}
              className="nav-button"
              title="Diseñar invitación"
            >
              <BsCardImage className="icon" />
              <span className="d-none d-md-inline">Crear Tarjeta Invitación</span>
            </Button>
            {/* Botón 3: Enviar Invitaciones */}
            <Button
              variant="link"
              onClick={() => goToPage("/enviar-invitacion")}
              className="nav-button"
              title="Enviar invitaciones"
            >
              <BsWhatsapp className="icon" />
              <span className="d-none d-md-inline">Enviar Mensaje y Tarjeta</span>
            </Button>
          </div>
        </Container>
      </Navbar>
      <div className="header-decoration-bottom"></div>
    </header>
  );
};

export default Header;
