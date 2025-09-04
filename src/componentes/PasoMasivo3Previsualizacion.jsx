import React, { useState } from 'react';
import '../assets/scss/_03-Componentes/_PasoMasivo3Previsualizacion.scss';

/**
 * COMPONENTE: PasoMasivo3Previsualizacion
 * PROPÓSITO: Tercer paso del flujo masivo - Previsualizar mensajes antes del envío
 * CONEXIONES: 
 * - Recibe props del componente principal PasoMasivo0Pasos
 * - Muestra cómo quedará el mensaje para cada invitado
 * - Permite revisar y confirmar antes del envío masivo
 */
const PasoMasivo3Previsualizacion = ({ 
  disenoMasivo, 
  invitadosSeleccionados, 
  avanzarPaso 
}) => {
  // Estado para controlar qué invitado se está previsualizando
  const [invitadoPrevisualizacion, setInvitadoPrevisualizacion] = useState(0);

  // Función para generar mensaje personalizado para un invitado
  const generarMensajeParaInvitado = (invitado) => {
    if (!disenoMasivo.mensajePersonalizado) return '';
    
    return disenoMasivo.mensajePersonalizado
      .replace(/{nombre}/g, invitado.nombre)
      .replace(/{grupo}/g, invitado.grupoNombre)
      .replace(/{telefono}/g, invitado.telefono);
  };

  // Navegar entre invitados
  const siguienteInvitado = () => {
    if (invitadoPrevisualizacion < invitadosSeleccionados.length - 1) {
      setInvitadoPrevisualizacion(invitadoPrevisualizacion + 1);
    }
  };

  const anteriorInvitado = () => {
    if (invitadoPrevisualizacion > 0) {
      setInvitadoPrevisualizacion(invitadoPrevisualizacion - 1);
    }
  };

  // Verificar si puede avanzar al siguiente paso
  const puedeAvanzar = () => {
    return invitadosSeleccionados.length > 0 && 
           disenoMasivo.mensajePersonalizado &&
           disenoMasivo.mensajePersonalizado.trim().length > 0;
  };

  // Obtener invitado actual para previsualización
  const invitadoActual = invitadosSeleccionados[invitadoPrevisualizacion];

  return (
    <div className="paso-masivo3-previsualizacion">
      <div className="instrucciones-masivo">
        <h2>Paso 3: Previsualizar Mensajes</h2>
        <p>Revisa cómo se verán los mensajes antes de enviarlos masivamente.</p>
      </div>

      {/* Información de selección */}
      <div className="info-seleccion-masivo">
        <p>
          <strong>{invitadosSeleccionados.length}</strong> invitados seleccionados
        </p>
      </div>

      {invitadosSeleccionados.length === 0 ? (
        <div className="sin-invitados">
          <p>No hay invitados seleccionados para previsualizar.</p>
        </div>
      ) : (
        <>
          {/* Navegación entre invitados */}
          <div className="navegacion-invitados">
            <button 
              onClick={anteriorInvitado}
              disabled={invitadoPrevisualizacion === 0}
              className="btn-navegacion"
            >
              ← Anterior
            </button>
            
            <span className="contador-invitados">
              {invitadoPrevisualizacion + 1} de {invitadosSeleccionados.length}
            </span>
            
            <button 
              onClick={siguienteInvitado}
              disabled={invitadoPrevisualizacion === invitadosSeleccionados.length - 1}
              className="btn-navegacion"
            >
              Siguiente →
            </button>
          </div>

          {/* Información del invitado actual */}
          <div className="info-invitado-actual">
            <h4>Invitado: {invitadoActual.nombre}</h4>
            <p>Grupo: {invitadoActual.grupoNombre}</p>
            <p>Teléfono: {invitadoActual.telefono}</p>
          </div>

          {/* Vista previa del mensaje */}
          <div className="vista-previa-mensaje">
            <h4>✉️ Mensaje Personalizado:</h4>
            <div className="contenido-mensaje">
              <pre>{generarMensajeParaInvitado(invitadoActual)}</pre>
            </div>
          </div>

          {/* Estadísticas del mensaje */}
          <div className="estadisticas-mensaje">
            <div className="estadistica">
              <span className="valor">{generarMensajeParaInvitado(invitadoActual).length}</span>
              <span className="label">caracteres</span>
            </div>
            <div className="estadistica">
              <span className="valor">{generarMensajeParaInvitado(invitadoActual).split('\n').length}</span>
              <span className="label">líneas</span>
            </div>
            <div className="estadistica">
              <span className="valor">{Math.ceil(generarMensajeParaInvitado(invitadoActual).length / 160)}</span>
              <span className="label">SMS equivalentes</span>
            </div>
          </div>

          {/* Lista rápida de todos los invitados */}
          <div className="lista-rapida-invitados">
            <h4>📋 Todos los Invitados Seleccionados:</h4>
            <div className="lista-invitados">
              {invitadosSeleccionados.map((invitado, index) => (
                <div
                  key={invitado.id}
                  className={`invitado-item ${index === invitadoPrevisualizacion ? 'activo' : ''}`}
                  onClick={() => setInvitadoPrevisualizacion(index)}
                >
                  <span className="nombre-invitado">{invitado.nombre}</span>
                  <span className="grupo-invitado">{invitado.grupoNombre}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Acciones del paso */}
      <div className="acciones-paso-masivo">
        {!puedeAvanzar() && (
          <p className="mensaje-ayuda-masivo">
            💡 Completa todos los pasos anteriores para continuar
          </p>
        )}
      </div>
    </div>
  );
};

export default PasoMasivo3Previsualizacion;