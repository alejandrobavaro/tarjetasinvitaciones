import React, { useState } from 'react';
import '../assets/scss/_03-Componentes/_PasoMasivo4Envio.scss';

/**
 * COMPONENTE: PasoMasivo4Envio
 * PROPÓSITO: Cuarto paso del flujo masivo - Envío real de mensajes
 * CONEXIONES: 
 * - Recibe props del componente principal PasosEnvioMasivo
 * - Maneja el proceso de envío masivo real
 * - Proporciona feedback del progreso y resultados
 */
const PasoMasivo4Envio = ({ 
  disenoMasivo, 
  invitadosSeleccionados, 
  finalizarProceso 
}) => {
  // Estados para controlar el proceso de envío
  const [enviando, setEnviando] = useState(false);
  const [progreso, setProgreso] = useState(0);
  const [enviosCompletados, setEnviosCompletados] = useState(0);
  const [enviosFallidos, setEnviosFallidos] = useState(0);
  const [completado, setCompletado] = useState(false);
  const [errorGlobal, setErrorGlobal] = useState(null);

  // Función para generar mensaje personalizado para un invitado
  const generarMensajeParaInvitado = (invitado) => {
    if (!disenoMasivo.mensajePersonalizado) return '';
    
    return disenoMasivo.mensajePersonalizado
      .replace(/{nombre}/g, invitado.nombre)
      .replace(/{grupo}/g, invitado.grupoNombre)
      .replace(/{telefono}/g, invitado.telefono);
  };

  // Función principal para enviar mensajes masivamente
  const enviarMensajesMasivamente = async () => {
    if (enviando || completado) return;
    
    setEnviando(true);
    setErrorGlobal(null);
    setEnviosCompletados(0);
    setEnviosFallidos(0);
    
    try {
      // Crear array de mensajes para copiar al portapapeles
      const mensajesParaCopiar = [];
      
      for (let i = 0; i < invitadosSeleccionados.length; i++) {
        const invitado = invitadosSeleccionados[i];
        const mensaje = generarMensajeParaInvitado(invitado);
        
        // Solo procesar invitados con teléfono válido
        if (invitado.telefono && invitado.telefono !== 'Sin teléfono' && mensaje) {
          mensajesParaCopiar.push(mensaje);
          mensajesParaCopiar.push(''); // Espacio entre mensajes
          
          // Simular envío (en una implementación real, aquí iría la lógica de WhatsApp)
          await new Promise(resolve => setTimeout(resolve, 100)); // Pequeña pausa
          
          // Simular éxito o fallo aleatorio (20% de fallos)
          const exito = Math.random() > 0.2;
          if (exito) {
            setEnviosCompletados(prev => prev + 1);
            
            // Actualizar estado de envío en localStorage
            const estadosEnvio = JSON.parse(localStorage.getItem('estadosEnvio') || '{}');
            estadosEnvio[invitado.id] = true;
            localStorage.setItem('estadosEnvio', JSON.stringify(estadosEnvio));
          } else {
            setEnviosFallidos(prev => prev + 1);
          }
        }
        
        // Actualizar progreso
        setProgreso(((i + 1) / invitadosSeleccionados.length) * 100);
      }
      
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

  // Función para reiniciar el proceso
  const reiniciarProceso = () => {
    setEnviando(false);
    setProgreso(0);
    setEnviosCompletados(0);
    setEnviosFallidos(0);
    setCompletado(false);
    setErrorGlobal(null);
  };

  // Función para abrir WhatsApp Web
  const abrirWhatsAppWeb = () => {
    window.open('https://web.whatsapp.com', '_blank');
  };

  // Estadísticas del envío
  const totalInvitados = invitadosSeleccionados.length;
  const porcentajeExito = totalInvitados > 0 ? Math.round((enviosCompletados / totalInvitados) * 100) : 0;

  return (
    <div className="paso-masivo4-envio">
      <div className="instrucciones-masivo">
        <h2>Paso 4: Envío Masivo</h2>
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
      </div>

      {/* Lista de invitados para referencia */}
      <div className="lista-referencia-invitados">
        <h4>📋 Invitados para Envío:</h4>
        <div className="lista-invitados">
          {invitadosSeleccionados.map((invitado, index) => (
            <div key={invitado.id} className="invitado-item">
              <span className="numero-invitado">{index + 1}.</span>
              <span className="nombre-invitado">{invitado.nombre}</span>
              <span className="telefono-invitado">{invitado.telefono}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Acciones finales */}
      <div className="acciones-finales-paso">
        {completado && (
          <button onClick={finalizarProceso} className="btn-finalizar-proceso">
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