// componentes/Paso1SeleccionInvitado.js
import React, { useState, useEffect } from 'react';
import '../assets/scss/_03-Componentes/_Paso1SeleccionInvitado.scss';

// ================================================
// COMPONENTE: Paso1SeleccionInvitado - VERSIÓN COMPACTA MEJORADA
// ================================================

const Paso1SeleccionInvitado = ({ 
  invitadoSeleccionado, 
  setInvitadoSeleccionado, 
  avanzarPaso 
}) => {
  // ESTADOS
  const [invitados, setInvitados] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gruposExpandidos, setGruposExpandidos] = useState({});

  // CARGA DE INVITADOS
  useEffect(() => {
    const cargarInvitados = async () => {
      try {
        setLoading(true);
        const response = await fetch('/invitados.json');
        if (!response.ok) throw new Error('Error cargando invitados');
        
        const data = await response.json();
        if (!data.grupos) throw new Error('Formato inválido');

        setGrupos(data.grupos);

        const invitadosProcesados = data.grupos.flatMap(grupo => 
          grupo.invitados?.map(invitado => ({
            ...invitado,
            grupoNombre: grupo.nombre,
            grupoId: grupo.id,
            telefono: invitado.Contacto?.whatsapp || invitado.Contacto?.telefono || '',
            enviado: JSON.parse(localStorage.getItem('estadosEnvio') || '{}')[invitado.id] || false
          })) || []
        );

        setInvitados(invitadosProcesados);
        
        // MODIFICACIÓN: Grupos colapsados por defecto
        const expandidos = {};
        data.grupos.forEach(grupo => {
          expandidos[grupo.id] = false; // Colapsar todos por defecto
        });
        setGruposExpandidos(expandidos);
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    cargarInvitados();
  }, []);

  // FILTRAR INVITADOS
  const invitadosFiltrados = busqueda 
    ? invitados.filter(invitado => 
        invitado.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        invitado.grupoNombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        (invitado.telefono && invitado.telefono.includes(busqueda))
      )
    : invitados;

  // TOGGLE GRUPOS
  const toggleGrupo = (grupoId) => {
    setGruposExpandidos(prev => ({ ...prev, [grupoId]: !prev[grupoId] }));
  };

  const toggleTodosGrupos = (expandir) => {
    const nuevosEstados = {};
    grupos.forEach(grupo => {
      nuevosEstados[grupo.id] = expandir;
    });
    setGruposExpandidos(nuevosEstados);
  };

  // HANDLERS
  const handleSeleccionInvitado = (invitado) => {
    setInvitadoSeleccionado(invitado);
  };

  const puedeAvanzar = () => invitadoSeleccionado !== null;

  // RENDER: ESTADOS
  if (loading) {
    return (
      <div className="estado-carga">
        <div className="spinner"></div>
        <p>Cargando invitados...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="estado-error">
        <h3>❌ Error</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="btn-reintentar">
          Reintentar
        </button>
      </div>
    );
  }

  // RENDER PRINCIPAL
  return (
    <div className="paso1-seleccion-invitado compacto-mejorado">
      
      {/* HEADER */}
      <div className="header-mejorado">
        <h2>Seleccionar Invitado</h2>
        <div className="controles-top">
          <div className="search-mejorado">
            <input
              type="text"
              placeholder="Buscar por nombre, grupo o teléfono..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="input-mejorado"
            />
            <span>🔍</span>
          </div>
          <div className="grupos-toggle">
            <button onClick={() => toggleTodosGrupos(true)} title="Expandir todos">📂</button>
            <button onClick={() => toggleTodosGrupos(false)} title="Colapsar todos">📁</button>
          </div>
        </div>
      </div>

      {/* LISTA COMPACTA */}
      <div className="lista-compacta-mejorada">
        {invitadosFiltrados.length === 0 ? (
          <div className="sin-resultados">
            <p>No hay resultados para "{busqueda}"</p>
            <button onClick={() => setBusqueda('')} className="btn-limpiar">
              Limpiar
            </button>
          </div>
        ) : (
          <div className="grupos-container">
            {grupos.map(grupo => {
              const invitadosGrupo = invitadosFiltrados.filter(inv => inv.grupoId === grupo.id);
              if (invitadosGrupo.length === 0) return null;
              
              return (
                <div key={grupo.id} className="grupo-mejorado">
                  <div className="header-grupo-mejorado" onClick={() => toggleGrupo(grupo.id)}>
                    <span className="toggle">{gruposExpandidos[grupo.id] ? '▼' : '►'}</span>
                    <span className="nombre-grupo">{grupo.nombre}</span>
                    <span className="contador">({invitadosGrupo.length})</span>
                  </div>

                  {gruposExpandidos[grupo.id] && invitadosGrupo.map(invitado => (
                    <div
                      key={invitado.id}
                      className={`item-mejorado ${invitadoSeleccionado?.id === invitado.id ? 'seleccionado' : ''} ${invitado.enviado ? 'enviado' : ''}`}
                      onClick={() => handleSeleccionInvitado(invitado)}
                    >
                      <div className="info-mejorada">
                        <span className="nombre">{invitado.nombre}</span>
                        {invitado.telefono && <span className="tel">• {invitado.telefono}</span>}
                      </div>
                      <div className="estados-mejorados">
                        {invitado.enviado && <span className="badge">✓</span>}
                        <span className="check">{invitadoSeleccionado?.id === invitado.id ? '✓' : ''}</span>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* INFO SELECCIONADO */}
      {invitadoSeleccionado && (
        <div className="seleccionado-info-mejorado">
          <span><strong>Seleccionado:</strong> {invitadoSeleccionado.nombre}</span>
          <span className="grupo-tag">{invitadoSeleccionado.grupoNombre}</span>
          {invitadoSeleccionado.enviado && <span className="enviado-tag">Enviado</span>}
        </div>
      )}

      {/* BOTÓN ACCIÓN */}
      {/* <div className="acciones-mejoradas">
        <button
          onClick={avanzarPaso}
          disabled={!puedeAvanzar()}
          className="btn-siguiente-mejorado"
        >
          Siguiente →
        </button>
        {!puedeAvanzar() && <span className="ayuda">Selecciona un invitado</span>}
      </div> */}
    </div>
  );
};

export default Paso1SeleccionInvitado;