import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/scss/_03-Componentes/_PasoMasivo0Pasos.scss';

// Importación de componentes
import PasoMasivo1Seleccion from './PasoMasivo1Seleccion';
import PasoMasivo2Diseno from './PasoMasivo2Diseno';
import PasoMasivo3DescargarTarjetas from './PasoMasivo3DescargarTarjetas';
import PasoMasivo4Previsualizacion from './PasoMasivo4Previsualizacion';
import PasoMasivo5WhatsAppEnvio from './PasoMasivo5WhatsAppEnvio';
import PasoMasivo6EmailEnvio from './PasoMasivo6EmailEnvio'; // Nuevo componente de email

const PasoMasivo0Pasos = () => {
  const navigate = useNavigate();
  const [pasoActual, setPasoActual] = useState(1);
  const [invitadosSeleccionados, setInvitadosSeleccionados] = useState(() => {
    const guardado = localStorage.getItem('invitadosMasivosSeleccionados');
    return guardado ? JSON.parse(guardado) : [];
  });
  const [disenoMasivo, setDisenoMasivo] = useState(() => {
    const guardado = localStorage.getItem('disenoMasivo');
    return guardado ? JSON.parse(guardado) : {
      mensajePersonalizado: `¡Hola {nombre}! 🎉\n\nEstás invitado a nuestra boda!\n\n📅 Domingo, 23 de noviembre de 2025\n🕒 19:00 horas\n📍 Casa del Mar - Villa García Uriburu - C. Seaglia 5400, Camet\n\nConfirma tu asistencia aquí:\nhttps://confirmarasistenciaevento.netlify.app/\n\nUbicación:\nhttps://noscasamos-aleyfabi.netlify.app/ubicacion\n\n¡Esperamos verte! 💍\nAle y Fabi`
    };
  });
  
  // NUEVO ESTADO: Método de envío seleccionado
  const [metodoEnvio, setMetodoEnvio] = useState(() => {
    const guardado = localStorage.getItem('metodoEnvioMasivo');
    return guardado ? JSON.parse(guardado) : 'whatsapp'; // 'whatsapp' o 'email'
  });

  // Sincronización con localStorage
  useEffect(() => {
    localStorage.setItem('invitadosMasivosSeleccionados', JSON.stringify(invitadosSeleccionados));
  }, [invitadosSeleccionados]);

  useEffect(() => {
    localStorage.setItem('disenoMasivo', JSON.stringify(disenoMasivo));
  }, [disenoMasivo]);

  // NUEVO: Sincronizar método de envío
  useEffect(() => {
    localStorage.setItem('metodoEnvioMasivo', JSON.stringify(metodoEnvio));
  }, [metodoEnvio]);

  // Funciones de navegación
  const avanzarPaso = () => {
    if (pasoActual < 6) {
      setPasoActual(pasoActual + 1);
    }
  };

  const retrocederPaso = () => {
    if (pasoActual > 1) {
      setPasoActual(pasoActual - 1);
    }
  };

  const irAPaso = (numeroPaso) => {
    setPasoActual(numeroPaso);
  };

  // Reiniciar proceso
  const reiniciarProcesoMasivo = () => {
    setInvitadosSeleccionados([]);
    setPasoActual(1);
    setMetodoEnvio('whatsapp');
    localStorage.removeItem('invitadosMasivosSeleccionados');
    localStorage.removeItem('disenoMasivo');
    localStorage.removeItem('metodoEnvioMasivo');
  };

  const finalizarProcesoMasivo = () => {
    reiniciarProcesoMasivo();
    navigate('/organizacion/invitados');
  };

  // NUEVO: Cambiar método de envío
  const cambiarMetodoEnvio = (nuevoMetodo) => {
    setMetodoEnvio(nuevoMetodo);
  };

  // Render de barra de progreso (ahora con 6 pasos)
  const renderBarraProgreso = () => (
    <div className="barra-progreso-masivo">
      {[1, 2, 3, 4, 5].map(paso => (
        <div key={paso} className={`paso-indicador-masivo ${paso === pasoActual ? 'activo' : ''} ${paso < pasoActual ? 'completado' : ''}`}>
          <div className="numero-paso-masivo">{paso}</div>
          <div className="texto-paso-masivo">
            {paso === 1 && 'Seleccionar Invitados'}
            {paso === 2 && 'Diseñar Mensaje'}
            {paso === 3 && 'Descargar Tarjetas'}
            {paso === 4 && 'Previsualizar'}
            {paso === 5 && 'Elegir Envío'} {/* Nuevo paso para elegir método */}
          </div>
        </div>
      ))}
    </div>
  );

  // Render de controles de navegación
  const renderControlesNavegacion = () => (
    <div className="controles-navegacion-masivo">
      <button 
        onClick={retrocederPaso} 
        disabled={pasoActual === 1}
        className="btn btn-anterior-masivo"
      >
        ← Anterior
      </button>
      
      {pasoActual < 5 ? (
        <button 
          onClick={avanzarPaso} 
          className="btn btn-siguiente-masivo"
        >
          Siguiente →
        </button>
      ) : pasoActual === 5 ? (
        <button 
          onClick={avanzarPaso} 
          className="btn btn-siguiente-masivo"
        >
          Continuar al Envío →
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

  // NUEVO: Paso para seleccionar método de envío
  const renderPasoSeleccionMetodo = () => (
    <div className="paso-seleccion-metodo">
      <div className="instrucciones-metodo">
        <h2>Paso 5: Seleccionar Método de Envío</h2>
        <p>Elige cómo deseas enviar las invitaciones a tus invitados</p>
      </div>

      <div className="opciones-metodo">
        <div 
          className={`opcion-metodo ${metodoEnvio === 'whatsapp' ? 'seleccionado' : ''}`}
          onClick={() => cambiarMetodoEnvio('whatsapp')}
        >
          <div className="icono-metodo">
            <span className="whatsapp-icon">💚</span>
          </div>
          <div className="info-metodo">
            <h3>WhatsApp</h3>
            <p>Envía mensajes e imágenes directamente por WhatsApp</p>
            <ul>
              <li>✓ Envío rápido y directo</li>
              <li>✓ Mayor tasa de respuesta</li>
              <li>✓ Ideal para contactos móviles</li>
            </ul>
          </div>
          <div className="selector-metodo">
            {metodoEnvio === 'whatsapp' && <div className="check">✓</div>}
          </div>
        </div>

        <div 
          className={`opcion-metodo ${metodoEnvio === 'email' ? 'seleccionado' : ''}`}
          onClick={() => cambiarMetodoEnvio('email')}
        >
          <div className="icono-metodo">
            <span className="email-icon">📧</span>
          </div>
          <div className="info-metodo">
            <h3>Email</h3>
            <p>Envía invitaciones completas por correo electrónico</p>
            <ul>
              <li>✓ Ideal para invitaciones formales</li>
              <li>✓ Incluye todos los detalles</li>
              <li>✓ Fácil de archivar y consultar</li>
            </ul>
          </div>
          <div className="selector-metodo">
            {metodoEnvio === 'email' && <div className="check">✓</div>}
          </div>
        </div>

        <div className="estadisticas-metodo">
          <div className="estadistica">
            <span className="numero">{invitadosSeleccionados.filter(inv => inv.telefono && inv.telefono !== 'N/A').length}</span>
            <span className="texto">Invitados con WhatsApp</span>
          </div>
          <div className="estadistica">
            <span className="numero">{invitadosSeleccionados.filter(inv => inv.email && inv.email !== 'N/A').length}</span>
            <span className="texto">Invitados con Email</span>
          </div>
          <div className="estadistica">
            <span className="numero">{invitadosSeleccionados.length}</span>
            <span className="texto">Total de Invitados</span>
          </div>
        </div>
      </div>
    </div>
  );

  // Render del paso actual
  const renderPasoActual = () => {
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
        return <PasoMasivo3DescargarTarjetas {...propsComunes} />;
      case 4:
        return <PasoMasivo4Previsualizacion {...propsComunes} />;
      case 5:
        return renderPasoSeleccionMetodo();
      case 6:
        // Paso 6: Envío según el método seleccionado
        if (metodoEnvio === 'whatsapp') {
          return <PasoMasivo5WhatsAppEnvio {...propsComunes} finalizarProceso={finalizarProcesoMasivo} />;
        } else {
          return <PasoMasivo6EmailEnvio {...propsComunes} finalizarProceso={finalizarProcesoMasivo} />;
        }
      default:
        return <PasoMasivo1Seleccion {...propsComunes} />;
    }
  };

  return (
    <div className="pasos-envio-masivo-container">
      <div className="encabezado-pasos-masivo">
        <h1>Envío Masivo de Invitaciones</h1>
        <p>Sigue estos {pasoActual <= 5 ? 6 : 5} pasos para enviar invitaciones a múltiples invitados a la vez</p>
      </div>

      {renderBarraProgreso()}
      
      <div className="contenido-paso-masivo">
        {renderPasoActual()}
      </div>

      {renderControlesNavegacion()}
    </div>
  );
};

export default PasoMasivo0Pasos;