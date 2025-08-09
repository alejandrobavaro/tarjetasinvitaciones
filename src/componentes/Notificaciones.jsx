import React, { useState, useEffect } from 'react';
import { BsBell, BsBellFill } from 'react-icons/bs';
import '../assets/scss/_03-Componentes/_Notificaciones.scss';

const Notificaciones = () => {
  const [confirmaciones, setConfirmaciones] = useState([]);
  const [nuevasConfirmaciones, setNuevasConfirmaciones] = useState([]);
  const [mostrarNotificaciones, setMostrarNotificaciones] = useState(false);
  const [notificacionesLeidas, setNotificacionesLeidas] = useState([]);

  // Cargar confirmaciones y escuchar cambios
  useEffect(() => {
    const cargarConfirmaciones = () => {
      const confirmacionesData = JSON.parse(localStorage.getItem('confirmaciones') || '{}');
      const lista = Object.values(confirmacionesData);
      setConfirmaciones(lista);
    };

    cargarConfirmaciones();

    // Escuchar eventos de nuevas confirmaciones
    const handleNuevaConfirmacion = () => {
      const confirmacionesData = JSON.parse(localStorage.getItem('confirmaciones') || '{}');
      const nuevas = Object.values(confirmacionesData)
        .filter(conf => !confirmaciones.some(c => c.fechaConfirmacion === conf.fechaConfirmacion));
      
      if (nuevas.length > 0) {
        setNuevasConfirmaciones(prev => [...nuevas, ...prev]);
        // Opcional: Notificación del navegador
        if (Notification.permission === 'granted') {
          new Notification(`Nueva confirmación: ${nuevas[0].nombre}`, {
            body: nuevas[0].asistencia ? 'Confirmó asistencia' : 'No podrá asistir'
          });
        }
      }
    };

    window.addEventListener('confirmacionActualizada', handleNuevaConfirmacion);
    return () => window.removeEventListener('confirmacionActualizada', handleNuevaConfirmacion);
  }, [confirmaciones]);

  // Solicitar permisos para notificaciones
  useEffect(() => {
    if (Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  }, []);

  // Marcar como leídas
  const marcarComoLeidas = () => {
    setNotificacionesLeidas([...nuevasConfirmaciones, ...notificacionesLeidas]);
    setNuevasConfirmaciones([]);
  };

  return (
    <div className="notificaciones-container">
      <button 
        className="boton-notificaciones"
        onClick={() => {
          setMostrarNotificaciones(!mostrarNotificaciones);
          if (mostrarNotificaciones) marcarComoLeidas();
        }}
      >
        {nuevasConfirmaciones.length > 0 ? (
          <BsBellFill className="icono-notificacion con-notificaciones" />
        ) : (
          <BsBell className="icono-notificacion" />
        )}
        {nuevasConfirmaciones.length > 0 && (
          <span className="contador-notificaciones">{nuevasConfirmaciones.length}</span>
        )}
      </button>

      {mostrarNotificaciones && (
        <div className="panel-notificaciones">
          <div className="cabecera-notificaciones">
            <h3>Confirmaciones Recientes</h3>
            <button onClick={marcarComoLeidas} className="btn-marcar-leidas">
              Marcar como leídas
            </button>
          </div>

          {[...nuevasConfirmaciones, ...confirmaciones]
            .slice(0, 10) // Mostrar solo las últimas 10
            .map((confirmacion, index) => (
              <div 
                key={`${confirmacion.fechaConfirmacion}-${index}`} 
                className={`notificacion ${nuevasConfirmaciones.some(n => n.fechaConfirmacion === confirmacion.fechaConfirmacion) ? 'nueva' : ''}`}
              >
                <div className="notificacion-contenido">
                  <strong>{confirmacion.nombre}</strong>
                  <span className={`estado ${confirmacion.asistencia ? 'asistencia' : 'no-asistencia'}`}>
                    {confirmacion.asistencia ? 'Confirmó asistencia' : 'No asistirá'}
                  </span>
                  {confirmacion.acompanantes > 0 && confirmacion.asistencia && (
                    <span className="acompanantes">+{confirmacion.acompanantes} acompañantes</span>
                  )}
                  <span className="fecha">
                    {new Date(confirmacion.fechaConfirmacion).toLocaleString()}
                  </span>
                </div>
              </div>
            ))
          }

          {confirmaciones.length === 0 && (
            <div className="sin-notificaciones">
              No hay confirmaciones recientes
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Notificaciones;