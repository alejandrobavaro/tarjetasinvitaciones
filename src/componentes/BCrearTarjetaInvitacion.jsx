import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import { 
  FiUser,          // Icono invitado
  FiHeart,         // Icono corazón
  FiCalendar,      // Icono calendario
  FiClock,         // Icono reloj
  FiMapPin,        // Icono ubicación
  FiShoppingBag,   // Icono vestimenta (alternativa)
  FiGift           // Icono regalo
} from "react-icons/fi";
import { GiRing } from "react-icons/gi";
import '../assets/scss/_03-Componentes/_BCrearTarjetaInvitacion.scss';

// CONSTANTES GLOBALES
const FECHA_BODA = new Date(2025, 10, 23); // 23 de Noviembre 2025
const HORA_BODA = '19:00';
const NOMBRE_DEFAULT = 'Boda Ale y Fabi';
const LUGAR_DEFAULT = 'Casa del Mar - Villa García Uriburu C. Seaglia 5400, Camet, Mar del Plata';

const BCrearTarjetaInvitacion = () => {
  // ESTADO PRINCIPAL
  const [diseno, setDiseno] = useState({
    nombresNovios: NOMBRE_DEFAULT,
    fecha: FECHA_BODA.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    }),
    hora: `${HORA_BODA} horas`,
    lugar: LUGAR_DEFAULT,
    codigoVestimenta: 'Elegante',
    linkUbicacion: 'https://noscasamos-aleyfabi.netlify.app/ubicacion',
    detallesRegalo: 'Nos viene bien juntar para la Luna de Miel. CBU o alias: 00000531313113 aleyfabicasamiento'
  });

  // ESTADO COMPLEMENTARIO
  const [invitados, setInvitados] = useState([]);
  const [invitadoSeleccionado, setInvitadoSeleccionado] = useState(null);
  const tarjetaRef = useRef(null);
  const navigate = useNavigate();

  // EFECTO: Cargar lista de invitados
  useEffect(() => {
    const cargarInvitados = async () => {
      try {
        const response = await fetch('/invitados.json');
        if (!response.ok) throw new Error('Error al cargar invitados');
        const data = await response.json();
        setInvitados(data.grupos.flatMap(grupo => grupo.invitados));
      } catch (error) {
        console.error("Error cargando invitados:", error);
        alert('Error al cargar la lista de invitados');
      }
    };
    cargarInvitados();
  }, []);

  // FUNCIÓN: Generar mensaje para WhatsApp
  const generarMensajeWhatsApp = () => {
    if (!invitadoSeleccionado) return '';
    
    const linksGenerados = JSON.parse(localStorage.getItem('linksConfirmacion') || '{}');
    const linkConfirmacion = linksGenerados[invitadoSeleccionado.id]?.link ||
                          `${window.location.origin}/confirmar/${invitadoSeleccionado.id}`;

    return `¡Hola ${invitadoSeleccionado.nombre}! 🎉\n\n` +
      `Te invitamos a celebrar nuestro amor:\n` +
      `💍 ${diseno.nombresNovios}\n` +
      `📅 ${diseno.fecha}\n` +
      `🕒 ${diseno.hora}\n` +
      `📍 ${diseno.lugar.split('\n')[0]}\n\n` +
      `---- IMAGEN DE LA INVITACIÓN AQUÍ ----\n\n` +
      `*Información importante:*\n` +
      `🔹 Cómo llegar: ${diseno.linkUbicacion}\n\n` +
      `*Tu presencia es nuestro mejor regalo*\n` +
      `Si deseas contribuir a nuestra luna de miel:\n` +
      `💌 ${diseno.detallesRegalo}\n\n` +
      `*Confirmá tu asistencia aquí:*\n` +
      `👉 ${linkConfirmacion}\n\n` +
      `Con amor,\n${diseno.nombresNovios.split('de ')[1] || diseno.nombresNovios}`;
  };

  // FUNCIÓN: Copiar mensaje al portapapeles
  const copiarMensaje = () => {
    if (!invitadoSeleccionado) {
      alert('⚠️ Por favor selecciona un invitado primero');
      return;
    }
    navigator.clipboard.writeText(generarMensajeWhatsApp())
      .then(() => alert('✅ Mensaje copiado al portapapeles'))
      .catch(() => alert('❌ Error al copiar el mensaje'));
  };

  // FUNCIÓN: Descargar invitación como imagen
  const descargarInvitacion = async () => {
    if (!invitadoSeleccionado) {
      alert('⚠️ Selecciona un invitado primero');
      return;
    }

    try {
      const canvas = await html2canvas(tarjetaRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true,
        allowTaint: true,
        width: 500,
        height: 750
      });

      const link = document.createElement('a');
      const nombreInvitado = invitadoSeleccionado.nombre.replace(/\s+/g, '_');
      link.download = `Invitacion_${nombreInvitado}.jpg`;
      link.href = canvas.toDataURL('image/jpeg', 0.9);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error al generar la imagen:", error);
      alert('❌ Error al generar la invitación');
    }
  };

  // RENDER PRINCIPAL
  return (
    <div className="crear-tarjeta-container">
      <h1>Crear Invitación</h1>
      
      <div className="contenedor-principal">
        {/* COLUMNA IZQUIERDA: Formulario */}
        <div className="formulario-columna">
          <div className="formulario-simple">
            
            {/* Grupo 1: Selección de invitado */}
            <div className="form-group">
              <label>Seleccionar Invitado:</label>
              <select
                value={invitadoSeleccionado?.id || ''}
                onChange={(e) => {
                  const invitado = invitados.find(i => i.id === parseInt(e.target.value));
                  setInvitadoSeleccionado(invitado);
                }}
                required
              >
                <option value="">Seleccione un invitado</option>
                {invitados.map(invitado => (
                  <option key={invitado.id} value={invitado.id}>
                    {invitado.nombre} ({invitado.grupoNombre})
                  </option>
                ))}
              </select>
            </div>

            {/* Grupo 2: Datos de la boda */}
            <div className="form-group">
              <label>Nombres de los Novios:</label>
              <input
                type="text"
                value={diseno.nombresNovios}
                onChange={(e) => setDiseno({...diseno, nombresNovios: e.target.value})}
                placeholder="Ej: Boda de [Nombre] y [Nombre]"
              />
            </div>

            <div className="form-group">
              <label>Fecha:</label>
              <input
                type="text"
                value={diseno.fecha}
                readOnly
                className="campo-no-editable"
              />
            </div>

            <div className="form-group">
              <label>Hora:</label>
              <input
                type="text"
                value={diseno.hora}
                onChange={(e) => setDiseno({...diseno, hora: e.target.value})}
                placeholder="Ej: 19:00 horas"
              />
            </div>

            <div className="form-group">
              <label>Lugar:</label>
              <textarea
                value={diseno.lugar}
                onChange={(e) => setDiseno({...diseno, lugar: e.target.value})}
                rows="3"
                placeholder="Dirección completa del lugar"
              />
            </div>

            <div className="form-group">
              <label>Código de vestimenta:</label>
              <input
                type="text"
                value={diseno.codigoVestimenta}
                onChange={(e) => setDiseno({...diseno, codigoVestimenta: e.target.value})}
                placeholder="Ej: Formal, Elegante, etc."
              />
            </div>

            <div className="form-group">
              <label>Link de ubicación:</label>
              <input
                type="text"
                value={diseno.linkUbicacion}
                onChange={(e) => setDiseno({...diseno, linkUbicacion: e.target.value})}
                placeholder="URL de Google Maps o similar"
              />
            </div>

            <div className="form-group">
              <label>Si gustas hacernos un regalo:</label>
              <textarea
                value={diseno.detallesRegalo}
                onChange={(e) => setDiseno({...diseno, detallesRegalo: e.target.value})}
                rows="4"
                placeholder="Instrucciones para regalos o aportes"
              />
            </div>
          </div>

          {/* Botones de acción */}
          <div className="acciones-invitacion">
            <button
              onClick={descargarInvitacion}
              className="btn-descargar"
              disabled={!invitadoSeleccionado}
              aria-label="Descargar invitación"
            >
              📥 Descargar Invitación
            </button>
            <button
              onClick={copiarMensaje}
              className="btn-copiar"
              disabled={!invitadoSeleccionado}
              aria-label="Copiar mensaje para WhatsApp"
            >
              📱 Copiar Mensaje WhatsApp
            </button>
          </div>
        </div>

        {/* COLUMNA DERECHA: Vista previa */}
        <div className="preview-columna">
          <div className="preview-container" ref={tarjetaRef}>
            <div className="marco-invitacion">
              <div className="contenido-invitacion">
                {invitadoSeleccionado && (
                  <p className="nombre-invitado">
                    <FiUser className="icono-header" /> Querido/a {invitadoSeleccionado.nombre}
                  </p>
                )}
                
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
                  <p className="nombres-novios">{diseno.nombresNovios}</p>
                  
                  <div className="fecha-hora">
                    <p className="fecha">
                      <FiCalendar className="icono-detalle" /> {diseno.fecha}
                    </p>
                    <p className="hora">
                      <FiClock className="icono-detalle" /> {diseno.hora}
                    </p>
                  </div>
                  
                  <p className="lugar">
                    <FiMapPin className="icono-detalle" /> {diseno.lugar.split('\n')[0]}
                  </p>
                  
                  <p className="codigo-vestimenta">
  <FiShoppingBag className="icono-detalle" /> Vestimenta: {diseno.codigoVestimenta}
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
        </div>
      </div>
    </div>
  );
};

export default BCrearTarjetaInvitacion;