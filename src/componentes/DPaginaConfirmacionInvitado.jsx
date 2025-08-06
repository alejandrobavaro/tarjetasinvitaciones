import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../assets/scss/_03-Componentes/_EListaInvitadosqueConfirmaronAsistencia.scss';

const EListaInvitadosqueConfirmaronAsistencia = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invitado, setInvitado] = useState(null);
  const [confirmacion, setConfirmacion] = useState({
    asistencia: true,
    acompanantes: 0,
    alergias: '',
    mensaje: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const response = await fetch('/invitados.json');
        const data = await response.json();
        const invitadoEncontrado = data.grupos
          .flatMap(g => g.invitados)
          .find(i => i.id === parseInt(id));
        
        if (invitadoEncontrado) {
          setInvitado(invitadoEncontrado);
          // Cargar confirmación existente si existe
          const confirmaciones = JSON.parse(localStorage.getItem('confirmaciones') || '{}');
          if (confirmaciones[id]) {
            setConfirmacion(confirmaciones[id]);
          } else {
            // Establecer valores por defecto basados en la invitación
            setConfirmacion(prev => ({
              ...prev,
              acompanantes: invitadoEncontrado.acompanantes || 0
            }));
          }
        }
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const confirmaciones = JSON.parse(localStorage.getItem('confirmaciones') || '{}');
    confirmaciones[id] = {
      ...confirmacion,
      nombre: invitado.nombre,
      fechaConfirmacion: new Date().toISOString()
    };
    
    localStorage.setItem('confirmaciones', JSON.stringify(confirmaciones));
    setSubmitted(true);
  };

  if (loading) return <div className="loading">Cargando invitación...</div>;
  if (!invitado) return <div className="error">Invitación no encontrada</div>;
  if (submitted) {
    return (
      <div className="confirmacion-exitosa">
        <h1>¡Gracias por confirmar!</h1>
        <p>Hemos registrado tu asistencia a nuestra boda.</p>
        <button onClick={() => navigate('/')} className="btn-volver">
          Volver al inicio
        </button>
      </div>
    );
  }

  return (
    <div className="confirmacion-container">
      <div className="header">
        <h1>Confirmar Asistencia</h1>
        <p>Querido(a) <strong>{invitado.nombre}</strong>, por favor confirma tu asistencia:</p>
      </div>

      <form onSubmit={handleSubmit} className="form-confirmacion">
        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={confirmacion.asistencia}
              onChange={(e) => setConfirmacion({...confirmacion, asistencia: e.target.checked})}
            />
            <span className="checkmark"></span>
            Confirmo mi asistencia
          </label>
        </div>

        {confirmacion.asistencia && (
          <>
            <div className="form-group">
              <label>Número de acompañantes:</label>
              <input
                type="number"
                value={confirmacion.acompanantes}
                onChange={(e) => setConfirmacion({...confirmacion, acompanantes: parseInt(e.target.value) || 0})}
                min="0"
                max={invitado.acompanantes || 5}
              />
              <span className="hint">Máximo: {invitado.acompanantes || 5}</span>
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
              />
            </div>
          </>
        )}

        <button type="submit" className="btn-confirmar">
          {confirmacion.asistencia ? 'Confirmar Asistencia' : 'Lamentablemente no podré asistir'}
        </button>
      </form>
    </div>
  );
};

export default EListaInvitadosqueConfirmaronAsistencia;