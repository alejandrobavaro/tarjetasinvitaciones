import React, { useRef } from 'react';
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
import '../assets/scss/_03-Componentes/_Paso2CrearTarjeta.scss'; 

/**
 * COMPONENTE: Paso2CrearTarjeta
 * PROPÓSITO: Segundo paso del flujo - Diseñar la tarjeta de invitación
 * CONEXIONES: 
 * - Recibe props del componente principal Paso0Pasos
 * - Se comunica con localStorage para guardar el diseño
 * - Previsualiza la tarjeta en tiempo real con el nombre del invitado
 */
const Paso2CrearTarjeta = ({ 
  disenoInvitacion, 
  setDisenoInvitacion, 
  invitadoSeleccionado, 
  avanzarPaso 
}) => {
  // REF: Para capturar la tarjeta y convertirla a imagen después
  const tarjetaRef = useRef(null);

  // CONSTANTES: Datos por defecto de la boda - CORREGIDO
  // Mes corregido: Noviembre = 10 (0 = Enero, 10 = Noviembre)
  const FECHA_BODA = new Date(2025, 10, 23); // 23 de Noviembre 2025 (mes 10 = Noviembre)
  const HORA_BODA = '19:00';
  const NOMBRE_DEFAULT = 'Boda Ale y Fabi';
  const LUGAR_DEFAULT = 'Casa del Mar - Villa García Uriburu C. Seaglia 5400, Camet';

  // EFECTO: Inicializar diseño si está vacío
  React.useEffect(() => {
    if (!disenoInvitacion.nombresNovios) {
      setDisenoInvitacion({
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
    }
  }, []);

  // FUNCIÓN: Manejar cambios en los campos del formulario
  const handleInputChange = (campo, valor) => {
    setDisenoInvitacion(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  // FUNCIÓN: Verificar si puede avanzar al siguiente paso
  const puedeAvanzar = () => {
    return disenoInvitacion.nombresNovios && 
           disenoInvitacion.fecha && 
           disenoInvitacion.hora && 
           disenoInvitacion.lugar;
  };

  // RENDER: Formulario de diseño de tarjeta
  return (
    <div className="paso2-crear-tarjeta">
      <div className="instrucciones">
        <h2>Paso 2: Diseña tu Tarjeta de Invitación</h2>
        <p>Personaliza todos los detalles de tu invitación. Todos los campos son editables excepto la fecha.</p>
      </div>

      {/* Información del invitado seleccionado */}
      {invitadoSeleccionado && (
        <div className="info-invitado-seleccionado">
          <h3>Invitado: {invitadoSeleccionado.nombre}</h3>
          <p>La tarjeta se personalizará para {invitadoSeleccionado.nombre}</p>
        </div>
      )}

      <div className="contenedor-principal">
        {/* COLUMNA IZQUIERDA: Formulario de diseño */}
        <div className="formulario-columna">
          <div className="formulario-simple">
            
            {/* Campo: Nombres de los Novios */}
            <div className="form-group">
              <label>Nombres de los Novios:</label>
              <input
                type="text"
                value={disenoInvitacion.nombresNovios}
                onChange={(e) => handleInputChange('nombresNovios', e.target.value)}
                placeholder="Ej: Boda de [Nombre] y [Nombre]"
              />
            </div>

            {/* Campo: Fecha (no editable) */}
            <div className="form-group">
              <label>Fecha:</label>
              <input
                type="text"
                value={disenoInvitacion.fecha}
                readOnly
                className="campo-no-editable"
              />
            </div>

            {/* Campo: Hora */}
            <div className="form-group">
              <label>Hora:</label>
              <input
                type="text"
                value={disenoInvitacion.hora}
                onChange={(e) => handleInputChange('hora', e.target.value)}
                placeholder="Ej: 19:00 horas"
              />
            </div>

            {/* Campo: Lugar */}
            <div className="form-group">
              <label>Lugar:</label>
              <textarea
                value={disenoInvitacion.lugar}
                onChange={(e) => handleInputChange('lugar', e.target.value)}
                rows="3"
                placeholder="Dirección completa del lugar"
              />
            </div>

            {/* Campo: Código de Vestimenta */}
            <div className="form-group">
              <label>Código de vestimenta:</label>
              <input
                type="text"
                value={disenoInvitacion.codigoVestimenta}
                onChange={(e) => handleInputChange('codigoVestimenta', e.target.value)}
                placeholder="Ej: Formal, Elegante, etc."
              />
            </div>

            {/* Campo: Link de Ubicación */}
            <div className="form-group">
              <label>Link de ubicación:</label>
              <input
                type="text"
                value={disenoInvitacion.linkUbicacion}
                onChange={(e) => handleInputChange('linkUbicacion', e.target.value)}
                placeholder="URL de Google Maps o similar"
              />
            </div>

            {/* Campo: Detalles de Regalo */}
            <div className="form-group">
              <label>Si gustas hacernos un regalo:</label>
              <textarea
                value={disenoInvitacion.detallesRegalo}
                onChange={(e) => handleInputChange('detallesRegalo', e.target.value)}
                rows="4"
                placeholder="Instrucciones para regalos o aportes"
              />
            </div>
          </div>

      
        </div>

        {/* COLUMNA DERECHA: Vista previa de la tarjeta */}
        <div className="preview-columna">
          <div className="preview-container">
            <h3>Vista Previa de tu Invitación:</h3>
            <div className="marco-invitacion-preview" ref={tarjetaRef}>
              <div className="contenido-invitacion">
                {/* Nombre del invitado (ya seleccionado en paso 1) */}
                {invitadoSeleccionado && (
                  <p className="nombre-invitado">
                    <FiUser className="icono-header" /> Querido/a {invitadoSeleccionado.nombre}
                  </p>
                )}
                
                {/* Encabezado con anillos decorativos */}
                <div className="encabezado-boda">
                  <GiRing className="icono-anillo izquierda" />
                  <h2 className="titulo-boda">¡Nos Casamos!</h2>
                  <GiRing className="icono-anillo derecha" />
                </div>
                
                {/* Frase destacada */}
                <p className="frase-destacada">
                  <FiHeart className="icono-corazon" /> "Juntos somos mejores" <FiHeart className="icono-corazon" />
                </p>
                
                {/* Separador elegante */}
                <div className="separador-elegante"></div>
                
                {/* Detalles principales de la boda */}
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
                
                {/* Pie de invitación */}
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
            
            {/* Nota informativa actualizada */}
            <div className="nota-preview">
              <p>💡 <strong>Nota:</strong> La tarjeta se ve exactamente como se descargará en el siguiente paso.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Paso2CrearTarjeta;