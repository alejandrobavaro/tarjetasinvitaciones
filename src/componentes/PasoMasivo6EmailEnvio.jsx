import React, { useState, useEffect } from 'react';
import { FiMail, FiUser, FiCheckCircle, FiSend, FiAlertCircle } from "react-icons/fi";
import '../assets/scss/_03-Componentes/_PasoMasivo6EmailEnvio.scss';

const PasoMasivo6EmailEnvio = ({ 
  disenoMasivo, 
  invitadosSeleccionados, 
  finalizarProceso 
}) => {
  const [emailsAbiertos, setEmailsAbiertos] = useState({});
  const [emailsEnviados, setEmailsEnviados] = useState({});
  const [invitadosConEmail, setInvitadosConEmail] = useState([]);

  // Efecto para procesar los invitados con email válido
  useEffect(() => {
    const procesarInvitados = () => {
      if (!invitadosSeleccionados || !Array.isArray(invitadosSeleccionados)) {
        return [];
      }

      return invitadosSeleccionados.filter(invitado => {
        // Verificar que el invitado tenga email válido (no "SIN DATOS", vacío, o sin @)
        const tieneEmail = invitado.email && 
                          invitado.email !== 'N/A' && 
                          invitado.email !== 'SIN DATOS' &&
                          invitado.email !== '' && 
                          invitado.email.includes('@');
        
        return tieneEmail;
      });
    };

    setInvitadosConEmail(procesarInvitados());
  }, [invitadosSeleccionados]);

  // Cargar estados previos de localStorage
  useEffect(() => {
    const estadosEnvio = JSON.parse(localStorage.getItem('estadosEnvio') || '{}');
    setEmailsEnviados(estadosEnvio);
  }, []);

  // Función para generar mensaje personalizado
  const generarMensajeParaInvitado = (invitado) => {
    if (!disenoMasivo.mensajePersonalizado) {
      // Mensaje por defecto si no hay plantilla personalizada
      return `¡Hola ${invitado.nombre}! 🎉

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
    }
    
    return disenoMasivo.mensajePersonalizado
      .replace(/{nombre}/g, invitado.nombre || 'Invitado')
      .replace(/{grupo}/g, invitado.grupoNombre || '')
      .replace(/{telefono}/g, invitado.telefono || '')
      .replace(/{email}/g, invitado.email || '');
  };

  // Función para abrir el cliente de email
  const abrirEmail = (invitado) => {
    const mensaje = generarMensajeParaInvitado(invitado);
    const asunto = encodeURIComponent(`🎉 Invitación a nuestra boda - ${invitado.nombre}`);
    const cuerpo = encodeURIComponent(`${mensaje}\n\n💌 Confirmar asistencia: https://confirmarasistenciaevento.netlify.app/\n🗺️ Ubicación: https://noscasamos-aleyfabi.netlify.app/ubicacion\n\n¡Te esperamos con mucha ilusión!\nAle y Fabi`);
    
    // Abrir cliente de email
    window.location.href = `mailto:${invitado.email}?subject=${asunto}&body=${cuerpo}`;
    
    // Marcar como abierto
    setEmailsAbiertos(prev => ({ ...prev, [invitado.id]: true }));
  };

  // Función para marcar como enviado
  const marcarComoEnviado = (invitadoId) => {
    // Actualizar estado local
    setEmailsEnviados(prev => ({ ...prev, [invitadoId]: true }));
    
    // Actualizar localStorage
    const estadosEnvio = JSON.parse(localStorage.getItem('estadosEnvio') || '{}');
    estadosEnvio[invitadoId] = true;
    localStorage.setItem('estadosEnvio', JSON.stringify(estadosEnvio));
    
    // Disparar evento para actualizar otros componentes
    window.dispatchEvent(new Event('estadosEnvioActualizados'));
  };

  // Función para abrir cliente de email vacío
  const abrirClienteEmail = (email) => {
    if (email && email !== 'N/A' && email !== 'SIN DATOS') {
      window.location.href = `mailto:${email}`;
    }
  };

  // Contadores para estadísticas
  const emailsCompletados = Object.keys(emailsEnviados).filter(id => 
    emailsEnviados[id] && invitadosConEmail.some(inv => inv.id === id)
  ).length;

  return (
    <div className="paso-email-envio compacto-mejorado">
      {/* HEADER */}
      <div className="header-mejorado">
        <h2>Envío por Email</h2>
        <div className="info-seleccion-header">
          <p>
            <strong>{invitadosConEmail.length}</strong> invitados con email válido
          </p>
          <p>
            <strong>{emailsCompletados}</strong> emails marcados como enviados
          </p>
        </div>
      </div>

      {/* Información de depuración */}
      {invitadosSeleccionados && invitadosSeleccionados.length > 0 && invitadosConEmail.length === 0 && (
        <div className="debug-info">
          <FiAlertCircle style={{color: '#ff9800', marginRight: '8px'}}/>
          <span>Se encontraron {invitadosSeleccionados.length} invitados, pero ninguno tiene email válido.</span>
          <button 
            onClick={() => console.log('Invitados seleccionados:', invitadosSeleccionados)} 
            className="btn-debug"
          >
            Ver datos en consola
          </button>
        </div>
      )}

      {/* INSTRUCCIONES PRINCIPALES */}
      <div className="instrucciones-principales">
        <div className="tarjeta-instrucciones">
          <h3>📧 Envío de Emails Directo</h3>
          <p>Haz clic en "Abrir Email" para cada invitado. Se abrirá tu cliente de email con:</p>
          <ul>
            <li>✅ Dirección del invitado prellenada</li>
            <li>✅ Asunto personalizado</li>
            <li>✅ Mensaje completo de la invitación</li>
            <li>✅ Enlaces de confirmación y ubicación</li>
          </ul>
          
          <div className="nota-importante">
            <p>💡 Solo necesitas revisar y hacer clic en "Enviar" en tu cliente de email</p>
          </div>
        </div>
      </div>

      {/* LISTA DE INVITADOS PARA EMAIL */}
      <div className="lista-email-envio">
        <h3>📧 Invitados para Envío por Email</h3>
        
        {invitadosConEmail.length === 0 ? (
          <div className="sin-invitados">
            <FiAlertCircle style={{fontSize: '24px', marginBottom: '10px', color: '#6c757d'}}/>
            <p>No hay invitados con email válido para enviar.</p>
            <p className="subtexto">
              Los invitados deben tener un email válido (no "SIN DATOS" o vacío) para aparecer aquí.
            </p>
          </div>
        ) : (
          <div className="contenedor-invitados">
            {invitadosConEmail.map((invitado, index) => (
              <div key={invitado.id} className={`tarjeta-invitado ${emailsEnviados[invitado.id] ? 'completado' : ''}`}>
                <div className="header-invitado">
                  <div className="info-invitado">
                    <span className="numero">{index + 1}.</span>
                    <span className="nombre">{invitado.nombre}</span>
                    <span className="grupo">{invitado.grupoNombre}</span>
                  </div>
                  
                  <div className="estado-envio">
                    {emailsEnviados[invitado.id] ? (
                      <span className="badge-completado">✓ Email Enviado</span>
                    ) : (
                      <span className="badge-pendiente">Pendiente</span>
                    )}
                  </div>
                </div>
                
                <div className="cuerpo-invitado">
                  <div className="datos-contacto">
                    <div className="dato-contacto">
                      <strong>Email:</strong> {invitado.email}
                    </div>
                    {invitado.telefono && invitado.telefono !== 'N/A' && invitado.telefono !== 'SIN DATOS' && (
                      <div className="dato-contacto">
                        <strong>Teléfono:</strong> {invitado.telefono}
                      </div>
                    )}
                  </div>
                  
                  <div className="vista-previa-mensaje">
                    <h4>Mensaje que se enviará:</h4>
                    <div className="contenido-mensaje">
                      <pre>{generarMensajeParaInvitado(invitado)}</pre>
                    </div>
                  </div>
                  
                  <div className="acciones-email">
                    <button
                      onClick={() => abrirEmail(invitado)}
                      className={`btn-generar-email ${emailsAbiertos[invitado.id] ? 'generado' : ''}`}
                    >
                      <FiMail />
                      {emailsAbiertos[invitado.id] ? '✓ Email Abierto' : '📧 Abrir Email'}
                    </button>
                    
                    <button
                      onClick={() => marcarComoEnviado(invitado.id)}
                      className={`btn-enviado ${emailsEnviados[invitado.id] ? 'completado' : ''}`}
                      disabled={emailsEnviados[invitado.id]}
                    >
                      <FiCheckCircle />
                      {emailsEnviados[invitado.id] ? '✓ Confirmado' : '✅ Marcar como Enviado'}
                    </button>
                    
                    <button
                      onClick={() => abrirClienteEmail(invitado.email)}
                      className="btn-abrir-email"
                      title="Abrir cliente de email vacío"
                    >
                      <FiSend />
                      Solo Email
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ACCIONES FINALES */}
      <div className="acciones-finales-mejoradas">
        <div className="resumen-progreso">
          <p>
            Progreso: <strong>{emailsCompletados} de {invitadosConEmail.length}</strong> emails procesados
          </p>
          {emailsCompletados > 0 && emailsCompletados === invitadosConEmail.length && (
            <p className="completado-total">🎉 ¡Todos los emails han sido procesados!</p>
          )}
        </div>
        
        <button
          onClick={finalizarProceso}
          className="btn-finalizar-mejorado"
        >
          ✅ Finalizar Proceso
        </button>
        
        <div className="notas-importantes">
          <p className="nota-importante">
            💡 El sistema abre tu cliente de email con todos los datos prellenados
          </p>
          <p className="nota-tecnica">
            📧 <strong>Nota:</strong> Debes tener configurado un cliente de email en tu dispositivo
          </p>
        </div>
      </div>
    </div>
  );
};

export default PasoMasivo6EmailEnvio;