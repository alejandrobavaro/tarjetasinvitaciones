import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { 
  FiUser, FiHeart, FiCalendar, FiClock, FiMapPin, FiShoppingBag, FiGift, 
  FiDownload, FiCheckCircle, FiAlertCircle
} from "react-icons/fi";
import { GiRing } from "react-icons/gi";
import '../assets/scss/_03-Componentes/_PasoMasivo2BDescargarTarjetas.scss';

/**
 * COMPONENTE: PasoMasivo2BDescargarTarjetas
 * PROPÓSITO: Paso intermedio del flujo masivo - Descargar tarjetas JPG personalizadas para todos los invitados seleccionados
 * CONEXIONES: 
 * - Recibe props del componente principal PasosEnvioMasivo
 * - Usa html2canvas para convertir HTML a imágenes
 * - Genera tarjetas personalizadas con el nombre de cada invitado
 * - DISEÑO IDÉNTICO al componente Paso2CrearTarjeta y Paso3DescargarTarjeta
 */
const PasoMasivo2BDescargarTarjetas = ({ 
  disenoMasivo, 
  invitadosSeleccionados, 
  avanzarPaso 
}) => {
  // ================================================
  // REFERENCIAS Y ESTADOS
  // ================================================
  
  // REF: Para capturar el elemento DOM de la tarjeta plantilla
  const tarjetaRef = useRef(null);
  
  // ESTADO: Control del proceso de descarga masiva
  const [descargando, setDescargando] = useState(false);
  const [descargaCompletada, setDescargaCompletada] = useState(false);
  const [errorDescarga, setErrorDescarga] = useState(null);
  const [progresoDescarga, setProgresoDescarga] = useState(0);
  const [tarjetasGeneradas, setTarjetasGeneradas] = useState(0);

  // ================================================
  // CONSTANTES Y DATOS FIJOS DE LA BODA (IDÉNTICOS AL PASO 2)
  // ================================================
  
  const FECHA_BODA = new Date(2025, 10, 23); // 23 de Noviembre 2025
  const HORA_BODA = '19:00';
  const NOMBRE_NOVIOS = 'Boda Ale y Fabi';
  const LUGAR_BODA = 'Casa del Mar - Villa García Uriburu C. Seaglia 5400, Camet, Mar del Plata';
  const CODIGO_VESTIMENTA = 'Elegante';

  // ================================================
  // FUNCIÓN: Descargar imagen individual
  // ================================================
  
  const descargarImagen = (canvas, nombreArchivo) => {
    // Crear enlace de descarga
    const link = document.createElement('a');
    link.download = nombreArchivo;
    link.href = canvas.toDataURL('image/jpeg', 0.95); // Alta calidad JPG
    
    // Simular click para descargar
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ================================================
  // FUNCIÓN PRINCIPAL: Descargar todas las tarjetas individualmente
  // ================================================
  
  const descargarTodasTarjetas = async () => {
    // Validaciones iniciales
    if (!tarjetaRef.current || invitadosSeleccionados.length === 0) {
      setErrorDescarga('No hay tarjeta o invitados seleccionados');
      return;
    }

    // Configurar estado de descarga
    setDescargando(true);
    setErrorDescarga(null);
    setProgresoDescarga(0);
    setTarjetasGeneradas(0);

    try {
      // Descargar cada tarjeta individualmente
      for (let i = 0; i < invitadosSeleccionados.length; i++) {
        const invitado = invitadosSeleccionados[i];
        
        // Ocultar elementos no deseados durante la captura
        const elementosOcultar = tarjetaRef.current.querySelectorAll('.ocultar-al-descargar');
        elementosOcultar.forEach(el => el.style.display = 'none');
        
        // Actualizar nombre del invitado en la plantilla (IDÉNTICO AL PASO 2)
        const elementoNombre = tarjetaRef.current.querySelector('.nombre-invitado');
        if (elementoNombre) {
          elementoNombre.textContent = `Querido/a ${invitado.nombre}`;
        }

        // Generar imagen con html2canvas (alta calidad)
        const canvas = await html2canvas(tarjetaRef.current, {
          scale: 3, // Alta resolución
          backgroundColor: '#ffffff',
          logging: false,
          useCORS: true
        });

        // Restaurar elementos ocultos
        elementosOcultar.forEach(el => el.style.display = '');
        
        // Descargar imagen individual
        const nombreArchivo = `Invitacion_${invitado.nombre.replace(/[^\w\s]/gi, '').replace(/\s+/g, '_')}.jpg`;
        descargarImagen(canvas, nombreArchivo);
        
        // Actualizar progreso
        setProgresoDescarga(((i + 1) / invitadosSeleccionados.length) * 100);
        setTarjetasGeneradas(i + 1);

        // Pequeña pausa entre descargas para evitar sobrecarga
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      // Actualizar estado de éxito
      setDescargaCompletada(true);
      
    } catch (error) {
      console.error("Error al generar las imágenes:", error);
      setErrorDescarga('Error al generar las imágenes. Intenta nuevamente.');
    } finally {
      setDescargando(false);
    }
  };

  // ================================================
  // FUNCIÓN: Regenerar tarjetas (nuevo intento)
  // ================================================
  
  const regenerarTarjetas = () => {
    setDescargaCompletada(false);
    setErrorDescarga(null);
    setProgresoDescarga(0);
    setTarjetasGeneradas(0);
  };

  // ================================================
  // FUNCIÓN: Verificar si puede avanzar al siguiente paso
  // ================================================
  
  const puedeAvanzar = () => {
    return descargaCompletada;
  };

  // ================================================
  // RENDER: Barra de progreso de la descarga
  // ================================================
  
  const renderBarraProgreso = () => (
    <div className="barra-progreso-descarga">
      <div className="progreso-texto">
        Generando {tarjetasGeneradas} de {invitadosSeleccionados.length} tarjetas...
      </div>
      <div className="progreso-barra">
        <div 
          className="progreso-llenado" 
          style={{ width: `${progresoDescarga}%` }}
        ></div>
      </div>
      <div className="progreso-porcentaje">
        {Math.round(progresoDescarga)}% completado
      </div>
    </div>
  );

  // ================================================
  // RENDER PRINCIPAL del componente (DISEÑO IDÉNTICO AL PASO 2)
  // ================================================
  
  return (
    <div className="paso-masivo2b-descargar-tarjetas">
      
      {/* ENCABEZADO E INSTRUCCIONES */}
      <div className="instrucciones-masivo">
        <h2>Paso 3: Descargar Tarjetas de Invitación</h2>
        <p>Genera y descarga todas las tarjetas personalizadas en formato JPG para los invitados seleccionados.</p>
      </div>

      {/* INFORMACIÓN DE SELECCIÓN */}
      <div className="info-seleccion-masivo">
        <p>
          <strong>{invitadosSeleccionados.length}</strong> invitados seleccionados para generar tarjetas
        </p>
      </div>

      {/* VISTA PREVIA DE LA PLANTILLA - DISEÑO IDÉNTICO AL PASO 2 */}
      <div className="vista-previa-container">
        <h3>Plantilla de Tarjeta (Se usará para todos los invitados):</h3>
        
        <div className="tarjeta-wrapper">
          <div className="marco-invitacion-preview" ref={tarjetaRef}>
            <div className="contenido-invitacion">
              
              {/* NOMBRE DEL INVITADO (se actualiza dinámicamente) - IDÉNTICO AL PASO 2 */}
              <p className="nombre-invitado">
                <FiUser className="icono-header" /> Querido/a [Nombre]
              </p>
              
              {/* ENCABEZADO CON ANILLOS DECORATIVOS - IDÉNTICO AL PASO 2 */}
              <div className="encabezado-boda">
                <GiRing className="icono-anillo izquierda" />
                <h2 className="titulo-boda">¡Nos Casamos!</h2>
                <GiRing className="icono-anillo derecha" />
              </div>
              
              {/* FRASE DESTACADA - IDÉNTICO AL PASO 2 */}
              <p className="frase-destacada">
                <FiHeart className="icono-corazon" /> "Juntos somos mejores" <FiHeart className="icono-corazon" />
              </p>
              
              {/* SEPARADOR ELEGANTE - IDÉNTICO AL PASO 2 */}
              <div className="separador-elegante"></div>
              
              {/* DETALLES PRINCIPALES DE LA BODA - IDÉNTICO AL PASO 2 */}
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
              
              {/* SEPARADOR ELEGANTE - IDÉNTICO AL PASO 2 */}
              <div className="separador-elegante"></div>
              
              {/* PIE DE INVITACIÓN - IDÉNTICO AL PASO 2 */}
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

        {/* NOTA INFORMATIVA (oculta durante descarga) */}
        <div className="nota-descarga ocultar-al-descargar">
          <p>📝 <strong>Nota:</strong> Cada tarjeta se personalizará con el nombre del invitado correspondiente</p>
        </div>
      </div>

      {/* CONTROLES DE DESCARGA */}
      <div className="controles-descarga ocultar-al-descargar">
        
        {/* BOTÓN PRINCIPAL DE DESCARGA */}
        <button
          onClick={descargarTodasTarjetas}
          disabled={descargando || invitadosSeleccionados.length === 0}
          className="btn-descargar-masivo"
        >
          <FiDownload className="icono-descarga" />
          {descargando ? 'Generando...' : `Descargar ${invitadosSeleccionados.length} Tarjetas`}
        </button>

        {/* BARRA DE PROGRESO (visible durante descarga) */}
        {descargando && renderBarraProgreso()}

        {/* MENSAJE DE ÉXITO */}
        {descargaCompletada && (
          <div className="mensaje-exito-masivo">
            <FiCheckCircle className="icono-exito" />
            <span>¡Todas las tarjetas descargadas correctamente!</span>
            <p>Se han descargado {invitadosSeleccionados.length} invitaciones individuales.</p>
          </div>
        )}

        {/* MENSAJE DE ERROR */}
        {errorDescarga && (
          <div className="mensaje-error-masivo">
            <FiAlertCircle className="icono-error" />
            <span>{errorDescarga}</span>
            <button onClick={regenerarTarjetas} className="btn-reintentar">
              Reintentar
            </button>
          </div>
        )}
      </div>

      {/* LISTA DE INVITADOS PARA LA DESCARGA */}
      <div className="lista-invitados-descarga">
        <h4>📋 Invitados para generar tarjetas:</h4>
        <div className="lista-invitados">
          {invitadosSeleccionados.map((invitado, index) => (
            <div key={invitado.id} className="invitado-item">
              <span className="numero-invitado">{index + 1}.</span>
              <span className="nombre-invitado">{invitado.nombre}</span>
              <span className="grupo-invitado">{invitado.grupoNombre}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ACCIONES DEL PASO */}
      <div className="acciones-paso-masivo">
        {!puedeAvanzar() && descargaCompletada === false && (
          <p className="mensaje-ayuda-masivo">
            💡 Primero descarga todas las tarjetas para continuar
          </p>
        )}
      </div>

      {/* INSTRUCCIONES DE USO */}
      <div className="instrucciones-uso ocultar-al-descargar">
        <h4>💡 ¿Cómo funciona?</h4>
        <ul>
          <li>Se descargará una tarjeta JPG por cada invitado seleccionado</li>
          <li>Imágenes en alta calidad (300 DPI)</li>
          <li>Nombres de archivo organizados: "Invitacion_Nombre_Invitado.jpg"</li>
          <li>Listo para enviar por WhatsApp individualmente</li>
        </ul>
      </div>
    </div>
  );
};

export default PasoMasivo2BDescargarTarjetas;
