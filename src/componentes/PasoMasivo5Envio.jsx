import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { 
  FiUser, FiHeart, FiCalendar, FiClock, FiMapPin, FiShoppingBag, FiGift, 
  FiDownload, FiCheckCircle, FiAlertCircle, FiCopy, FiImage, FiSend
} from "react-icons/fi";
import { GiRing } from "react-icons/gi";
import '../assets/scss/_03-Componentes/_PasoMasivo5Envio.scss';

const PasoMasivo5Envio = ({ 
  disenoMasivo, 
  invitadosSeleccionados, 
  finalizarProceso 
}) => {
  const [mensajesGenerados, setMensajesGenerados] = useState([]);
  const [copiadoIndex, setCopiadoIndex] = useState(null);
  const [todosCopiados, setTodosCopiados] = useState(false);
  const [copiandoImagen, setCopiandoImagen] = useState(null);
  const tarjetaRef = useRef(null);

  // Constantes de la boda
  const FECHA_BODA = new Date(2025, 10, 23);
  const HORA_BODA = '19:00';
  const NOMBRE_NOVIOS = 'Boda Ale y Fabi';
  const LUGAR_BODA = 'Casa del Mar - Villa García Uriburu C. Seaglia 5400, Camet';
  const CODIGO_VESTIMENTA = 'Elegante';

  // Función para actualizar estado de envío en localStorage
  const actualizarEstadoEnvio = (invitadoId, enviado) => {
    try {
      const estadosEnvio = JSON.parse(localStorage.getItem('estadosEnvio') || '{}');
      estadosEnvio[invitadoId] = enviado;
      localStorage.setItem('estadosEnvio', JSON.stringify(estadosEnvio));
      
      // Disparar evento para actualizar otros componentes
      window.dispatchEvent(new Event('estadosEnvioActualizados'));
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      console.error('Error al actualizar estado de envío:', error);
    }
  };

  const generarMensajeParaInvitado = (invitado) => {
    if (!disenoMasivo.mensajePersonalizado) return '';
    
    return disenoMasivo.mensajePersonalizado
      .replace(/{nombre}/g, invitado.nombre)
      .replace(/{grupo}/g, invitado.grupoNombre)
      .replace(/{telefono}/g, invitado.telefono);
  };

  React.useEffect(() => {
    const mensajes = invitadosSeleccionados.map(invitado => ({
      invitado,
      mensaje: generarMensajeParaInvitado(invitado),
      copiado: false,
      imagenCopiada: false,
      enviado: JSON.parse(localStorage.getItem('estadosEnvio') || '{}')[invitado.id] || false
    }));
    setMensajesGenerados(mensajes);
  }, [invitadosSeleccionados, disenoMasivo]);

  const copiarMensaje = async (mensaje, index) => {
    try {
      await navigator.clipboard.writeText(mensaje);
      setCopiadoIndex(index);
      
      const nuevosMensajes = [...mensajesGenerados];
      nuevosMensajes[index].copiado = true;
      setMensajesGenerados(nuevosMensajes);
      
      setTimeout(() => setCopiadoIndex(null), 2000);
    } catch (error) {
      console.error('Error al copiar:', error);
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = mensaje;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      setCopiadoIndex(index);
      setTimeout(() => setCopiadoIndex(null), 2000);
    }
  };

  const copiarImagenTarjeta = async (invitado, index) => {
    setCopiandoImagen(index);
    
    try {
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'fixed';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '0';
      document.body.appendChild(tempDiv);

      const tarjetaClone = tarjetaRef.current.cloneNode(true);
      const elementoNombre = tarjetaClone.querySelector('.nombre-invitado');
      if (elementoNombre) {
        elementoNombre.textContent = `Querido/a ${invitado.nombre}`;
      }

      tempDiv.appendChild(tarjetaClone);

      const canvas = await html2canvas(tarjetaClone, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true
      });

      document.body.removeChild(tempDiv);

      canvas.toBlob(async (blob) => {
        try {
          const item = new ClipboardItem({ 'image/png': blob });
          await navigator.clipboard.write([item]);
          
          const nuevosMensajes = [...mensajesGenerados];
          nuevosMensajes[index].imagenCopiada = true;
          setMensajesGenerados(nuevosMensajes);
          
        } catch (error) {
          console.error('Error al copiar imagen:', error);
          // Fallback: Descargar imagen
          const link = document.createElement('a');
          link.download = `Invitacion_${invitado.nombre.replace(/[^\w\s]/gi, '').replace(/\s+/g, '_')}.png`;
          link.href = canvas.toDataURL();
          link.click();
        }
      });
      
    } catch (error) {
      console.error('Error al generar la imagen:', error);
      alert('Error al generar la imagen. Se descargará la imagen en su lugar.');
    } finally {
      setCopiandoImagen(null);
    }
  };

  const marcarComoEnviado = (invitadoId, index) => {
    actualizarEstadoEnvio(invitadoId, true);
    
    const nuevosMensajes = [...mensajesGenerados];
    nuevosMensajes[index].enviado = true;
    setMensajesGenerados(nuevosMensajes);
  };

  const copiarTodosMensajes = async () => {
    const todosLosMensajes = mensajesGenerados
      .map((item, index) => `=== Mensaje ${index + 1} para ${item.invitado.nombre} ===\n\n${item.mensaje}\n\n`)
      .join('\n');
    
    try {
      await navigator.clipboard.writeText(todosLosMensajes);
      setTodosCopiados(true);
      
      const nuevosMensajes = mensajesGenerados.map(item => ({
        ...item,
        copiado: true
      }));
      setMensajesGenerados(nuevosMensajes);
      
      setTimeout(() => setTodosCopiados(false), 3000);
    } catch (error) {
      console.error('Error al copiar todos:', error);
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = todosLosMensajes;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      setTodosCopiados(true);
      setTimeout(() => setTodosCopiados(false), 3000);
    }
  };

  const abrirWhatsApp = (telefono) => {
    const numeroLimpio = telefono.replace(/\D/g, '');
    if (numeroLimpio) {
      window.open(`https://wa.me/${numeroLimpio}`, '_blank');
    }
  };

  const reiniciarProceso = () => {
    const nuevosMensajes = mensajesGenerados.map(item => ({
      ...item,
      copiado: false,
      imagenCopiada: false
    }));
    setMensajesGenerados(nuevosMensajes);
    setTodosCopiados(false);
    setCopiadoIndex(null);
    setCopiandoImagen(null);
  };

  return (
    <div className="paso-masivo5-envio compacto-mejorado">
      {/* HEADER */}
      <div className="header-mejorado">
        <h2>Envío Manual de Invitaciones</h2>
        <div className="info-seleccion-header">
          <p>
            <strong>{invitadosSeleccionados.length}</strong> invitados seleccionados
          </p>
        </div>
      </div>

      {/* PLANTILLA OCULTA PARA GENERAR TARJETAS */}
      <div style={{ display: 'none' }}>
        <div className="marco-invitacion-preview" ref={tarjetaRef}>
          <div className="contenido-invitacion">
            <p className="nombre-invitado">
              <FiUser className="icono-header" /> Querido/a [Nombre]
            </p>
            
            <div className="encabezado-boda">
              <GiRing className="icono-anillo izquierda" />
              <h2 className="titulo-boda">¡Nos Casamos!</h2>
              <GiRing className="icono-anillo derecha" />
            </div>
            
            <p className="frase-destacada">
              <FiHeart className="icono-corazon" /> "Juntos somos mejores" <FiHeart className="icono-corazon" />
            </p>
            
            <div className="separador-elegante"></div>
            
            <div className="detalles-boda">
              <p className="nombres-novios">{NOMBRE_NOVIOS}</p>
              
              <div className="fecha-hora">
                <p className="fecha">
                  <FiCalendar className="icono-detalle" /> {FECHA_BODA.toLocaleDateString('es-ES', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </p>
                <p className="hora">
                  <FiClock className="icono-detalle" /> {HORA_BODA} horas
                </p>
              </div>
              
              <p className="lugar">
                <FiMapPin className="icono-detalle" /> {LUGAR_BODA}
              </p>
              
              <p className="codigo-vestimenta">
                <FiShoppingBag className="icono-detalle" /> Vestimenta: {CODIGO_VESTIMENTA}
              </p>
            </div>
            
            <div className="separador-elegante"></div>
            
            <div className="pie-invitacion">
              <p className="nota-ninos">
                <FiGift className="icono-detalle" /> Niños Dulces Sueños
              </p>
              <p className="frase-cierre">
                <FiHeart className="icono-corazon" /> Por favor, confirmar asistencia
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* INSTRUCCIONES PRINCIPALES */}
      <div className="instrucciones-principales">
        <div className="tarjeta-instrucciones">
          <h3>📋 Proceso de 3 Pasos por Invitado:</h3>
          <ol>
            <li><strong>Paso A:</strong> Copiar mensaje y pegarlo en WhatsApp</li>
            <li><strong>Paso B:</strong> Copiar imagen y pegarla en WhatsApp</li>
            <li><strong>Paso C:</strong> Confirmar envío completo</li>
          </ol>
          
          <div className="acciones-globales">
            <button 
              onClick={copiarTodosMensajes}
              className="btn-copiar-todos"
              disabled={mensajesGenerados.length === 0}
            >
              {todosCopiados ? '✓ Todos Copiados' : '📋 Copiar Todos los Mensajes'}
            </button>
            
            <button 
              onClick={reiniciarProceso}
              className="btn-reiniciar"
            >
              🔄 Reiniciar Estados
            </button>
          </div>
        </div>
      </div>

      {/* LISTA DE MENSAJES Y TARJETAS PARA ENVÍO */}
      <div className="lista-mensajes-envio">
        <h3>✉️ Proceso de Envío por Invitado</h3>
        
        {mensajesGenerados.length === 0 ? (
          <div className="sin-mensajes">
            <p>No hay mensajes para mostrar. Verifica que tengas invitados seleccionados.</p>
          </div>
        ) : (
          <div className="contenedor-mensajes">
            {mensajesGenerados.map((item, index) => (
              <div key={item.invitado.id} className={`tarjeta-mensaje ${item.enviado ? 'completado' : ''}`}>
                <div className="header-mensaje">
                  <div className="info-invitado">
                    <span className="numero">{index + 1}.</span>
                    <span className="nombre">{item.invitado.nombre}</span>
                    <span className="grupo">{item.invitado.grupoNombre}</span>
                  </div>
                  
                  <div className="estado-envio">
                    {item.enviado ? (
                      <span className="badge-completado">✓ Completado</span>
                    ) : (
                      <span className="badge-progreso">
                        {item.copiado && item.imagenCopiada ? 'Paso C Pendiente' :
                         item.copiado ? 'Paso B Pendiente' :
                         'Paso A Pendiente'}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="cuerpo-mensaje">
                  <div className="vista-previa-mensaje">
                    <pre>{item.mensaje}</pre>
                  </div>
                  
                  <div className="proceso-tres-pasos">
                    {/* PASO A: Copiar Mensaje */}
                    <div className={`paso ${item.copiado ? 'completado' : 'pendiente'}`}>
                      <div className="numero-paso">A</div>
                      <div className="info-paso">
                        <h4>Paso A: Copiar Mensaje</h4>
                        <p>Copiar el mensaje personalizado</p>
                      </div>
                      <button
                        onClick={() => copiarMensaje(item.mensaje, index)}
                        className={`btn-paso ${item.copiado ? 'completado' : ''}`}
                        disabled={copiandoImagen === index}
                      >
                        {copiadoIndex === index ? '✓ Copiado!' : '📝 Copiar Mensaje'}
                      </button>
                    </div>

                    {/* PASO B: Copiar Imagen */}
                    <div className={`paso ${item.imagenCopiada ? 'completado' : 'pendiente'}`}>
                      <div className="numero-paso">B</div>
                      <div className="info-paso">
                        <h4>Paso B: Copiar Imagen</h4>
                        <p>Copiar la tarjeta de invitación</p>
                      </div>
                      <button
                        onClick={() => copiarImagenTarjeta(item.invitado, index)}
                        className={`btn-paso ${item.imagenCopiada ? 'completado' : ''}`}
                        disabled={copiandoImagen === index}
                      >
                        {copiandoImagen === index ? '⏳ Generando...' : 
                         item.imagenCopiada ? '✓ Imagen Copiada' : '🖼️ Copiar Imagen'}
                      </button>
                    </div>

                    {/* PASO C: Confirmar Envío */}
                    <div className={`paso ${item.enviado ? 'completado' : 'pendiente'}`}>
                      <div className="numero-paso">C</div>
                      <div className="info-paso">
                        <h4>Paso C: Confirmar Envío</h4>
                        <p>Marca como enviado cuando completes</p>
                      </div>
                      <button
                        onClick={() => marcarComoEnviado(item.invitado.id, index)}
                        className={`btn-paso btn-enviado ${item.enviado ? 'completado' : ''}`}
                        disabled={!item.copiado || !item.imagenCopiada || item.enviado}
                      >
                        {item.enviado ? '✓ Enviado' : '✅ Marcar como Enviado'}
                      </button>
                    </div>
                  </div>
                  
                  <div className="acciones-secundarias">
                    {item.invitado.telefono && item.invitado.telefono !== 'Sin teléfono' && (
                      <button
                        onClick={() => abrirWhatsApp(item.invitado.telefono)}
                        className="btn-abrir-whatsapp"
                      >
                        💬 Abrir WhatsApp
                      </button>
                    )}
                    
                    <span className="telefono">
                      📱 {item.invitado.telefono || 'Sin teléfono'}
                    </span>
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
            Progreso General: <strong>
              {mensajesGenerados.filter(m => m.enviado).length} de {mensajesGenerados.length}
            </strong> invitados completados
          </p>
          <div className="detalles-progreso">
            <span>Paso A: {mensajesGenerados.filter(m => m.copiado).length}</span>
            <span>Paso B: {mensajesGenerados.filter(m => m.imagenCopiada).length}</span>
            <span>Paso C: {mensajesGenerados.filter(m => m.enviado).length}</span>
          </div>
        </div>
        
        {/* <button
          onClick={finalizarProceso}
          className="btn-finalizar-mejorado"
        >
          ✅ Finalizar Proceso
        </button> */}
        
        <div className="notas-importantes">
          <p className="nota-importante">
            💡 Recuerda seguir el proceso de 3 pasos para cada invitado
          </p>
          <p className="nota-tecnica">
            🖼️ <strong>Nota:</strong> La función de copiar imagen funciona mejor en Chrome/Edge. 
            Si falla, se descargará la imagen automáticamente.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PasoMasivo5Envio;