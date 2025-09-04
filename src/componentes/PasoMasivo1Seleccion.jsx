import React, { useState, useEffect } from 'react';
import '../assets/scss/_03-Componentes/_PasoMasivo1Seleccion.scss';

/**
 * COMPONENTE: PasoMasivo1Seleccion
 * PROPÓSITO: Primer paso del flujo masivo - Seleccionar múltiples invitados
 * CONEXIONES: 
 * - Carga la lista completa de invitados
 * - Permite selección múltiple con checkboxes
 * - Filtros y búsqueda para encontrar invitados fácilmente
 */
const PasoMasivo1Seleccion = ({ 
  invitadosSeleccionados, 
  setInvitadosSeleccionados, 
  avanzarPaso 
}) => {
  // ESTADO: Lista completa de invitados
  const [invitados, setInvitados] = useState([]);
  // ESTADO: Término de búsqueda
  const [busqueda, setBusqueda] = useState('');
  // ESTADO: Filtro de estado de envío
  const [filtroEnvio, setFiltroEnvio] = useState('todos');
  // ESTADO: Control de carga y errores
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // ESTADO: Grupos expandidos/colapsados
  const [gruposExpandidos, setGruposExpandidos] = useState({});
  // ESTADO: Lista de grupos
  const [grupos, setGrupos] = useState([]);

  // EFECTO: Cargar lista de invitados
  useEffect(() => {
    const cargarInvitados = async () => {
      try {
        setLoading(true);
        const response = await fetch('/invitados.json');
        
        if (!response.ok) {
          throw new Error('No se pudo cargar la lista de invitados');
        }
        
        const data = await response.json();
        
        if (!data.grupos || !Array.isArray(data.grupos)) {
          throw new Error('Formato de datos inválido en invitados.json');
        }

        setGrupos(data.grupos);

        // Procesar y aplanar la lista de invitados
        const invitadosProcesados = data.grupos.flatMap(grupo => {
          if (!grupo.invitados || !Array.isArray(grupo.invitados)) {
            return [];
          }
          
          return grupo.invitados.map(invitado => ({
            ...invitado,
            grupoNombre: grupo.nombre,
            grupoId: grupo.id,
            telefono: invitado.Contacto?.whatsapp || invitado.Contacto?.telefono || 'Sin teléfono',
            // Cargar estado de envío desde localStorage si existe
            enviado: JSON.parse(localStorage.getItem('estadosEnvio') || '{}')[invitado.id] || false
          }));
        });

        setInvitados(invitadosProcesados);
        setError(null);
        
        // Colapsar todos los grupos por defecto
        const expandidos = {};
        data.grupos.forEach(grupo => {
          expandidos[grupo.id] = false;
        });
        setGruposExpandidos(expandidos);
      } catch (err) {
        console.error("Error cargando invitados:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    cargarInvitados();
  }, []);

  // FUNCIÓN: Filtrar invitados según búsqueda y filtros
  const invitadosFiltrados = invitados.filter(invitado => {
    // Aplicar filtro de búsqueda
    const coincideBusqueda = busqueda === '' || 
      invitado.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      invitado.grupoNombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      invitado.telefono.toLowerCase().includes(busqueda.toLowerCase());
    
    // Aplicar filtro de estado de envío
    let coincideFiltro = true;
    if (filtroEnvio === 'enviados') {
      coincideFiltro = invitado.enviado;
    } else if (filtroEnvio === 'no-enviados') {
      coincideFiltro = !invitado.enviado;
    }
    
    return coincideBusqueda && coincideFiltro;
  });

  // Agrupar invitados filtrados por grupo
  const invitadosPorGrupo = grupos.map(grupo => {
    const invitadosGrupo = invitadosFiltrados.filter(inv => inv.grupoId === grupo.id);
    return {
      ...grupo,
      invitados: invitadosGrupo
    };
  }).filter(grupo => grupo.invitados.length > 0);

  // FUNCIÓN: Manejar selección/deselección de invitado
  const toggleInvitadoSeleccionado = (invitado) => {
    if (invitadosSeleccionados.some(inv => inv.id === invitado.id)) {
      // Deseleccionar
      setInvitadosSeleccionados(invitadosSeleccionados.filter(inv => inv.id !== invitado.id));
    } else {
      // Seleccionar
      setInvitadosSeleccionados([...invitadosSeleccionados, invitado]);
    }
  };

  // FUNCIÓN: Seleccionar todos los invitados de un grupo
  const seleccionarGrupo = (grupoId) => {
    const invitadosGrupo = invitadosFiltrados.filter(inv => inv.grupoId === grupoId);
    const nuevosSeleccionados = [...invitadosSeleccionados];
    
    invitadosGrupo.forEach(invitado => {
      if (!nuevosSeleccionados.some(inv => inv.id === invitado.id)) {
        nuevosSeleccionados.push(invitado);
      }
    });
    
    setInvitadosSeleccionados(nuevosSeleccionados);
  };

  // FUNCIÓN: Deseleccionar todos los invitados de un grupo
  const deseleccionarGrupo = (grupoId) => {
    const nuevosSeleccionados = invitadosSeleccionados.filter(
      inv => inv.grupoId !== grupoId
    );
    setInvitadosSeleccionados(nuevosSeleccionados);
  };

  // FUNCIÓN: Verificar si todos los invitados de un grupo están seleccionados
  const isGrupoCompletamenteSeleccionado = (grupoId) => {
    const invitadosGrupo = invitadosFiltrados.filter(inv => inv.grupoId === grupoId);
    if (invitadosGrupo.length === 0) return false;
    
    return invitadosGrupo.every(invitado => 
      invitadosSeleccionados.some(inv => inv.id === invitado.id)
    );
  };

  // FUNCIÓN: Verificar si algún invitado de un grupo está seleccionado
  const isGrupoParcialmenteSeleccionado = (grupoId) => {
    const invitadosGrupo = invitadosFiltrados.filter(inv => inv.grupoId === grupoId);
    if (invitadosGrupo.length === 0) return false;
    
    const algunSeleccionado = invitadosGrupo.some(invitado => 
      invitadosSeleccionados.some(inv => inv.id === invitado.id)
    );
    
    return algunSeleccionado && !isGrupoCompletamenteSeleccionado(grupoId);
  };

  // FUNCIÓN: Seleccionar todos los invitados visibles
  const seleccionarTodos = () => {
    setInvitadosSeleccionados([...invitadosSeleccionados, ...invitadosFiltrados.filter(
      inv => !invitadosSeleccionados.some(sel => sel.id === inv.id)
    )]);
  };

  // FUNCIÓN: Deseleccionar todos los invitados
  const deseleccionarTodos = () => {
    setInvitadosSeleccionados(invitadosSeleccionados.filter(
      sel => !invitadosFiltrados.some(inv => inv.id === sel.id)
    ));
  };

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

  // FUNCIÓN: Verificar si puede avanzar al siguiente paso
  const puedeAvanzar = () => {
    return invitadosSeleccionados.length > 0;
  };

  // RENDER: Estado de carga
  if (loading) {
    return (
      <div className="estado-carga">
        <div className="spinner"></div>
        <p>Cargando lista de invitados...</p>
      </div>
    );
  }

  // RENDER: Estado de error
  if (error) {
    return (
      <div className="estado-error">
        <h3>❌ Error al cargar invitados</h3>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="btn-reintentar"
        >
          Reintentar
        </button>
      </div>
    );
  }

  // RENDER PRINCIPAL del componente
  return (
    <div className="paso-masivo1-seleccion compacto-mejorado">
      {/* HEADER */}
      <div className="header-mejorado">
        <h2>Selección Masiva de Invitados</h2>
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
        
        {/* Filtros adicionales */}
        <div className="filtros-adicionales">
          <select
            value={filtroEnvio}
            onChange={(e) => setFiltroEnvio(e.target.value)}
            className="select-filtro-mejorado"
          >
            <option value="todos">Todos los invitados</option>
            <option value="no-enviados">No enviados</option>
            <option value="enviados">Ya enviados</option>
          </select>
          
          <div className="controles-seleccion-masiva">
            <button onClick={seleccionarTodos} className="btn-seleccion-masiva-mejorado">
              Seleccionar todos
            </button>
            <button onClick={deseleccionarTodos} className="btn-seleccion-masiva-mejorado">
              Deseleccionar todos
            </button>
          </div>
        </div>
      </div>

      {/* Información de selección */}
      <div className="info-seleccion-mejorado">
        <p>
          <strong>{invitadosSeleccionados.length}</strong> de{' '}
          <strong>{invitadosFiltrados.length}</strong> invitados seleccionados
        </p>
      </div>

      {/* Lista de invitados con checkboxes */}
      <div className="lista-compacta-mejorada">
        {invitadosFiltrados.length === 0 ? (
          <div className="sin-resultados">
            <p>No se encontraron invitados que coincidan con los filtros</p>
            <button onClick={() => {setBusqueda(''); setFiltroEnvio('todos');}} className="btn-limpiar">
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div className="grupos-container">
            {invitadosPorGrupo.map(grupo => {
              const todosSeleccionados = isGrupoCompletamenteSeleccionado(grupo.id);
              const parcialmenteSeleccionado = isGrupoParcialmenteSeleccionado(grupo.id);
              
              return (
                <div key={grupo.id} className="grupo-mejorado">
                  <div className="header-grupo-mejorado">
                    <span className="toggle" onClick={() => toggleGrupo(grupo.id)}>
                      {gruposExpandidos[grupo.id] ? '▼' : '►'}
                    </span>
                    
                    <label className="checkbox-grupo-container">
                      <input
                        type="checkbox"
                        checked={todosSeleccionados}
                        ref={input => {
                          if (input) {
                            input.indeterminate = parcialmenteSeleccionado;
                          }
                        }}
                        onChange={() => {
                          if (todosSeleccionados) {
                            deseleccionarGrupo(grupo.id);
                          } else {
                            seleccionarGrupo(grupo.id);
                          }
                        }}
                      />
                      <span className="checkmark-grupo"></span>
                    </label>
                    
                    <span className="nombre-grupo" onClick={() => toggleGrupo(grupo.id)}>
                      {grupo.nombre}
                    </span>
                    <span className="contador" onClick={() => toggleGrupo(grupo.id)}>
                      ({grupo.invitados.length})
                    </span>
                    
                    <div className="controles-grupo">
                      <button 
                        onClick={() => seleccionarGrupo(grupo.id)}
                        className="btn-grupo"
                        title="Seleccionar todo el grupo"
                      >
                        ✓
                      </button>
                      <button 
                        onClick={() => deseleccionarGrupo(grupo.id)}
                        className="btn-grupo"
                        title="Deseleccionar todo el grupo"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  {gruposExpandidos[grupo.id] && grupo.invitados.map(invitado => (
                    <div
                      key={invitado.id}
                      className={`item-mejorado ${invitadosSeleccionados.some(inv => inv.id === invitado.id) ? 'seleccionado' : ''} ${invitado.enviado ? 'enviado' : ''}`}
                      onClick={() => toggleInvitadoSeleccionado(invitado)}
                    >
                      <label className="checkbox-container-mejorado">
                        <input
                          type="checkbox"
                          checked={invitadosSeleccionados.some(inv => inv.id === invitado.id)}
                          onChange={() => toggleInvitadoSeleccionado(invitado)}
                        />
                        <span className="checkmark-mejorado"></span>
                      </label>
                      
                      <div className="info-mejorada">
                        <span className="nombre">{invitado.nombre}</span>
                        {invitado.telefono && invitado.telefono !== 'Sin teléfono' && (
                          <span className="tel">• {invitado.telefono}</span>
                        )}
                      </div>
                      
                      <div className="estados-mejorados">
                        {invitado.enviado && <span className="badge">✓</span>}
                        <span className="check">
                          {invitadosSeleccionados.some(inv => inv.id === invitado.id) ? '✓' : ''}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Acciones del paso */}
      <div className="acciones-mejoradas">
        {/* <button
          onClick={avanzarPaso}
          disabled={!puedeAvanzar()}
          className="btn-siguiente-mejorado"
        >
          Siguiente →
        </button> */}
        {!puedeAvanzar() && <span className="ayuda">Selecciona al menos un invitado</span>}
      </div>
    </div>
  );
};

export default PasoMasivo1Seleccion;