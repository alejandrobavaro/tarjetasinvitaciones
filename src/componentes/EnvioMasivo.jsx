// Importaciones al inicio SIEMPRE
import React, { useState } from 'react';
import '../assets/scss/_03-Componentes/_EnvioMasivo.scss';

/**
 * COMPONENTE: EnvioMasivo
 * PROPÓSITO: Permitir envío masivo de invitaciones a todos los invitados
 * CONEXIONES: 
 * - Recibe la lista de invitados como prop
 * - Genera mensajes personalizados para WhatsApp
 * - Copia todos los mensajes al portapapeles para enviar por WhatsApp Web
 */
const EnvioMasivo = ({ invitados }) => {
  // Estado para controlar el proceso de envío
  const [enviando, setEnviando] = useState(false);
  const [progreso, setProgreso] = useState(0);
  const [completado, setCompletado] = useState(false);

  // Función para generar mensaje personalizado para cada invitado
  const generarMensajePersonalizado = (invitado) => {
    return `¡Hola ${invitado.nombre}! 🎉\n\n` +
      `Estás invitado a nuestra boda!\n\n` +
      `Tu invitación personalizada:\n` +
      `https://tudominio.com/invitacion/${invitado.id}\n\n` +
      `Confirma tu asistencia aquí:\n` +
      `https://confirmarasistenciaevento.netlify.app/\n\n` +
      `Ubicación:\n` +
      `https://noscasamos-aleyfabi.netlify.app/ubicacion\n\n` +
      `¡Esperamos verte! 💍\n` +
      `Ale y Fabi`;
  };

  // Función para copiar todos los mensajes al portapapeles
  const copiarMensajesMasivos = async () => {
    setEnviando(true);
    setProgreso(0);
    setCompletado(false);
    
    const mensajes = [];
    
    for (let i = 0; i < invitados.length; i++) {
      const invitado = invitados[i];
      if (invitado.telefono && invitado.telefono !== 'Sin teléfono') {
        const mensaje = generarMensajePersonalizado(invitado);
        mensajes.push(mensaje);
        mensajes.push('');
      }
      setProgreso(((i + 1) / invitados.length) * 100);
      await new Promise(resolve => setTimeout(resolve, 10));
    }
    
    try {
      await navigator.clipboard.writeText(mensajes.join('\n\n'));
      setCompletado(true);
      alert(`¡Listo! Se copiaron ${invitados.length} mensajes al portapapeles.\n\nAhora ve a WhatsApp Web y pégalos en cada chat.`);
    } catch (error) {
      console.error('Error al copiar:', error);
      alert('Error al copiar. Puede que necesites permitir el acceso al portapapeles.');
    }
    
    setEnviando(false);
  };

  const invitadosConTelefono = invitados.filter(inv => 
    inv.telefono && inv.telefono !== 'Sin teléfono'
  ).length;

  return (
    <div className="envio-masivo">
      <div className="cabecera">
        <h3>🎊 Envío Masivo de Invitaciones</h3>
        <p>Envía invitaciones a todos tus invitados de una vez</p>
      </div>
      
      <div className="estadisticas">
        <div className="estadistica">
          <span className="numero">{invitados.length}</span>
          <span className="texto">Invitados totales</span>
        </div>
        <div className="estadistica">
          <span className="numero">{invitadosConTelefono}</span>
          <span className="texto">Con teléfono</span>
        </div>
      </div>
      
      <button 
        onClick={copiarMensajesMasivos}
        disabled={enviando || invitadosConTelefono === 0}
        className="btn-envio-masivo"
      >
        {enviando ? `Copiando... ${Math.round(progreso)}%` : '📋 Copiar todos los mensajes'}
      </button>
      
      {enviando && (
        <div className="progreso">
          <div className="barra-progreso">
            <div 
              className="progreso-llenado" 
              style={{ width: `${progreso}%` }}
            ></div>
          </div>
          <span className="porcentaje">{Math.round(progreso)}%</span>
        </div>
      )}
      
      {completado && (
        <div className="mensaje-completado">
          <span className="icono">✅</span>
          <span>¡Mensajes copiados al portapapeles!</span>
        </div>
      )}
      
      <div className="instrucciones">
        <h4>📋 Instrucciones:</h4>
        <ol>
          <li>Haz clic en "Copiar todos los mensajes"</li>
          <li>Ve a <a href="https://web.whatsapp.com" target="_blank" rel="noopener noreferrer">WhatsApp Web</a></li>
          <li>Pega los mensajes en el chat de cada invitado</li>
          <li>¡Listo! Todos recibirán su invitación personalizada</li>
        </ol>
        
        <div className="nota-importante">
          <strong>💡 Nota:</strong> Cada invitado recibirá un enlace único con su invitación personalizada.
        </div>
      </div>
    </div>
  );
};

export default EnvioMasivo;
