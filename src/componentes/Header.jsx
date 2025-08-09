// ==============================================
// IMPORTS NECESARIOS
// ==============================================
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Container, Button } from "react-bootstrap";
import { 
  BsClipboardCheck,   // Icono confirmación manual
  BsListCheck,        // Icono lista confirmados
  BsCardImage,        // Icono diseño invitación
  BsWhatsapp,         // Icono enviar invitaciones
  BsPeople,           // Icono lista invitados
  BsDatabase          // Icono backup
} from "react-icons/bs";
import "../assets/scss/_03-Componentes/_Header.scss";

// ==============================================
// COMPONENTE HEADER - VERSIÓN MEJORADA
// ==============================================
const Header = () => {
  // Hook para navegación programática
  const navigate = useNavigate();

  // ============================================
  // FUNCIONES DE NAVEGACIÓN
  // ============================================
  const goToPage = (path) => {
    navigate(path);
  };

  // ============================================
  // RENDERIZADO DEL COMPONENTE
  // ============================================
  return (
    <header className="app-header">
      {/* Decoración superior - Elemento puramente visual */}
      <div className="header-decoration-top"></div>

      {/* Contenedor principal del header */}
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

          {/* Grupo de botones de acceso rápido */}
          <div className="quick-access-buttons">
            
            {/* Botón 1: Lista de Invitados */}
            <Button
              variant="link"
              onClick={() => goToPage("/")}
              className="nav-button"
              title="Lista de invitados"
            >
              <BsPeople className="icon" />
              <span className="d-none d-md-inline">Invitados</span>
            </Button>

            {/* Botón 2: Diseñar Invitación */}
            <Button
              variant="link"
              onClick={() => goToPage("/crear-invitacion")}
              className="nav-button"
              title="Diseñar invitación"
            >
              <BsCardImage className="icon" />
              <span className="d-none d-md-inline">Diseñar</span>
            </Button>

            {/* Botón 3: Enviar Invitaciones */}
            <Button
              variant="link"
              onClick={() => goToPage("/enviar-invitacion")}
              className="nav-button"
              title="Enviar invitaciones"
            >
              <BsWhatsapp className="icon" />
              <span className="d-none d-md-inline">Enviar</span>
            </Button>

            {/* Botón 4: Confirmar Asistencia */}
            <Button
              variant="link"
              onClick={() => goToPage("/confirmar/buscar")}
              className="nav-button"
              title="Confirmar asistencia"
            >
              <BsClipboardCheck className="icon" />
              <span className="d-none d-md-inline">Confirmar</span>
            </Button>

            {/* Botón 5: Lista Confirmados */}
            <Button
              variant="link"
              onClick={() => goToPage("/confirmados")}
              className="nav-button"
              title="Ver confirmados"
            >
              <BsListCheck className="icon" />
              <span className="d-none d-md-inline">Confirmados</span>
            </Button>

            {/* Botón 6: Backup de Datos */}
            <Button
              variant="link"
              onClick={() => goToPage("/backup")}
              className="nav-button"
              title="Backup de datos"
            >
              <BsDatabase className="icon" />
              <span className="d-none d-md-inline">Backup</span>
            </Button>
          </div>
        </Container>
      </Navbar>

      {/* Decoración inferior - Elemento puramente visual */}
      <div className="header-decoration-bottom"></div>
    </header>
  );
};

export default Header;