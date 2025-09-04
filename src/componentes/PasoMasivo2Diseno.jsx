import React, { useState } from 'react';
import '../assets/scss/_03-Componentes/_PasoMasivo2Diseno.scss';

/**
 * COMPONENTE: PasoMasivo2Diseno
 * PROPÓSITO: Segundo paso del flujo masivo - Diseñar el mensaje para envío masivo
 * CONEXIONES: 
 * - Recibe props del componente principal PasosEnvioMasivo
 * - Permite personalizar el mensaje que se enviará a todos los invitados
 * - Incluye variables como {nombre} que se reemplazarán automáticamente
 */
const PasoMasivo2Diseno = ({ 
  disenoMasivo, 
  setDisenoMasivo, 
  invitadosSeleccionados, 
  avanzarPaso 
}) => {
  // Estado para vista previa del mensaje
  const [mostrarVistaPrevia, setMostrarVistaPrevia] = useState(false);
  
  // Plantilla por defecto para el mensaje masivo
  const plantillaPorDefecto = `¡Hola {nombre}! 🎉

Te invitamos a celebrar nuestra boda:

💍 Ale y Fabi
📅 Domingo, 23 de noviembre de 2025
🕒 19:00 horas
📍 Casa del Mar - Villa García Uriburu

Confirma tu asistencia aquí:
https://confirmarasistenciaevento.netlify.app/

Ver ubicación:
https://noscasamos-aleyfabi.netlify.app/ubicacion

¡Esperamos verte! 💕`;

  // Inicializar diseño si está vacío
  if (!disenoMasivo.mensajePersonalizado) {
    setDisenoMasivo({
      ...disenoMasivo,
      mensajePersonalizado: plantillaPorDefecto
    });
  }

  // Función para manejar cambios en el mensaje
  const handleMensajeChange = (e) => {
    setDisenoMasivo({
      ...disenoMasivo,
      mensajePersonalizado: e.target.value
    });
  };

  // Función para insertar variable en el mensaje
  const insertarVariable = (variable) => {
    const textarea = document.getElementById('mensaje-personalizado');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const nuevoTexto = disenoMasivo.mensajePersonalizado.substring(0, start) + 
                      variable + 
                      disenoMasivo.mensajePersonalizado.substring(end);
    
    setDisenoMasivo({
      ...disenoMasivo,
      mensajePersonalizado: nuevoTexto
    });
    
    // Enfocar y posicionar cursor después de la variable insertada
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + variable.length, start + variable.length);
    }, 0);
  };

  // Función para generar vista previa con un invitado de ejemplo
  const generarVistaPrevia = () => {
    if (!invitadosSeleccionados.length) return "Selecciona al menos un invitado para ver la vista previa";
    
    const invitadoEjemplo = invitadosSeleccionados[0];
    return disenoMasivo.mensajePersonalizado
      .replace(/{nombre}/g, invitadoEjemplo.nombre)
      .replace(/{grupo}/g, invitadoEjemplo.grupoNombre)
      .replace(/{telefono}/g, invitadoEjemplo.telefono);
  };

  // Verificar si puede avanzar al siguiente paso
  const puedeAvanzar = () => {
    return disenoMasivo.mensajePersonalizado && 
           disenoMasivo.mensajePersonalizado.trim().length > 0 &&
           invitadosSeleccionados.length > 0;
  };

  return (
    <div className="paso-masivo2-diseno">
      <div className="instrucciones-masivo">
        <h2>Paso 2: Diseña tu Mensaje Masivo</h2>
        <p>Personaliza el mensaje que se enviará a todos los invitados seleccionados.</p>
      </div>

      {/* Información de selección */}
      <div className="info-seleccion-masivo">
        <p>
          <strong>{invitadosSeleccionados.length}</strong> invitados seleccionados
        </p>
      </div>

      {/* Variables disponibles */}
      <div className="variables-disponibles">
        <h4>📋 Variables Disponibles:</h4>
        <div className="lista-variables">
          <button onClick={() => insertarVariable('{nombre}')} className="btn-variable">
            {'{nombre}'}
          </button>
          <button onClick={() => insertarVariable('{grupo}')} className="btn-variable">
            {'{grupo}'}
          </button>
          <button onClick={() => insertarVariable('{telefono}')} className="btn-variable">
            {'{telefono}'}
          </button>
        </div>
        <p className="nota-variables">
          💡 Las variables se reemplazarán automáticamente con los datos de cada invitado
        </p>
      </div>

      {/* Editor de mensaje */}
      <div className="editor-mensaje">
        <label htmlFor="mensaje-personalizado">Mensaje Personalizado:</label>
        <textarea
          id="mensaje-personalizado"
          value={disenoMasivo.mensajePersonalizado}
          onChange={handleMensajeChange}
          rows="12"
          placeholder="Escribe tu mensaje personalizado aquí..."
          className="textarea-mensaje"
        />
      </div>

      {/* Controles de vista previa */}
      <div className="controles-vista-previa">
        <button
          onClick={() => setMostrarVistaPrevia(!mostrarVistaPrevia)}
          className="btn-vista-previa"
          disabled={!invitadosSeleccionados.length}
        >
          {mostrarVistaPrevia ? 'Ocultar Vista Previa' : 'Mostrar Vista Previa'}
        </button>
      </div>

      {/* Vista previa del mensaje */}
      {mostrarVistaPrevia && (
        <div className="vista-previa-mensaje">
          <h4>👀 Vista Previa (con el primer invitado):</h4>
          <div className="contenido-vista-previa">
            <pre>{generarVistaPrevia()}</pre>
          </div>
        </div>
      )}

      {/* Plantillas rápidas */}
      <div className="plantillas-rapidas">
        <h4>💡 Plantillas Rápidas:</h4>
        <div className="lista-plantillas">
          <button 
            onClick={() => setDisenoMasivo({...disenoMasivo, mensajePersonalizado: plantillaPorDefecto})}
            className="btn-plantilla"
          >
            Plantilla Formal
          </button>
          <button 
            onClick={() => setDisenoMasivo({...disenoMasivo, mensajePersonalizado: `¡Hola {nombre}! 🎊\n\n¡Estás invitado a nuestra boda! 🥂\n\n📅 23/11/2025 - 🕒 19:00 hs\n📍 Casa del Mar, Mar del Plata\n\nConfirma aquí: https://confirmarasistenciaevento.netlify.app/\n\n¡Te esperamos! 💍`})}
            className="btn-plantilla"
          >
            Plantilla Casual
          </button>
        </div>
      </div>

      {/* Acciones del paso */}
      <div className="acciones-paso-masivo">
        {!puedeAvanzar() && (
          <p className="mensaje-ayuda-masivo">
            💡 Completa el mensaje y asegúrate de tener invitados seleccionados
          </p>
        )}
      </div>
    </div>
  );
};

export default PasoMasivo2Diseno;