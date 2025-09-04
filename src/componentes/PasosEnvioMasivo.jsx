import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/scss/_03-Componentes/_PasosEnvioMasivo.scss';

// ---------------------------------------------------
// IMPORTACIÓN DE COMPONENTES DE CADA PASO MASIVO
// Cada uno de estos componentes representa un paso del flujo de envío masivo
// PasoMasivo1Seleccion: Selección de invitados
// PasoMasivo2Diseno: Diseño del mensaje o tarjeta
// PasoMasivo3Previsualizacion: Vista previa antes del envío
// PasoMasivo4Envio: Envío final de los mensajes
// ---------------------------------------------------
import PasoMasivo1Seleccion from './PasoMasivo1Seleccion';
import PasoMasivo2Diseno from './PasoMasivo2Diseno';
import PasoMasivo3Previsualizacion from './PasoMasivo3Previsualizacion';
import PasoMasivo4Envio from './PasoMasivo4Envio';

/**
 * COMPONENTE PRINCIPAL: PasosEnvioMasivo
 * PROPÓSITO: Controlar todo el flujo de envío masivo de invitaciones
 * CONEXIONES:
 * - Independiente del flujo individual de invitaciones
 * - Almacena datos en localStorage propio para no interferir con otros flujos
 * - Se comunica con los componentes de cada paso mediante props
 */
