import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/scss/_03-Componentes/_Paso0Pasos.scss';

// IMPORTAR COMPONENTES EN NUEVO ORDEN
import Paso1SeleccionInvitado from './Paso1SeleccionInvitado';
import Paso2CrearTarjeta from './Paso2CrearTarjeta';
import Paso3DescargarTarjeta from './Paso3DescargarTarjeta';
import Paso4CopiarMensaje from './Paso4CopiarMensaje';
import Paso5EnviarWhatsApp from './Paso5EnviarWhatsApp';

/**
 * COMPONENTE PRINCIPAL: Paso0Pasos
 * PROPÓSITO: Controlar el flujo completo de 5 pasos en NUEVO ORDEN
 */
const Paso0Pasos = () => {
  const navigate = useNavigate();
  
  // ESTADO PRINCIPAL: Controla el paso actual (1-5) en NUEVO ORDEN
  const [pasoActual, setPasoActual] = useState(1);
  
  // ESTADO: Datos del diseño de la invitación - CORREGIDO
  const [disenoInvitacion, setDisenoInvitacion] = useState(() => {
    const guardado = localStorage.getItem('disenoInvitacion');
    return guardado ? JSON.parse(guardado) : {
      nombresNovios: 'Ale y Fabi', // CORREGIDO: Sin "Boda"
      fecha: 'Domingo, 23 de noviembre de 2025', // CORREGIDO: Año 2025
      hora: '19:00 horas',
      lugar: 'Casa del Mar - Villa García Uriburu C. Seaglia 5400, Camet, Mar del Plata',
      codigoVestimenta: 'Elegante',
      linkUbicacion: 'https://noscasamos-aleyfabi.netlify.app/ubicacion',
      detallesRegalo: 'Nos viene bien juntar para la Luna de Miel. CBU o alias: 00000531313113 aleyfabicasamiento'
    };
  });

  // ESTADO: Invitado seleccionado (AHORA ES EL PRIMER PASO)
  const [invitadoSeleccionado, setInvitadoSeleccionado] = useState(() => {
    const guardado = localStorage.getItem('invitadoSeleccionado');
    return guardado ? JSON.parse(guardado) : null;
  });

  // EFECTOS para persistencia (se mantienen igual)
  useEffect(() => {
    localStorage.setItem('disenoInvitacion', JSON.stringify(disenoInvitacion));
  }, [disenoInvitacion]);

  useEffect(() => {
    localStorage.setItem('invitadoSeleccionado', JSON.stringify(invitadoSeleccionado));
  }, [invitadoSeleccionado]);

  // FUNCIÓN: Avanzar al siguiente paso
  const avanzarPaso = () => {
    if (pasoActual < 5) {
      setPasoActual(pasoActual + 1);
    }
  };

  // FUNCIÓN: Retroceder al paso anterior
  const retrocederPaso = () => {
    if (pasoActual > 1) {
      setPasoActual(pasoActual - 1);
    }
  };

  // FUNCIÓN: Ir a un paso específico
  const irAPaso = (numeroPaso) => {
    setPasoActual(numeroPaso);
  };

  // FUNCIÓN: Reiniciar el proceso completo
  const reiniciarProceso = () => {
    setInvitadoSeleccionado(null);
    setPasoActual(1);
    localStorage.removeItem('invitadoSeleccionado');
    localStorage.removeItem('disenoInvitacion'); // LIMPIAR DISEÑO INCORRECTO
  };

  // FUNCIÓN: Finalizar el proceso

const finalizarProceso = () => {
  if (invitadoSeleccionado) {
    const estadosEnvio = JSON.parse(localStorage.getItem('estadosEnvio') || '{}');
    estadosEnvio[invitadoSeleccionado.id] = true;
    localStorage.setItem('estadosEnvio', JSON.stringify(estadosEnvio));
  }
  
  // REINICIAR EL PROCESO AL PASO 1
  reiniciarProceso();
  
  navigate('/'); // o cualquier otra ruta que prefieras
};
  // RENDER: Barra de progreso con NUEVO ORDEN
  const renderBarraProgreso = () => (
    <div className="barra-progreso">
      {[1, 2, 3, 4, 5].map(paso => (
        <div key={paso} className={`paso-indicador ${paso === pasoActual ? 'activo' : ''} ${paso < pasoActual ? 'completado' : ''}`}>
          <div className="numero-paso">{paso}</div>
          <div className="texto-paso">
            {paso === 1 && 'Seleccionar Invitado'}
            {paso === 2 && 'Crear Tarjeta'}
            {paso === 3 && 'Descargar JPG'} 
            {paso === 4 && 'Copiar Mensaje'}
            {paso === 5 && 'Enviar WhatsApp'}
          </div>
        </div>
      ))}
    </div>
  );

  // RENDER: Controles de navegación
  const renderControlesNavegacion = () => (
    <div className="controles-navegacion">
      <button 
        onClick={retrocederPaso} 
        disabled={pasoActual === 1}
        className="btn btn-anterior"
      >
        ← Anterior
      </button>
      
      {pasoActual < 5 ? (
        <button 
          onClick={avanzarPaso} 
          className="btn btn-siguiente"
        >
          Siguiente →
        </button>
      ) : (
        <button 
          onClick={finalizarProceso} 
          className="btn btn-finalizar"
        >
          Finalizar ✓
        </button>
      )}
    </div>
  );

  // RENDER: Componente del paso actual en NUEVO ORDEN
  const renderPasoActual = () => {
    const propsComunes = {
      disenoInvitacion,
      setDisenoInvitacion,
      invitadoSeleccionado,
      setInvitadoSeleccionado,
      avanzarPaso
    };

    switch(pasoActual) {
      case 1:
        return <Paso1SeleccionInvitado {...propsComunes} />;
      case 2:
        return <Paso2CrearTarjeta {...propsComunes} />;
      case 3:
        return <Paso3DescargarTarjeta {...propsComunes} />;
      case 4:
        return <Paso4CopiarMensaje {...propsComunes} />;
      case 5:
        return <Paso5EnviarWhatsApp {...propsComunes} finalizarProceso={finalizarProceso} />;
      default:
        return <Paso1SeleccionInvitado {...propsComunes} />;
    }
  };

  // RENDER PRINCIPAL
  return (
    <div className="pasos-invitacion-container">
      <div className="encabezado-pasos">
        <h1>Crear y Enviar Invitación</h1>
        <p>Sigue estos 5 pasos para crear y enviar invitaciones personalizadas</p>
      </div>

      {renderBarraProgreso()}
      
      <div className="contenido-paso">
        {renderPasoActual()}
      </div>

      {renderControlesNavegacion()}
    </div>
  );
};

export default Paso0Pasos;