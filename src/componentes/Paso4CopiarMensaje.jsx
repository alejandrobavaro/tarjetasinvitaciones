import React, { useState, useEffect } from 'react';
import '../assets/scss/_03-Componentes/_Paso4CopiarMensaje.scss';

/**
 * COMPONENTE: Paso4CopiarMensaje
 * PROPÓSITO: Cuarto paso del flujo - Generar y copiar mensaje personalizado para WhatsApp
 * CONEXIONES: 
 * - Recibe props del componente principal Paso0Pasos
 * - Genera mensaje personalizado con datos del diseño e invitado
 * - Usa enlaces fijos para confirmación y ubicación
 * - Permite copiar el mensaje al portapapeles
 */
const Paso4CopiarMensaje = ({ 
  disenoInvitacion, 
  invitadoSeleccionado, 
  avanzarPaso 
}) => {
  // ESTADO: Control del proceso de copiado
  const [mensajeCopiado, setMensajeCopiado] = useState(false);
  const [errorCopia, setErrorCopia] = useState(null);

  // CONSTANTES: Enlaces fijos
  const ENLACE_CONFIRMACION = 'https://confirmarasistenciaevento.netlify.app/';
  const ENLACE_UBICACION = 'https://noscasamos-aleyfabi.netlify.app/ubicacion';

  // FUNCIÓN: Generar el mensaje completo para WhatsApp
  const generarMensajeWhatsApp = () => {
    if (!invitadoSeleccionado || !disenoInvitacion) return '';
    
    return `¡Hola ${invitadoSeleccionado.nombre}! 🎉\n\n` +
      `Te invitamos a celebrar nuestro amor:\n` +
      `💍 ${disenoInvitacion.nombresNovios}\n` +
      `📅 ${disenoInvitacion.fecha}\n` +
      `🕒 ${disenoInvitacion.hora}\n` +
      `📍 ${disenoInvitacion.lugar.split('\n')[0]}\n\n` +
      `---- ADJUNTA AQUÍ LA IMAGEN DE LA INVITACIÓN ----\n\n` +
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

  // FUNCIÓN: Copiar mensaje al portapapeles
  const copiarMensaje = async () => {
    if (!invitadoSeleccionado) {
      setErrorCopia('Primero debe seleccionar un invitado');
      return;
    }

    try {
      const mensaje = generarMensajeWhatsApp();
      
      // Usar la API moderna del portapapeles
      await navigator.clipboard.writeText(mensaje);
      
      setMensajeCopiado(true);
      setErrorCopia(null);
      
      // Resetear el estado después de 3 segundos
      setTimeout(() => setMensajeCopiado(false), 3000);
      
    } catch (error) {
      console.error('Error al copiar:', error);
      setErrorCopia('No se pudo copiar el mensaje. Intenta nuevamente.');
      
      // Fallback para navegadores antiguos
      try {
        const textArea = document.createElement('textarea');
        textArea.value = generarMensajeWhatsApp();
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        setMensajeCopiado(true);
        setErrorCopia(null);
        setTimeout(() => setMensajeCopiado(false), 3000);
      } catch (fallbackError) {
        setErrorCopia('Error al copiar. Tu navegador podría tener restricciones.');
      }
    }
  };

  // FUNCIÓN: Verificar si puede avanzar al siguiente paso
  const puedeAvanzar = () => {
    return mensajeCopiado;
  };

  // RENDER: Vista previa del mensaje
  const renderVistaPrevia = () => {
    const mensaje = generarMensajeWhatsApp();
    
    return (
      <div className="vista-previa-mensaje">
        <h3>Vista Previa del Mensaje:</h3>
        <div className="whatsapp-preview">
          <div className="whatsapp-header">
            <div className="contacto">
              <span className="nombre">{invitadoSeleccionado?.nombre || 'Invitado'}</span>
              <span className="estado">en línea</span>
            </div>
          </div>
          
          <div className="mensaje-content">
            <div className="bubble sent">
              {mensaje.split('\n').map((linea, index) => (
                <p key={index} className={linea.includes('----') ? 'linea-separadora' : ''}>
                  {linea.replace('----', '').trim() || '____________________________'}
                </p>
              ))}
            </div>
            
            <div className="bubble received">
              <p>¡Gracias por la invitación! Confirmaré mi asistencia 📝</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // RENDER PRINCIPAL del componente
  return (
    <div className="paso4-copiar-mensaje">
      <div className="instrucciones">
        <h2>Paso 4: Copiar Mensaje para WhatsApp</h2>
        <p>Genera y copia el mensaje personalizado para enviar junto con la imagen.</p>
      </div>

      {/* Información del invitado */}
      {invitadoSeleccionado && (
        <div className="info-invitado">
          <h3>Invitado: {invitadoSeleccionado.nombre}</h3>
          <p>Teléfono: {invitadoSeleccionado.telefono}</p>
        </div>
      )}

      {/* Panel de enlaces fijos */}
      <div className="panel-enlaces">
        <h4>🔗 Enlaces Importantes:</h4>
        
        <div className="enlace-item">
          <strong>Confirmar Asistencia:</strong>
          <a href={ENLACE_CONFIRMACION} target="_blank" rel="noopener noreferrer" className="enlace-fijo">
            {ENLACE_CONFIRMACION}
          </a>
        </div>
        
        <div className="enlace-item">
          <strong>Cómo Llegar:</strong>
          <a href={ENLACE_UBICACION} target="_blank" rel="noopener noreferrer" className="enlace-fijo">
            {ENLACE_UBICACION}
          </a>
        </div>
        
        <p className="nota-enlaces">
          Estos enlaces están incluidos en el mensaje de WhatsApp para que los invitados puedan confirmar y ver cómo llegar.
        </p>
      </div>

      {/* Vista previa del mensaje */}
      {invitadoSeleccionado && renderVistaPrevia()}

      {/* Controles de copiado */}
      <div className="controles-copia">
        <button
          onClick={copiarMensaje}
          disabled={!invitadoSeleccionado}
          className="btn-copiar"
        >
          📋 Copiar Mensaje al Portapapeles
        </button>

        {mensajeCopiado && (
          <div className="mensaje-exito">
            <span className="icono-exito">✅</span>
            ¡Mensaje copiado correctamente!
          </div>
        )}

        {errorCopia && (
          <div className="mensaje-error">
            <span className="icono-error">❌</span>
            {errorCopia}
          </div>
        )}
      </div>

      {/* Instrucciones de uso */}
      <div className="instrucciones-uso">
        <h4>📝 Cómo enviar por WhatsApp:</h4>
        <ol>
          <li>Descarga la imagen del paso anterior</li>
          <li>Abre WhatsApp y selecciona el contacto</li>
          <li>Envía primero la imagen como archivo</li>
          <li>Pega el mensaje copiado y envíalo</li>
          <li>El invitado recibirá la imagen y el mensaje con los enlaces</li>
        </ol>
      </div>

      {/* Acciones del paso */}
      <div className="acciones-paso">
    

        {!puedeAvanzar() && (
          <p className="mensaje-ayuda">
            💡 Primero copia el mensaje para continuar
          </p>
        )}
      </div>

      {/* Nota importante */}
      <div className="nota-importante">
        <h4>⚠️ Importante:</h4>
        <p>
          El mensaje incluye enlaces para confirmar asistencia y ver cómo llegar. 
          Los invitados podrán hacer clic directamente desde WhatsApp.
        </p>
      </div>
    </div>
  );
};

export default Paso4CopiarMensaje;