const PasosEnvioMasivo = () => {
  // ---------------------------------------------------
  // HOOK: useNavigate
  // Permite redirigir a otra ruta al finalizar el proceso
  // ---------------------------------------------------
  const navigate = useNavigate();
  
  // ---------------------------------------------------
  // ESTADO PRINCIPAL: Paso actual (1 a 4)
  // Controla cuál paso del flujo se está mostrando
  // ---------------------------------------------------
  const [pasoActual, setPasoActual] = useState(1);
  
  // ---------------------------------------------------
  // ESTADO: Lista de invitados seleccionados para el envío masivo
  // Se inicializa desde localStorage si existe algún dato previo
  // ---------------------------------------------------
  const [invitadosSeleccionados, setInvitadosSeleccionados] = useState(() => {
    const guardado = localStorage.getItem('invitadosMasivosSeleccionados');
    return guardado ? JSON.parse(guardado) : [];
  });
  
  // ---------------------------------------------------
  // ESTADO: Diseño de mensaje o plantilla para el envío masivo
  // Se inicializa desde localStorage si existe, o con un mensaje por defecto
  // ---------------------------------------------------
  const [disenoMasivo, setDisenoMasivo] = useState(() => {
    const guardado = localStorage.getItem('disenoMasivo');
    return guardado ? JSON.parse(guardado) : {
      mensajePersonalizado: `¡Hola {nombre}! 🎉\n\nEstás invitado a nuestra boda!\n\n📅 Domingo, 23 de noviembre de 2025\n🕒 19:00 horas\n📍 Casa del Mar - Villa García Uriburu\n\nConfirma tu asistencia aquí:\nhttps://confirmarasistenciaevento.netlify.app/\n\nUbicación:\nhttps://noscasamos-aleyfabi.netlify.app/ubicacion\n\n¡Esperamos verte! 💍\nAle y Fabi`
    };
  });

  // ---------------------------------------------------
  // EFECTOS: Sincronización con localStorage
  // Guarda los cambios en la lista de invitados y diseño de mensaje
  // Cada vez que cambian los estados, se actualiza localStorage
  // ---------------------------------------------------
  useEffect(() => {
    localStorage.setItem('invitadosMasivosSeleccionados', JSON.stringify(invitadosSeleccionados));
  }, [invitadosSeleccionados]);

  useEffect(() => {
    localStorage.setItem('disenoMasivo', JSON.stringify(disenoMasivo));
  }, [disenoMasivo]);

  // ---------------------------------------------------
  // FUNCIONES DE NAVEGACIÓN ENTRE PASOS
  // ---------------------------------------------------

  // Avanzar al siguiente paso
  const avanzarPaso = () => {
    if (pasoActual < 4) {
      setPasoActual(pasoActual + 1);
    }
  };

  // Retroceder al paso anterior
  const retrocederPaso = () => {
    if (pasoActual > 1) {
      setPasoActual(pasoActual - 1);
    }
  };

  // Ir a un paso específico
  const irAPaso = (numeroPaso) => {
    setPasoActual(numeroPaso);
  };

  // ---------------------------------------------------
  // FUNCIONES DE CONTROL DEL PROCESO MASIVO
  // ---------------------------------------------------

  // Reiniciar todo el proceso masivo y limpiar localStorage
  const reiniciarProcesoMasivo = () => {
    setInvitadosSeleccionados([]);
    setPasoActual(1);
    localStorage.removeItem('invitadosMasivosSeleccionados');
    localStorage.removeItem('disenoMasivo');
  };

  // Finalizar el proceso masivo y redirigir a la lista de invitados
  const finalizarProcesoMasivo = () => {
    reiniciarProcesoMasivo();
    navigate('/organizacion/invitados'); // Ruta de regreso
  };

  // ---------------------------------------------------
  // RENDERS AUXILIARES
  // ---------------------------------------------------

  // Renderiza la barra de progreso mostrando los 4 pasos
  const renderBarraProgreso = () => (
    <div className="barra-progreso-masivo">
      {[1, 2, 3, 4].map(paso => (
        <div key={paso} className={`paso-indicador-masivo ${paso === pasoActual ? 'activo' : ''} ${paso < pasoActual ? 'completado' : ''}`}>
          <div className="numero-paso-masivo">{paso}</div>
          <div className="texto-paso-masivo">
            {paso === 1 && 'Seleccionar Invitados'}
            {paso === 2 && 'Diseñar Mensaje'}
            {paso === 3 && 'Previsualizar'}
            {paso === 4 && 'Enviar Masivamente'}
          </div>
        </div>
      ))}
    </div>
  );

  // Renderiza los botones de navegación entre pasos
  const renderControlesNavegacion = () => (
    <div className="controles-navegacion-masivo">
      <button 
        onClick={retrocederPaso} 
        disabled={pasoActual === 1}
        className="btn btn-anterior-masivo"
      >
        ← Anterior
      </button>
      
      {pasoActual < 4 ? (
        <button 
          onClick={avanzarPaso} 
          className="btn btn-siguiente-masivo"
        >
          Siguiente →
        </button>
      ) : (
        <button 
          onClick={finalizarProcesoMasivo} 
          className="btn btn-finalizar-masivo"
        >
          Finalizar ✓
        </button>
      )}
    </div>
  );

  // Renderiza el componente correspondiente al paso actual
  const renderPasoActual = () => {
    // Props comunes que se pasan a todos los pasos
    const propsComunes = {
      disenoMasivo,
      setDisenoMasivo,
      invitadosSeleccionados,
      setInvitadosSeleccionados,
      avanzarPaso
    };

    switch(pasoActual) {
      case 1:
        return <PasoMasivo1Seleccion {...propsComunes} />;
      case 2:
        return <PasoMasivo2Diseno {...propsComunes} />;
      case 3:
        return <PasoMasivo3Previsualizacion {...propsComunes} />;
      case 4:
        return <PasoMasivo4Envio {...propsComunes} finalizarProceso={finalizarProcesoMasivo} />;
      default:
        return <PasoMasivo1Seleccion {...propsComunes} />;
    }
  };

  // ---------------------------------------------------
  // RENDER PRINCIPAL
  // ---------------------------------------------------
  return (
    <div className="pasos-envio-masivo-container">
      {/* Encabezado */}
      <div className="encabezado-pasos-masivo">
        <h1>Envío Masivo de Invitaciones</h1>
        <p>Sigue estos 4 pasos para enviar invitaciones a múltiples invitados a la vez</p>
      </div>

      {/* Barra de progreso */}
      {renderBarraProgreso()}
      
      {/* Contenido del paso actual */}
      <div className="contenido-paso-masivo">
        {renderPasoActual()}
      </div>

      {/* Controles de navegación */}
      {renderControlesNavegacion()}
    </div>
  );
};

export default PasosEnvioMasivo;
