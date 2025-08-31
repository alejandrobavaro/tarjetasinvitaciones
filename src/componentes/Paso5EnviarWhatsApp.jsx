import React, { useState, useEffect } from 'react';
import '../assets/scss/_03-Componentes/_Paso5EnviarWhatsApp.scss';
import { useNavigate } from 'react-router-dom';

/**
 * COMPONENTE: Paso5EnviarWhatsApp
 * PROPÓSITO: Quinto y último paso del flujo - Integración con WhatsApp y finalización
 * CONEXIONES: 
 * - Recibe props del componente principal PasosInvitacion
 * - Abre WhatsApp con el mensaje predefinido (usando enlaces fijos)
 * - Actualiza el estado del invitado en localStorage
 * - Registra el envío en el historial
 * - Permite finalizar el proceso o reiniciarlo
 */
const Paso5EnviarWhatsApp = ({ 
  disenoInvitacion, 
  invitadoSeleccionado, 
  finalizarProceso 
}) => {
  // Hook de navegación
  const navigate = useNavigate();
  
  // ESTADO: Control del proceso de envío
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState(null);
  const [historialEnvio, setHistorialEnvio] = useState(null);

  // CONSTANTES: Enlaces fijos (igual que en Paso 4)
  const ENLACE_CONFIRMACION = 'https://confirmarasistenciaevento.netlify.app/';
  const ENLACE_UBICACION = 'https://noscasamos-aleyfabi.netlify.app/ubicacion';

  // EFECTO: Cargar historial de envíos al montar el componente
  useEffect(() => {
    const historial = JSON.parse(localStorage.getItem('historialWhatsApp') || '[]');
    setHistorialEnvio(historial);
  }, []);

  // FUNCIÓN: Generar mensaje para WhatsApp (actualizado con enlaces fijos)
  const generarMensajeWhatsApp = () => {
    if (!invitadoSeleccionado || !disenoInvitacion) return '';
    
    return `¡Hola ${invitadoSeleccionado.nombre}! 🎉\n\n` +
      `Te invitamos a celebrar nuestro amor:\n` +
      `💍 ${disenoInvitacion.nombresNovios}\n` +
      `📅 ${disenoInvitacion.fecha}\n` +
      `🕒 ${disenoInvitacion.hora}\n` +
      `📍 ${disenoInvitacion.lugar.split('\n')[0]}\n\n` +
      `---- IMAGEN DE LA INVITACIÓN AQUÍ ----\n\n` +
      `*Información importante:*\n` +
      `🔹 Cómo llegar: ${ENLACE_UBICACION}\n` +
      `🔹 Vestimenta: ${disenoInvitacion.codigoVestimenta}\n\n` +
      `*Tu presencia es nuestro mejor regalo*\n` +
      `Si deseas contribuir a nuestra luna de miel:\n` +
      `💌 ${disenoInvitacion.detallesRegalo}\n\n` +
      `*Confirmá tu asistencia aquí:*\n` +
      `👉 ${ENLACE_CONFIRMACION}\n\n` +
      `Con amor,\n${disenoInvitacion.nombresNovios.split('de ')[1] || disenoInvitacion.nombresNovios}`;
  };

  // FUNCIÓN: Abrir WhatsApp con el mensaje predefinido
  const abrirWhatsApp = () => {
    if (!invitadoSeleccionado) {
      setErrorEnvio('No hay invitado seleccionado');
      return;
    }

    setEnviando(true);
    setErrorEnvio(null);

    try {
      const mensaje = generarMensajeWhatsApp();
      const telefono = invitadoSeleccionado.telefono.replace(/\D/g, ''); // Solo números
      
      // Validar número de teléfono
      if (!telefono || telefono.length < 8) {
        throw new Error('Número de teléfono inválido');
      }
      
      // Formatear URL de WhatsApp
      const urlWhatsApp = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
      
      // Abrir en nueva pestaña
      window.open(urlWhatsApp, '_blank');
      
      // Registrar envío en historial
      registrarEnvio();
      
      setEnviado(true);
      
    } catch (error) {
      console.error('Error al abrir WhatsApp:', error);
      setErrorEnvio(error.message || 'Error al abrir WhatsApp. Verifica que el número sea válido.');
    } finally {
      setEnviando(false);
    }
  };

  // FUNCIÓN: Registrar el envío en el historial y actualizar estado
  const registrarEnvio = () => {
    if (!invitadoSeleccionado) return;

    // Actualizar estado de envío
    const estadosEnvio = JSON.parse(localStorage.getItem('estadosEnvio') || '{}');
    estadosEnvio[invitadoSeleccionado.id] = true;
    localStorage.setItem('estadosEnvio', JSON.stringify(estadosEnvio));

    // Registrar en historial
    const historial = JSON.parse(localStorage.getItem('historialWhatsApp') || '[]');
    const nuevoRegistro = {
      id: Date.now(),
      invitadoId: invitadoSeleccionado.id,
      invitadoNombre: invitadoSeleccionado.nombre,
      telefono: invitadoSeleccionado.telefono,
      grupo: invitadoSeleccionado.grupoNombre,
      fechaEnvio: new Date().toISOString(),
      mensaje: generarMensajeWhatsApp()
    };

    const nuevoHistorial = [...historial, nuevoRegistro];
    localStorage.setItem('historialWhatsApp', JSON.stringify(nuevoHistorial));
    setHistorialEnvio(nuevoHistorial);
  };

  // FUNCIÓN: Obtener último envío para este invitado
  const getUltimoEnvio = () => {
    if (!historialEnvio || !invitadoSeleccionado) return null;
    
    return historialEnvio
      .filter(envio => envio.invitadoId === invitadoSeleccionado.id)
      .sort((a, b) => new Date(b.fechaEnvio) - new Date(a.fechaEnvio))[0];
  };

  // FUNCIÓN: Formatear fecha
  const formatearFecha = (fechaISO) => {
    return new Date(fechaISO).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // FUNCIÓN: Finalizar proceso y navegar a la lista de invitados
  const handleFinalizarProceso = () => {
    // Si se proporciona una función de finalización, usarla
    if (finalizarProceso) {
      finalizarProceso();
    } else {
      // Navegar directamente a la lista de invitados en la ruta correcta
      navigate('/organizacion/invitados', { replace: true });
    }
  };

  // RENDER: Información de envío previo
  const renderInfoEnvioPrevio = () => {
    const ultimoEnvio = getUltimoEnvio();
    
    if (!ultimoEnvio) return null;

    return (
      <div className="info-envio-previo">
        <h4>📨 Envío Previo Registrado:</h4>
        <div className="detalles-envio">
          <p><strong>Fecha:</strong> {formatearFecha(ultimoEnvio.fechaEnvio)}</p>
          <p><strong>Destinatario:</strong> {ultimoEnvio.invitadoNombre}</p>
          <p><strong>Teléfono:</strong> {ultimoEnvio.telefono}</p>
          <p><strong>Estado:</strong> <span className="estado-enviado">✓ Invitación enviada</span></p>
        </div>
        <p className="nota-reenvio">
          💡 Si vuelves a enviar, se actualizará la fecha del último envío.
        </p>
      </div>
    );
  };

  // RENDER PRINCIPAL del componente
  return (
    <div className="paso5-enviar-whatsapp">
      <div className="instrucciones">
        <h2>Paso 5: Enviar por WhatsApp</h2>
        <p>Último paso: Abre WhatsApp and envía la invitación directamente.</p>
      </div>

      {/* Información del invitado */}
      {invitadoSeleccionado && (
        <div className="info-invitado">
          <h3>📋 Resumen del Envío</h3>
          <div className="detalles-invitado">
            <p><strong>Invitado:</strong> {invitadoSeleccionado.nombre}</p>
            <p><strong>Teléfono:</strong> {invitadoSeleccionado.telefono}</p>
            <p><strong>Grupo:</strong> {invitadoSeleccionado.grupoNombre}</p>
            {invitadoSeleccionado.acompanantes > 0 && (
              <p><strong>Acompañantes:</strong> {invitadoSeleccionado.acompanantes}</p>
            )}
          </div>
        </div>
      )}

      {/* Panel de enlaces fijos */}
      <div className="panel-enlaces">
        <h4>🔗 Enlaces Incluidos en el Mensaje:</h4>
        <div className="enlaces-container">
          <div className="enlace-item">
            <strong>Confirmar Asistencia:</strong>
            <span className="enlace-texto">{ENLACE_CONFIRMACION}</span>
          </div>
          <div className="enlace-item">
            <strong>Cómo Llegar:</strong>
            <span className="enlace-texto">{ENLACE_UBICACION}</span>
          </div>
        </div>
      </div>

      {/* Información de envío previo */}
      {renderInfoEnvioPrevio()}

      {/* Panel de acciones */}
      <div className="panel-acciones">
        <div className="acciones-principales">
          <button
            onClick={abrirWhatsApp}
            disabled={enviando || !invitadoSeleccionado}
            className="btn-abrir-whatsapp"
          >
            {enviando ? '⏳ Preparando WhatsApp...' : '📱 Abrir WhatsApp'}
          </button>

          {enviado && (
            <div className="mensaje-exito">
              <span className="icono-exito">✅</span>
              ¡WhatsApp abierto correctamente!
              <p className="instruccion-final">
                Completa el envío adjuntando la imagen y enviando el mensaje.
              </p>
            </div>
          )}

          {errorEnvio && (
            <div className="mensaje-error">
              <span className="icono-error">❌</span>
              {errorEnvio}
            </div>
          )}
        </div>

        <div className="instrucciones-envio">
          <h4>📝 Para completar el envío:</h4>
          <ol>
            <li>WhatsApp se abrirá con el mensaje predefinido</li>
            <li><strong>Adjunta la imagen</strong> que descargaste en el paso 3</li>
            <li>Verifica que el mensaje se vea correctamente</li>
            <li>Presiona enviar</li>
            <li>Vuelve aquí y finaliza el proceso</li>
          </ol>
        </div>
      </div>

      {/* Vista previa del mensaje */}
      {invitadoSeleccionado && (
        <div className="vista-previa-mensaje">
          <h4>✉️ Mensaje que se enviará:</h4>
          <div className="mensaje-preview">
            <pre>{generarMensajeWhatsApp()}</pre>
          </div>
        </div>
      )}

      {/* Acciones finales */}
      <div className="acciones-finales">
        <div className="botones-accion">
        

          <button
            onClick={abrirWhatsApp}
            disabled={enviando}
            className="btn-reintentar"
          >
            🔄 Reabrir WhatsApp
          </button>
        </div>

        <div className="nota-final">
          <p>
            <strong>💡 Importante:</strong> Después de finalizar, el estado del invitado 
            se actualizará a "Invitación enviada" en la lista principal.
          </p>
        </div>
      </div>

      {/* Historial reciente */}
      {historialEnvio && historialEnvio.length > 0 && (
        <div className="historial-reciente">
          <h4>📊 Historial Reciente de Envíos</h4>
          <div className="lista-historial">
            {historialEnvio.slice(-3).reverse().map(envio => (
              <div key={envio.id} className="item-historial">
                <span className="fecha">{formatearFecha(envio.fechaEnvio)}</span>
                <span className="invitado">{envio.invitadoNombre}</span>
                <span className="estado">✓ Enviado</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Paso5EnviarWhatsApp;