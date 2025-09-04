import React, { useState } from 'react';
import '../assets/scss/_03-Componentes/_Login.scss';

/**
 * COMPONENTE: Login Premium
 * PROPÓSITO: Pantalla de acceso elegante inspirada en el diseño de contacto
 * CONEXIONES: 
 * - Diseño premium con elementos nupciales
 * - Animaciones y transiciones suaves
 * - Experiencia de usuario refinada
 */
const Login = ({ onLoginSuccess }) => {
  // ESTADO: Para almacenar la clave ingresada por el usuario
  const [clave, setClave] = useState('');
  
  // ESTADO: Para controlar mensajes de error
  const [error, setError] = useState('');
  
  // ESTADO: Para mostrar/ocultar la clave
  const [mostrarClave, setMostrarClave] = useState(false);
  
  // ESTADO: Para animación de carga
  const [cargando, setCargando] = useState(false);
  
  // CONSTANTE: Clave correcta
  const CLAVE_CORRECTA = 'boda';

  // FUNCIÓN: Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar la clave
    if (clave.trim() === '') {
      setError('Por favor ingresa la palabra clave');
      return;
    }
    
    setCargando(true);
    
    // Simular delay para mejor UX
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (clave.toLowerCase() === CLAVE_CORRECTA.toLowerCase()) {
      // Clave correcta
      localStorage.setItem('accesoPermitido', 'true');
      setError('');
      onLoginSuccess();
    } else {
      // Clave incorrecta
      setError('Palabra clave incorrecta');
      setClave('');
    }
    
    setCargando(false);
  };

  // FUNCIÓN: Limpiar error cuando el usuario empiece a escribir
  const handleClaveChange = (e) => {
    setClave(e.target.value);
    if (error) setError('');
  };

  return (
    <section className="unified-login-section">
      {/* Contenedor principal */}
      <div className="unified-login-container">
        {/* Encabezado con logo y título */}
        <div className="unified-login-header">
          <div className="unified-logo-container">
            <img
              src="/img/02-logos/logo-bodaaleyfabi1d.png"
              alt="Logo Boda Alejandro y Fabiola"
              className="unified-logo"
            />
          </div>

          <div className="unified-login-title-container">
            <h1 className="unified-main-title">
              <i className="bi bi-heart-fill" /> Boda Ale & Fabi <i className="bi bi-heart-fill" />
            </h1>
            <h2 className="unified-subtitle">Sistema de Invitaciones</h2>
            <div className="unified-divider"></div>
            <p className="unified-instruction">
              Ingresa la palabra clave para acceder al sistema
            </p>
          </div>
        </div>

        {/* Formulario de login */}
        <div className="unified-form-container">
          <form onSubmit={handleSubmit} className="unified-login-form">
            <div className="form-group">
              <label htmlFor="clave" className="form-label">
                <i className="bi bi-key-fill" /> Palabra Secreta
              </label>
              <div className="input-with-icon">
                <input
                  type={mostrarClave ? "text" : "password"}
                  id="clave"
                  value={clave}
                  onChange={handleClaveChange}
                  placeholder="Escribe la palabra clave aquí..."
                  className={`form-input ${error ? 'input-error' : ''}`}
                  autoComplete="off"
                  disabled={cargando}
                />
                <button
                  type="button"
                  className="btn-toggle-visibilidad"
                  onClick={() => setMostrarClave(!mostrarClave)}
                  title={mostrarClave ? 'Ocultar clave' : 'Mostrar clave'}
                  disabled={cargando}
                >
                  <i className={`bi ${mostrarClave ? 'bi-eye-fill' : 'bi-eye-slash-fill'}`} />
                </button>
              </div>
              {error && (
                <div className="form-error-message">
                  <i className="bi bi-exclamation-triangle-fill" /> {error}
                </div>
              )}
            </div>

            <button 
              type="submit" 
              className={`form-submit-btn ${cargando ? 'loading' : ''}`}
              disabled={cargando}
            >
              {cargando ? (
                <>
                  <span className="submit-spinner"></span>
                  Verificando acceso...
                </>
              ) : (
                <>
                  <i className="bi bi-door-open-fill" /> Ingresar al Sistema
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer decorativo */}
        <div className="unified-login-footer">
          <div className="heart-divider">
            <i className="bi bi-hearts" />
          </div>
          <p className="welcome-message">
            Con amor, Ale & Fabi
          </p>
          <p className="date-message">
            23 de Noviembre, 2025
          </p>
        </div>
      </div>

      {/* Elementos decorativos de fondo */}
      <div className="login-background-elements">
        <div className="deco-flower deco-1">🌸</div>
        <div className="deco-flower deco-2">🌹</div>
        <div className="deco-flower deco-3">🌺</div>
        <div className="deco-ring">💍</div>
        <div className="deco-heart">💖</div>
      </div>
    </section>
  );
};

export default Login;