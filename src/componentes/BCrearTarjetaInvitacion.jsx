import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import '../assets/scss/_03-Componentes/_BCrearTarjetaInvitacion.scss';

const BCrearTarjetaInvitacion = () => {
  const [diseno, setDiseno] = useState({
    nombresNovios: 'Boda de Ale y Fabi',
    fecha: 'Sábado, 23 de Noviembre de 2025',
    hora: '19:00 horas',
    lugar: 'Casa del Mar - Villa García Uriburu\nC. Seaglia 5400, Camet, Mar del Plata',
    codigoVestimenta: 'Elegante',
    linkUbicacion: 'https://noscasamos-aleyfabi.netlify.app/ubicacion',
    linkVestimenta: 'https://noscasamos-aleyfabi.netlify.app/codigo-vestimenta',
    detallesRegalo: 'Nos viene bien juntar para la Luna de Miel.\nCBU o alias: 00000531313113\naleyfabicasamiento'
  });

  const [invitados, setInvitados] = useState([]);
  const [invitadoSeleccionado, setInvitadoSeleccionado] = useState(null);
  const tarjetaRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarInvitados = async () => {
      try {
        const response = await fetch('/invitados.json');
        const data = await response.json();
        setInvitados(data.grupos.flatMap(grupo => grupo.invitados));
      } catch (error) {
        console.error("Error cargando invitados:", error);
      }
    };
    cargarInvitados();
  }, []);

  const generarMensajeWhatsApp = () => {
    if (!invitadoSeleccionado) return '';
    return `¡Hola ${invitadoSeleccionado.nombre}! 🎉\n\n` +
      `Hoy compartimos contigo una alegría muy especial:\n` +
      `¡Nos casamos! 💍❤️\n\n` +
      `---- IMAGEN DE LA INVITACIÓN AQUÍ ----\n\n` +
      `*Información importante:*\n` +
      `📍 Cómo llegar: ${diseno.linkUbicacion}\n` +
      `👗 Código de vestimenta: ${diseno.linkVestimenta}\n\n` +
      `*Tu presencia es nuestro mejor regalo*\n` +
      `Si deseas contribuir a nuestra luna de miel:\n` +
      `💌 ${diseno.detallesRegalo}\n\n` +
      `*Confirmá tu asistencia aquí:*\n` +
      `👉 ${window.location.origin}/confirmar/${invitadoSeleccionado.id}\n\n` +
      `¡Esperamos celebrar este día especial contigo!\n` +
      `Con amor,\n${diseno.nombresNovios}`;
  };

  const copiarMensaje = () => {
    if (!invitadoSeleccionado) {
      alert('Por favor selecciona un invitado primero');
      return;
    }
    navigator.clipboard.writeText(generarMensajeWhatsApp());
    alert('Mensaje copiado al portapapeles');
  };

  const descargarInvitacion = async () => {
    try {
      const canvas = await html2canvas(tarjetaRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true,
        allowTaint: true,
        width: 500, // Ajusta el ancho del canvas
        height: 750, // Ajusta el alto del canvas
        x: 0, // Asegúrate de que el canvas comience desde la esquina superior izquierda
        y: 0, // Asegúrate de que el canvas comience desde la esquina superior izquierda
      });
  
      const link = document.createElement('a');
      link.download = `invitacion-${invitadoSeleccionado?.nombre || 'boda'}.jpg`;
      link.href = canvas.toDataURL('image/jpeg', 0.9);
      link.click();
    } catch (error) {
      console.error("Error al generar la imagen:", error);
    }
  };
  

  return (
    <div className="crear-tarjeta-container">
      <h1>Crear Invitación</h1>
      <div className="contenedor-principal">
        <div className="formulario-columna">
          <div className="formulario-simple">
            <div className="form-group">
              <label>Seleccionar Invitado:</label>
              <select
                value={invitadoSeleccionado?.id || ''}
                onChange={(e) => {
                  const invitado = invitados.find(i => i.id === parseInt(e.target.value));
                  setInvitadoSeleccionado(invitado);
                }}
              >
                <option value="">Seleccione un invitado</option>
                {invitados.map(invitado => (
                  <option key={invitado.id} value={invitado.id}>
                    {invitado.nombre} ({invitado.grupoNombre})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Nombres de los Novios:</label>
              <input
                type="text"
                value={diseno.nombresNovios}
                onChange={(e) => setDiseno({...diseno, nombresNovios: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Fecha:</label>
              <input
                type="text"
                value={diseno.fecha}
                onChange={(e) => setDiseno({...diseno, fecha: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Hora:</label>
              <input
                type="text"
                value={diseno.hora}
                onChange={(e) => setDiseno({...diseno, hora: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Lugar:</label>
              <textarea
                value={diseno.lugar}
                onChange={(e) => setDiseno({...diseno, lugar: e.target.value})}
                rows="3"
              />
            </div>
            <div className="form-group">
              <label>Código de vestimenta:</label>
              <input
                type="text"
                value={diseno.codigoVestimenta}
                onChange={(e) => setDiseno({...diseno, codigoVestimenta: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Link de ubicación:</label>
              <input
                type="text"
                value={diseno.linkUbicacion}
                onChange={(e) => setDiseno({...diseno, linkUbicacion: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Link código vestimenta:</label>
              <input
                type="text"
                value={diseno.linkVestimenta}
                onChange={(e) => setDiseno({...diseno, linkVestimenta: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Detalles del regalo:</label>
              <textarea
                value={diseno.detallesRegalo}
                onChange={(e) => setDiseno({...diseno, detallesRegalo: e.target.value})}
                rows="4"
              />
            </div>
          </div>
          <div className="acciones-invitacion">
            <button
              onClick={descargarInvitacion}
              className="btn-descargar"
              disabled={!invitadoSeleccionado}
            >
              Descargar Invitación
            </button>
            <button
              onClick={copiarMensaje}
              className="btn-copiar"
              disabled={!invitadoSeleccionado}
            >
              Copiar Mensaje WhatsApp
            </button>
          </div>
        </div>
        <div className="preview-columna">
          <div className="preview-container" ref={tarjetaRef}>
            <div className="marco-invitacion">
              <div className="contenido-invitacion">
                {invitadoSeleccionado && (
                  <p className="nombre-invitado">Querido/a {invitadoSeleccionado.nombre}</p>
                )}
                <h2>¡Nos Casamos!</h2>
                <p className="frase-destacada">"El amor es la razón de nuestro ser"</p>
                <div className="detalles-principales">
                  <p className="nombres-novios">{diseno.nombresNovios}</p>
                  <p>{diseno.fecha}</p>
                  <p>{diseno.hora}</p>
                  <p className="lugar-destacado">{diseno.lugar.split('\n')[0]}</p>
                  <p className="codigo-vestimenta">{diseno.codigoVestimenta}</p>
                  <p className="frase-cierre">¡Esperamos compartir este momento tan especial contigo!</p>
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
