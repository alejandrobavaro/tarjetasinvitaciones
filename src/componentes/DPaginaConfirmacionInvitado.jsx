import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../assets/scss/_03-Componentes/_DPaginaConfirmacionInvitado.scss';
import { BsClipboard, BsCheckCircle } from 'react-icons/bs';

const DPaginaConfirmacionInvitado = () => {
  // 1. Estados iniciales
  const { id } = useParams();
  const navigate = useNavigate();
  const [invitado, setInvitado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 2. Estado para confirmación
  const [confirmacion, setConfirmacion] = useState({
    asistencia: true,
    acompanantes: 0,
    alergias: '',
    mensaje: ''
  });
  
  // 3. Estados para UI
  const [submitted, setSubmitted] = useState(false);
  const [linkCopiado, setLinkCopiado] = useState(false);
  const [linkGenerado, setLinkGenerado] = useState('');
  const [modoBusqueda, setModoBusqueda] = useState(false);
  const [nombreBuscado, setNombreBuscado] = useState('');

  // 4. Generar link único para el invitado
  const generarLinkConfirmacion = () => {
    return `${window.location.origin}/confirmar/${id}`;
  };

  // 5. Copiar link al portapapeles
  const copiarLinkConfirmacion = () => {
    navigator.clipboard.writeText(linkGenerado);
    setLinkCopiado(true);
    setTimeout(() => setLinkCopiado(false), 2000);
  };

  // 6. Cargar datos del invitado
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const response = await fetch('/invitados.json');
        if (!response.ok) throw new Error('Error cargando datos');
        
        const data = await response.json();
        const invitadoEncontrado = data.grupos
          .flatMap(g => g.invitados)
          .find(i => i.id === parseInt(id));

        if (!invitadoEncontrado) {
          setError('Invitación no encontrada');
          return;
        }

        setInvitado(invitadoEncontrado);
        
        // Cargar confirmación existente si existe
        const confirmaciones = JSON.parse(localStorage.getItem('confirmaciones') || '{}');
        if (confirmaciones[id]) {
          setConfirmacion(confirmaciones[id]);
        } else {
          setConfirmacion(prev => ({
            ...prev,
            acompanantes: invitadoEncontrado.acompanantes || 0
          }));
        }

        // Cargar o generar link
        const linksGenerados = JSON.parse(localStorage.getItem('linksConfirmacion') || '{}');
        const nuevoLink = linksGenerados[id] || generarLinkConfirmacion();
        setLinkGenerado(nuevoLink);
        
        if (!linksGenerados[id]) {
          linksGenerados[id] = nuevoLink;
          localStorage.setItem('linksConfirmacion', JSON.stringify(linksGenerados));
        }
      } catch (err) {
        console.error("Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id && id !== 'buscar') {
      cargarDatos();
    } else {
      setModoBusqueda(true);
      setLoading(false);
    }
  }, [id]);

  // 7. Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!invitado && !nombreBuscado.trim()) {
      setError('Por favor ingresa tu nombre');
      return;
    }

    const confirmaciones = JSON.parse(localStorage.getItem('confirmaciones') || '{}');
    const confirmacionId = id || `manual-${Date.now()}`;
    
    confirmaciones[confirmacionId] = {
      ...confirmacion,
      nombre: invitado ? invitado.nombre : nombreBuscado.trim(),
      fechaConfirmacion: new Date().toISOString(),
      confirmacionManual: !invitado
    };

    localStorage.setItem('confirmaciones', JSON.stringify(confirmaciones));
    window.dispatchEvent(new CustomEvent('confirmacionActualizada'));
    setSubmitted(true);
  };

  // 8. Manejar búsqueda manual
  const buscarInvitado = () => {
    if (!nombreBuscado.trim()) {
      setError('Por favor ingresa tu nombre completo');
      return;
    }
    setError(null);
  };

  // 9. Estados de carga/error
  if (loading) return <div className="loading">Cargando invitación...</div>;
  if (error && !modoBusqueda) return <div className="error">{error}</div>;

  // 10. Vista después de confirmar
  if (submitted) {
    return (
      <div className="confirmacion-exitosa">
        <BsCheckCircle className="icono-exito" />
        <h1>¡Confirmación exitosa!</h1>
        <p>Hemos registrado tu asistencia a nuestra boda.</p>
        <div className="detalles-confirmacion">
          <p><strong>Nombre:</strong> {confirmacion.nombre}</p>
          {confirmacion.asistencia && (
            <>
              <p><strong>Acompañantes:</strong> {confirmacion.acompanantes}</p>
              {confirmacion.alergias && <p><strong>Alergias:</strong> {confirmacion.alergias}</p>}
            </>
          )}
        </div>
        <button onClick={() => navigate('/')} className="btn-volver">
          Volver al inicio
        </button>
      </div>
    );
  }

  // 11. Vista principal
  return (
    <div className="confirmacion-container">
      <div className="header">
        <h1>Confirmar Asistencia</h1>
        
        {invitado ? (
          <p>Querido(a) <strong>{invitado.nombre}</strong>, por favor confirma tu asistencia:</p>
        ) : (
          <p>Por favor confirma tu asistencia:</p>
        )}

        {/* Sección para compartir link */}
        {invitado && (
          <div className="compartir-link">
            <p>Tu link personalizado para compartir:</p>
            <div className="link-container">
              <input
                type="text"
                value={linkGenerado}
                readOnly
                className="link-input"
              />
              <button
                onClick={copiarLinkConfirmacion}
                className="btn-copiar-link"
              >
                {linkCopiado ? '¡Copiado!' : <><BsClipboard /> Copiar</>}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Formulario de confirmación */}
      <form onSubmit={handleSubmit} className="form-confirmacion">
        {/* Campo de búsqueda para modo manual */}
        {modoBusqueda && (
          <div className="form-group">
            <label>Ingresa tu nombre completo:</label>
            <input
              type="text"
              value={nombreBuscado}
              onChange={(e) => setNombreBuscado(e.target.value)}
              placeholder="Ej: María González"
              required
            />
            {error && <span className="error-message">{error}</span>}
          </div>
        )}

        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={confirmacion.asistencia}
              onChange={(e) => setConfirmacion({...confirmacion, asistencia: e.target.checked})}
            />
            <span className="checkmark"></span>
            {confirmacion.asistencia ? 'Confirmo mi asistencia' : 'No podré asistir'}
          </label>
        </div>

        {confirmacion.asistencia && (
          <>
            <div className="form-group">
              <label>Número de acompañantes:</label>
              <input
                type="number"
                value={confirmacion.acompanantes}
                onChange={(e) => {
                  const max = invitado?.acompanantes || 5;
                  const value = Math.min(parseInt(e.target.value) || 0, max);
                  setConfirmacion({...confirmacion, acompanantes: value});
                }}
                min="0"
                max={invitado?.acompanantes || 5}
              />
              <span className="hint">Máximo permitido: {invitado?.acompanantes || 5}</span>
            </div>

            <div className="form-group">
              <label>Alergias o restricciones alimentarias:</label>
              <input
                type="text"
                value={confirmacion.alergias}
                onChange={(e) => setConfirmacion({...confirmacion, alergias: e.target.value})}
                placeholder="Ninguna (si no aplica)"
              />
            </div>

            <div className="form-group">
              <label>Mensaje para los novios (opcional):</label>
              <textarea
                value={confirmacion.mensaje}
                onChange={(e) => setConfirmacion({...confirmacion, mensaje: e.target.value})}
                rows="3"
                placeholder="Escribe tu mensaje aquí..."
              />
            </div>
          </>
        )}

        <button type="submit" className="btn-confirmar">
          {confirmacion.asistencia ? 'Confirmar Asistencia' : 'Confirmar No Asistencia'}
        </button>
      </form>
    </div>
  );
};

export default DPaginaConfirmacionInvitado;