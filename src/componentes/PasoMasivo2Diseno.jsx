import React, { useState } from 'react';
import '../assets/scss/_03-Componentes/_PasoMasivo2Diseno.scss';

/**
 * COMPONENTE: PasoMasivo2Diseno
 * PROPÓSITO: Segundo paso del flujo masivo - Diseñar el mensaje para envío masivo
 * CONEXIONES: 
 * - Recibe props del componente principal PasoMasivo0Pasos
 * - Permite personalizar el mensaje que se enviará a todos los invitados
 * - Incluye variables como {nombre} que se reemplazarán automáticamente
 * - MODIFICADO: Vista unificada de editor y vista previa
 */
const PasoMasivo2Diseno = ({ 
  disenoMasivo, 
  setDisenoMasivo, 
  invitadosSeleccionados, 
  avanzarPaso 
}) => {
  // Plantilla por defecto para el mensaje masivo (ÚNICA OPCIÓN)
  const plantillaFormal = `¡Hola {nombre}! 🎉

Te invitamos a celebrar nuestra boda:

💍 Ale y Fabi
📅 Domingo, 23 de noviembre de 2025
🕒 19:00 horas
📍 Casa del Mar - Villa García Uriburu - C. Seaglia 5400, Camet

Confirma tu asistencia aquí:
https://confirmarasistenciaevento.netlify.app/

Ver ubicación:
https://noscasamos-aleyfabi.netlify.app/ubicacion

¡Esperamos verte! 💕`;

  // Inicializar diseño si está vacío
  if (!disenoMasivo.mensajePersonalizado) {
    setDisenoMasivo({
      ...disenoMasivo,
      mensajePersonalizado: plantillaFormal
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
    
    // Enfocar and posicionar cursor después de la variable insertada
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
    <div className="paso-masivo2-diseno compacto-mejorado">
      {/* HEADER */}
      <div className="header-mejorado">
        <h2>Diseño del Mensaje Masivo</h2>
        <div className="info-seleccion-header">
          <p>
            <strong>{invitadosSeleccionados.length}</strong> invitados seleccionados
          </p>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL - EDITOR Y VISTA PREVIA UNIFICADOS */}
      <div className="contenedor-editor-vista-previa">
        {/* COLUMNA IZQUIERDA - EDITOR */}
        <div className="columna-editor">
          <div className="seccion-editor">
            <div className="titulo-seccion">
              <h3>✏️ Editor de Mensaje</h3>
              <div className="variables-disponibles">
                <span>Variables:</span>
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
              </div>
            </div>
            
            <div className="editor-mensaje">
              <textarea
                id="mensaje-personalizado"
                value={disenoMasivo.mensajePersonalizado}
                onChange={handleMensajeChange}
                rows="12"
                placeholder="Escribe tu mensaje personalizado aquí..."
                className="textarea-mensaje-mejorado"
              />
            </div>
            
            <div className="nota-variables">
              <p>💡 Las variables se reemplazarán automáticamente con los datos de cada invitado</p>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA - VISTA PREVIA */}
        <div className="columna-vista-previa">
          <div className="seccion-vista-previa">
            <div className="titulo-seccion">
              <h3>👀 Vista Previa</h3>
              <span className="badge-ejemplo">
                {invitadosSeleccionados.length > 0 ? 
                  `Ejemplo: ${invitadosSeleccionados[0].nombre}` : 
                  'Sin invitados seleccionados'}
              </span>
            </div>
            
            <div className="contenido-vista-previa-mejorado">
              <pre>{generarVistaPrevia()}</pre>
            </div>
            
            <div className="nota-vista-previa">
              <p>💡 Así verá el mensaje cada invitado (con sus datos personales)</p>
            </div>
          </div>
        </div>
      </div>

      {/* ACCIONES DEL PASO */}
      {/* <div className="acciones-mejoradas">
        <button
          onClick={avanzarPaso}
          disabled={!puedeAvanzar()}
          className="btn-siguiente-mejorado"
        >
          Siguiente →
        </button>
        {!puedeAvanzar() && (
          <span className="ayuda">
            💡 Completa el mensaje y asegúrate de tener invitados seleccionados
          </span>
        )}
      </div> */}
    </div>
  );
};

export default PasoMasivo2Diseno;