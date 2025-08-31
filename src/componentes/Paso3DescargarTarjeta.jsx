import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { 
  FiUser, FiHeart, FiCalendar, FiClock, FiMapPin, FiShoppingBag, FiGift 
} from "react-icons/fi";
import { GiRing } from "react-icons/gi";
import '../assets/scss/_03-Componentes/_Paso3DescargarTarjeta.scss';

/**
 * COMPONENTE: Paso3DescargarTarjeta
 * PROPÓSITO: Tercer paso del flujo - Descargar la tarjeta como imagen JPG
 * CONEXIONES: 
 * - Recibe props del componente principal PasosInvitacion
 * - Usa html2canvas para convertir el HTML a imagen
 * - Genera la tarjeta personalizada con el nombre del invitado
 * - Muestra vista IDÉNTICA a la del Paso 2 para consistencia
 */
const Paso3DescargarTarjeta = ({ 
  disenoInvitacion, 
  invitadoSeleccionado, 
  avanzarPaso 
}) => {
  // REF: Para capturar el elemento DOM de la tarjeta
  const tarjetaRef = useRef(null);
  
  // ESTADO: Control del proceso de descarga
  const [descargando, setDescargando] = useState(false);
  const [descargaCompletada, setDescargaCompletada] = useState(false);
  const [errorDescarga, setErrorDescarga] = useState(null);

  // FUNCIÓN: Descargar la tarjeta como imagen JPG
  const descargarTarjeta = async () => {
    if (!tarjetaRef.current || !invitadoSeleccionado) {
      setErrorDescarga('No hay tarjeta o invitado seleccionado');
      return;
    }

    setDescargando(true);
    setErrorDescarga(null);

    try {
      // Ocultar elementos no deseados antes de capturar
      const elementosOcultar = tarjetaRef.current.querySelectorAll('.ocultar-al-descargar');
      elementosOcultar.forEach(el => el.style.display = 'none');
      
      // Configuración de html2canvas para mejor calidad
      const canvas = await html2canvas(tarjetaRef.current, {
        scale: 3, // Alta resolución para buena calidad
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true,
        allowTaint: true
      });

      // Restaurar elementos ocultos
      elementosOcultar.forEach(el => el.style.display = '');

      // Crear enlace de descarga
      const link = document.createElement('a');
      const nombreArchivo = `Invitacion_${invitadoSeleccionado.nombre.replace(/\s+/g, '_')}.jpg`;
      
      link.download = nombreArchivo;
      link.href = canvas.toDataURL('image/jpeg', 0.95); // Alta calidad JPG
      
      // Simular click para descargar
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Actualizar estado
      setDescargaCompletada(true);
      setTimeout(() => setDescargaCompletada(false), 3000);

    } catch (error) {
      console.error("Error al generar la imagen:", error);
      setErrorDescarga('Error al generar la imagen. Intenta nuevamente.');
    } finally {
      setDescargando(false);
    }
  };

  // FUNCIÓN: Regenerar la tarjeta (nueva descarga)
  const regenerarTarjeta = () => {
    setDescargaCompletada(false);
    setErrorDescarga(null);
  };

  // FUNCIÓN: Verificar si puede avanzar al siguiente paso
  const puedeAvanzar = () => {
    return descargaCompletada;
  };

  // RENDER PRINCIPAL del componente
  return (
    <div className="paso3-descargar-tarjeta">
      <div className="instrucciones">
        <h2>Paso 3: Descargar Tarjeta como Imagen</h2>
        <p>Descarga la tarjeta personalizada en formato JPG para enviar por WhatsApp.</p>
      </div>

      {/* Información del invitado */}
      {invitadoSeleccionado && (
        <div className="info-invitado">
          <h3>Invitado: {invitadoSeleccionado.nombre}</h3>
          <p>Grupo: {invitadoSeleccionado.grupoNombre}</p>
        </div>
      )}

      {/* Vista previa de la tarjeta - IDÉNTICA AL PASO 2 */}
      <div className="vista-previa-container">
        <h3>Vista Previa de la Tarjeta (Se descargará exactamente así):</h3>
        <div className="tarjeta-wrapper">
          <div className="marco-invitacion-preview" ref={tarjetaRef}>
            <div className="contenido-invitacion">
              {/* Nombre del invitado (personalizado) - MISMOS ICONOS QUE PASO 2 */}
              {invitadoSeleccionado && (
                <p className="nombre-invitado">
                  <FiUser className="icono-header" /> Querido/a {invitadoSeleccionado.nombre}
                </p>
              )}
              
              {/* Encabezado con anillos decorativos - MISMOS ICONOS QUE PASO 2 */}
              <div className="encabezado-boda">
                <GiRing className="icono-anillo izquierda" />
                <h2 className="titulo-boda">¡Nos Casamos!</h2>
                <GiRing className="icono-anillo derecha" />
              </div>
              
              {/* Frase destacada - MISMOS ICONOS QUE PASO 2 */}
              <p className="frase-destacada">
                <FiHeart className="icono-corazon" /> "Juntos somos mejores" <FiHeart className="icono-corazon" />
              </p>
              
              {/* Separador elegante */}
              <div className="separador-elegante"></div>
              
              {/* Detalles principales de la boda - MISMOS ICONOS QUE PASO 2 */}
              <div className="detalles-boda">
                <p className="nombres-novios">{disenoInvitacion.nombresNovios}</p>
                
                <div className="fecha-hora">
                  <p className="fecha">
                    <FiCalendar className="icono-detalle" /> {disenoInvitacion.fecha}
                  </p>
                  <p className="hora">
                    <FiClock className="icono-detalle" /> {disenoInvitacion.hora}
                  </p>
                </div>
                
                <p className="lugar">
                  <FiMapPin className="icono-detalle" /> {disenoInvitacion.lugar.split('\n')[0]}
                </p>
                
                <p className="codigo-vestimenta">
                  <FiShoppingBag className="icono-detalle" /> Vestimenta: {disenoInvitacion.codigoVestimenta}
                </p>
              </div>
              
              {/* Separador elegante */}
              <div className="separador-elegante"></div>
              
              {/* Pie de invitación - MISMOS ICONOS QUE PASO 2 */}
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

        {/* Nota sobre la descarga */}
        <div className="nota-descarga ocultar-al-descargar">
          <p>📝 <strong>Nota:</strong> La imagen se descargará en alta calidad sin este texto de ayuda</p>
        </div>
      </div>

      {/* Controles de descarga */}
      <div className="controles-descarga ocultar-al-descargar">
        <button
          onClick={descargarTarjeta}
          disabled={descargando || !invitadoSeleccionado}
          className="btn-descargar"
        >
          {descargando ? '⏳ Generando imagen...' : '📥 Descargar Tarjeta JPG'}
        </button>

        {descargaCompletada && (
          <div className="mensaje-exito">
            <span className="icono-exito">✅</span>
            ¡Tarjeta descargada correctamente!
          </div>
        )}

        {errorDescarga && (
          <div className="mensaje-error">
            <span className="icono-error">❌</span>
            {errorDescarga}
            <button onClick={regenerarTarjeta} className="btn-reintentar">
              Reintentar
            </button>
          </div>
        )}
      </div>

      {/* Acciones del paso */}
      <div className="acciones-paso ocultar-al-descargar">
     
        {!puedeAvanzar() && descargaCompletada === false && (
          <p className="mensaje-ayuda">
            💡 Primero descarga la tarjeta para continuar
          </p>
        )}
      </div>

      {/* Consejos de uso */}
      <div className="consejos-uso ocultar-al-descargar">
        <h4>💡 Consejos para enviar por WhatsApp:</h4>
        <ul>
          <li>Guarda la imagen en tu galería</li>
          <li>Abre WhatsApp y selecciona el contacto</li>
          <li>Envía la imagen como archivo (no como foto)</li>
          <li>Luego pega el mensaje que copiarás en el siguiente paso</li>
        </ul>
      </div>
    </div>
  );
};

export default Paso3DescargarTarjeta;