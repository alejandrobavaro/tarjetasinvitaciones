import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../assets/scss/_03-Componentes/_PaginaInvitacionPersonalizada.scss';

// RUTA: '/invitacion/:id' - Muestra la invitación web personalizada
const PaginaInvitacionPersonalizada = () => {
  // Obtener el ID del invitado desde la URL
  const { id } = useParams();
  
  // Estado para almacenar los datos del invitado
  const [invitado, setInvitado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Efecto para cargar los datos del invitado
  useEffect(() => {
    const cargarInvitado = async () => {
      try {
        setLoading(true);
        // Cargar el archivo JSON con todos los invitados
        const response = await fetch('/invitados.json');
        
        if (!response.ok) {
          throw new Error('No se pudo cargar la información');
        }
        
        const data = await response.json();
        
        // Buscar el invitado específico por ID
        let invitadoEncontrado = null;
        
        // Recorrer todos los grupos e invitados
        for (const grupo of data.grupos) {
          invitadoEncontrado = grupo.invitados.find(inv => inv.id === parseInt(id));
          if (invitadoEncontrado) {
            // Agregar nombre del grupo al objeto invitado
            invitadoEncontrado.grupoNombre = grupo.nombre;
            break;
          }
        }
        
        if (!invitadoEncontrado) {
          throw new Error('Invitado no encontrado');
        }
        
        setInvitado(invitadoEncontrado);
        setError(null);
      } catch (err) {
        console.error("Error cargando invitado:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    cargarInvitado();
  }, [id]); // Se ejecuta cuando cambia el ID

  // Mostrar estado de carga
  if (loading) {
    return (
      <div className="estado-carga">
        <div className="spinner"></div>
        <p>Cargando invitación...</p>
      </div>
    );
  }

  // Mostrar error si ocurrió alguno
  if (error) {
    return (
      <div className="estado-error">
        <h3>❌ Error</h3>
        <p>{error}</p>
        <a href="/" className="btn-volver">
          Volver al inicio
        </a>
      </div>
    );
  }

  // Renderizar la invitación personalizada
  return (
    <div className="pagina-invitacion-personalizada">
      <div className="contenedor-invitacion">
        {/* Encabezado con nombre personalizado */}
        <div className="encabezado">
          <h1>¡Querido {invitado.nombre}!</h1>
          <p>Estás invitado a celebrar nuestro amor</p>
        </div>
        
        {/* Información principal de la boda */}
        <div className="info-principal">
          <h2>Ale y Fabi</h2>
          <div className="separador"></div>
          <p>Se casan</p>
          <div className="separador"></div>
        </div>
        
        {/* Detalles de la boda */}
        <div className="detalles-boda">
          <div className="fecha">
            <span className="icono">📅</span>
            <span>Domingo, 23 de noviembre de 2025</span>
          </div>
          
          <div className="hora">
            <span className="icono">🕒</span>
            <span>19:00 horas</span>
          </div>
          
          <div className="lugar">
            <span className="icono">📍</span>
            <span>Casa del Mar - Villa García Uriburu<br />C. Seaglia 5400, Camet, Mar del Plata</span>
          </div>
        </div>
        
        {/* Código de vestimenta */}
        <div className="vestimenta">
          <p><strong>Vestimenta:</strong> Elegante</p>
        </div>
        
        {/* Nota sobre niños */}
        <div className="nota-ninos">
          <p>👶 Niños - Dulces Sueños</p>
        </div>
        
        {/* Botones de acción */}
        <div className="botones-accion">
          <a 
            href="https://confirmarasistenciaevento.netlify.app/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-confirmar"
          >
            Confirmar Asistencia
          </a>
          
          <a 
            href="https://noscasamos-aleyfabi.netlify.app/ubicacion" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-ubicacion"
          >
            Ver Ubicación
          </a>
        </div>
        
        {/* Información de regalos */}
        <div className="info-regalos">
          <p>💝 <strong>Si deseas hacernos un regalo:</strong></p>
          <p>Nos viene bien juntar para la Luna de Miel</p>
          <p>CBU o alias: 00000531313113 aleyfabicasamiento</p>
        </div>
        
        {/* Mensaje final */}
        <div className="mensaje-final">
          <p>¡Esperamos compartir este día especial contigo!</p>
          <p>Con amor, Ale y Fabi 💕</p>
        </div>
      </div>
    </div>
  );
};

export default PaginaInvitacionPersonalizada;