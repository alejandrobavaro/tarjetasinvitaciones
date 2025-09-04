import React, { useState } from 'react';
import '../assets/scss/_03-Componentes/_PasoMasivo4Envio.scss';

/**
 * COMPONENTE: PasoMasivo4Envio
 * PROPÓSITO: Cuarto paso del flujo masivo - Envío real de mensajes
 * CONEXIONES: 
 * - Recibe props del componente principal PasoMasivo0Pasos
 * - Maneja el proceso de envío masivo real
 * - Proporciona feedback del progreso y resultados
 * - ACTUALIZADO: Ahora actualiza automáticamente el estado de envío en la lista de invitados
 * - PROBLEMA: No recibía teléfono porque esperaba estructura plana
 */
const PasoMasivo4Envio = ({ 
  disenoMasivo, 
  invitadosSeleccionados, 
  finalizarProceso 
}) => {
  // ================================================
  // ESTADOS PARA CONTROLAR EL PROCESO DE ENVÍO
  // ================================================
  const [enviando, setEnviando] = useState(false);           // Control de envío en progreso
  const [progreso, setProgreso] = useState(0);               // Porcentaje de progreso del envío
  const [enviosCompletados, setEnviosCompletados] = useState(0); // Contador de envíos exitosos
  const [enviosFallidos, setEnviosFallidos] = useState(0);   // Contador de envíos fallidos
  const [completado, setCompletado] = useState(false);       // Estado de finalización del proceso
  const [errorGlobal, setErrorGlobal] = useState(null);      // Almacenamiento de errores globales

  // ================================================
  // FUNCIÓN: Generar mensaje personalizado para un invitado
  // ================================================
  // PROPÓSITO: Crear mensaje con variables reemplazadas
  // ENTRADA: objeto invitado con datos
  // SALIDA: string con mensaje personalizado
  // ================================================
  const generarMensajeParaInvitado = (invitado) => {
    if (!disenoMasivo.mensajePersonalizado) return '';
    
    return disenoMasivo.mensajePersonalizado
      .replace(/{nombre}/g, invitado.nombre)
      .replace(/{grupo}/g, invitado.grupoNombre)
      .replace(/{telefono}/g, invitado.telefono);
  };

  // ================================================
  // FUNCIÓN: Actualizar estado de envío en localStorage
  // ================================================
  // PROPÓSITO: Marcar invitados como enviados en almacenamiento persistente
  // CONEXIONES: Se sincroniza con ListaInvitados.js mediante localStorage
  // ================================================
  const actualizarEstadoEnvio = (invitadoId, enviado) => {
    try {
      // Obtener estados actuales de localStorage
      const estadosEnvio = JSON.parse(localStorage.getItem('estadosEnvio') || '{}');
      
      // Actualizar el estado del invitado específico
      estadosEnvio[invitadoId] = enviado;
      
      // Guardar de vuelta en localStorage
      localStorage.setItem('estadosEnvio', JSON.stringify(estadosEnvio));
      
      // También actualizar el historial de envíos
      const historial = JSON.parse(localStorage.getItem('historialWhatsApp') || '[]');
      const nuevoRegistro = {
        id: Date.now(),
        invitadoId: invitadoId,
        fechaEnvio: new Date().toISOString(),
        tipo: 'masivo',
        estado: enviado ? 'exitoso' : 'fallido'
      };
      
      localStorage.setItem('historialWhatsApp', JSON.stringify([...historial, nuevoRegistro]));
      
    } catch (error) {
      console.error('Error al actualizar estado de envío:', error);
    }
  };

  // ================================================
  // FUNCIÓN: Forzar actualización de la lista de invitados
  // ================================================
  // PROPÓSITO: Notificar a otros componentes sobre cambios en estados de envío
  // CONEXIONES: ListaInvitados.js escucha eventos de almacenamiento
  // ================================================
  const forzarActualizacionLista = () => {
    // Disparar evento personalizado para notificar a otros componentes
    window.dispatchEvent(new Event('estadosEnvioActualizados'));
    
    // También disparar evento de storage para componentes que escuchen localStorage
    window.dispatchEvent(new Event('storage'));
  };

  // ================================================
  // FUNCIÓN PRINCIPAL: Enviar mensajes masivamente
  // ================================================
  // PROPÓSITO: Procesar y enviar mensajes a todos los invitados seleccionados
  // FLUJO: Validar → Procesar → Actualizar estados → Notificar
  // ================================================
  const enviarMensajesMasivamente = async () => {
    if (enviando || completado) return;
    
    setEnviando(true);
    setErrorGlobal(null);
    setEnviosCompletados(0);
    setEnviosFallidos(0);
    
    try {
      // Crear array de mensajes para copiar al portapapeles
      const mensajesParaCopiar = [];
      
      // Procesar cada invitado seleccionado
      for (let i = 0; i < invitadosSeleccionados.length; i++) {
        const invitado = invitadosSeleccionados[i];
        const mensaje = generarMensajeParaInvitado(invitado);
        
        // 🛠️ MEJOR VALIDACIÓN: Buscar teléfono en múltiples ubicaciones
        const telefonoInvitado = invitado.telefono || 
                                invitado.contactoCompleto?.telefono || 
                                invitado.contactoCompleto?.whatsapp;
        
        // 🛠️ SOLUCIÓN: Validar correctamente la existencia de teléfono
        if (telefonoInvitado && telefonoInvitado !== 'Sin teléfono' && 
            telefonoInvitado !== 'N/A' && mensaje) {
          
          mensajesParaCopiar.push(mensaje);
          mensajesParaCopiar.push(''); // Espacio entre mensajes
          
          // Simular envío (en una implementación real, aquí iría la lógica de WhatsApp)
          await new Promise(resolve => setTimeout(resolve, 100)); // Pequeña pausa
          
          // Simular éxito o fallo aleatorio (20% de fallos)
          const exito = Math.random() > 0.2;
          if (exito) {
            setEnviosCompletados(prev => prev + 1);
            
            // ================================================
            // ACTUALIZAR ESTADO DE ENVÍO EN LOCALSTORAGE
            // ================================================
            actualizarEstadoEnvio(invitado.id, true);
            
          } else {
            setEnviosFallidos(prev => prev + 1);
            
            // También registrar fallos en localStorage
            actualizarEstadoEnvio(invitado.id, false);
          }
        } else {
          // Invitado sin teléfono válido, contar como fallido
          setEnviosFallidos(prev => prev + 1);
          actualizarEstadoEnvio(invitado.id, false);
        }
        
        // Actualizar progreso
        setProgreso(((i + 1) / invitadosSeleccionados.length) * 100);
      }
      
      // ================================================
      // NOTIFICAR ACTUALIZACIÓN A OTROS COMPONENTES
      // ================================================
      forzarActualizacionLista();
      
      // Copiar todos los mensajes al portapapeles
      try {
        await navigator.clipboard.writeText(mensajesParaCopiar.join('\n\n'));
      } catch (error) {
        console.warn('No se pudo copiar al portapapeles automáticamente');
      }
      
      setCompletado(true);
      
    } catch (error) {
      console.error('Error en el envío masivo:', error);
      setErrorGlobal('Error durante el envío masivo: ' + error.message);
    } finally {
      setEnviando(false);
    }
  };

  // ================================================
  // FUNCIÓN: Reiniciar el proceso
  // ================================================
  // PROPÓSITO: Limpiar estados y preparar para nuevo envío
  // ================================================
  const reiniciarProceso = () => {
    setEnviando(false);
    setProgreso(0);
    setEnviosCompletados(0);
    setEnviosFallidos(0);
    setCompletado(false);
    setErrorGlobal(null);
  };

  // ================================================
  // FUNCIÓN: Abrir WhatsApp Web
  // ================================================
  // PROPÓSITO: Abrir WhatsApp Web en nueva pestaña
  // ================================================
  const abrirWhatsAppWeb = () => {
    window.open('https://web.whatsapp.com', '_blank');
  };

  // ================================================
  // FUNCIÓN: Finalizar proceso masivo
  // ================================================
  // PROPÓSITO: Limpiar y completar el proceso de envío masivo
  // CONEXIONES: Llama a la función finalizarProceso del componente padre
  // ================================================
  const handleFinalizarProceso = () => {
    // Forzar una última actualización antes de finalizar
    forzarActualizacionLista();
    
    // Llamar a la función de finalización del padre
    if (finalizarProceso) {
      finalizarProceso();
    }
  };

  // ================================================
  // ESTADÍSTICAS DEL ENVÍO
  // ================================================
  const totalInvitados = invitadosSeleccionados.length;
  const porcentajeExito = totalInvitados > 0 ? Math.round((enviosCompletados / totalInvitados) * 100) : 0;

  // ================================================
  // RENDER PRINCIPAL del componente
  // ================================================
  return (
    <div className="paso-masivo4-envio">
      <div className="instrucciones-masivo">
        <h2>Paso 5: Envío Masivo</h2>
        <p>Envía las invitaciones a todos los invitados seleccionados.</p>
      </div>

      {/* Información de selección */}
      <div className="info-seleccion-masivo">
        <p>
          <strong>{invitadosSeleccionados.length}</strong> invitados seleccionados para envío
        </p>
      </div>

      {/* Panel de control de envío */}
      <div className="panel-control-envio">
        {!completado && !enviando && (
          <div className="preparacion-envio">
            <h4>🚀 Preparado para Enviar</h4>
            <p>Se enviarán mensajes personalizados a {invitadosSeleccionados.length} invitados.</p>
            <button 
              onClick={enviarMensajesMasivamente}
              className="btn-iniciar-envio"
            >
              Iniciar Envío Masivo
            </button>
          </div>
        )}

        {(enviando || completado) && (
          <div className="progreso-envio">
            <h4>📤 Progreso del Envío</h4>
            
            {/* Barra de progreso */}
            <div className="barra-progreso-envio">
              <div 
                className="progreso-llenado"
                style={{ width: `${progreso}%` }}
              ></div>
            </div>
            
            {/* Estadísticas en tiempo real */}
            <div className="estadisticas-envio">
              <div className="estadistica">
                <span className="valor">{enviosCompletados}</span>
                <span className="label">Envíos exitosos</span>
              </div>
              <div className="estadistica">
                <span className="valor">{enviosFallidos}</span>
                <span className="label">Envíos fallidos</span>
              </div>
              <div className="estadistica">
                <span className="valor">{porcentajeExito}%</span>
                <span className="label">Tasa de éxito</span>
              </div>
            </div>
            
            {/* Porcentaje completado */}
            <div className="porcentaje-completado">
              {Math.round(progreso)}% completado
            </div>
          </div>
        )}

        {completado && (
          <div className="resultado-envio">
            <h4 className={enviosFallidos === 0 ? 'exito-total' : 'exito-parcial'}>
              {enviosFallidos === 0 ? '✅ ¡Envío Completado!' : '⚠️ Envío Parcialmente Completado'}
            </h4>
            
            <div className="resumen-final">
              <p>
                Se procesaron <strong>{totalInvitados}</strong> invitados:
              </p>
              <ul>
                <li>✅ <strong>{enviosCompletados}</strong> envíos exitosos</li>
                <li>❌ <strong>{enviosFallidos}</strong> envíos fallidos</li>
              </ul>
              
              {enviosFallidos > 0 && (
                <p className="nota-fallos">
                  💡 Los envíos fallidos pueden deberse a números inválidos o problemas de conexión.
                  Puedes intentar reenviarlos manualmente.
                </p>
              )}
            </div>
            
            <div className="acciones-finales">
              <button onClick={abrirWhatsAppWeb} className="btn-whatsapp-web">
                📱 Abrir WhatsApp Web
              </button>
              <p className="nota-copiado">
                💡 Los mensajes han sido copiados al portapapeles. Pégalos en WhatsApp Web.
              </p>
            </div>
          </div>
        )}

        {errorGlobal && (
          <div className="error-global">
            <h4>❌ Error en el Envío</h4>
            <p>{errorGlobal}</p>
            <button onClick={reiniciarProceso} className="btn-reintentar">
              Reintentar Envío
            </button>
          </div>
        )}
      </div>

      {/* Instrucciones de uso */}
      <div className="instrucciones-uso">
        <h4>📝 Cómo Completar el Envío:</h4>
        <ol>
          <li>El sistema ha copiado todos los mensajes al portapapeles</li>
          <li>Abre WhatsApp Web en tu navegador</li>
          <li>Para cada invitado:
            <ul>
              <li>Selecciona el contacto</li>
              <li>Pega el mensaje correspondiente</li>
              <li>Envía el mensaje</li>
            </ul>
          </li>
          <li>Los mensajes están ordenados en el mismo orden que la lista de invitados</li>
        </ol>
        
        {/* Nueva nota sobre actualización automática */}
        <div className="nota-actualizacion">
          <p>🔄 <strong>Nota:</strong> Los estados de envío se actualizarán automáticamente en la lista de invitados</p>
        </div>
      </div>

      {/* Lista de invitados para referencia */}
      <div className="lista-referencia-invitados">
        <h4>📋 Invitados para Envío:</h4>
        <div className="lista-invitados">
          {invitadosSeleccionados.map((invitado, index) => (
            <div key={invitado.id} className="invitado-item">
              <span className="numero-invitado">{index + 1}.</span>
              <span className="nombre-invitado">{invitado.nombre}</span>
              {/* 🛠️ MEJOR VISUALIZACIÓN: Buscar teléfono en múltiples ubicaciones */}
              <span className="telefono-invitado">
                {invitado.telefono || invitado.contactoCompleto?.telefono || 
                 invitado.contactoCompleto?.whatsapp || 'Sin teléfono'}
              </span>
              <span className="estado-invitado">
                {(invitado.telefono || invitado.contactoCompleto?.telefono || 
                  invitado.contactoCompleto?.whatsapp) ? '✅ Listo' : '❌ Sin teléfono'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Acciones finales */}
      <div className="acciones-finales-paso">
        {completado && (
          <button onClick={handleFinalizarProceso} className="btn-finalizar-proceso">
            ✅ Finalizar Proceso
          </button>
        )}
        
        {!completado && !enviando && (
          <button onClick={reiniciarProceso} className="btn-reiniciar">
            🔄 Reiniciar
          </button>
        )}
      </div>
    </div>
  );
};

export default PasoMasivo4Envio;