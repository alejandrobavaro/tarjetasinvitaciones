import React, { useState, useEffect } from 'react';
import '../assets/scss/_03-Componentes/_ListaInvitados.scss';

// ================================================
// COMPONENTE PRINCIPAL: Lista de Invitados
// ================================================
// PROPÓSITO: Mostrar y gestionar la lista de invitados en formato tabla compacta
// CONEXIONES: 
// - Carga datos desde: /invitados.json (archivo estático)
// - Guarda en: localStorage (contactosEditados, estadosEnvio)
// - Estilos desde: ../assets/scss/_03-Componentes/_ListaInvitados.scss
// - ESCUCHA eventos de actualización de estados de envío
// - PROBLEMA: Estructura anidada en JSON vs plana en componentes
// ================================================

const ListaInvitados = () => {
  // ================================================
  // ESTADOS DEL COMPONENTE
  // ================================================
  const [invitados, setInvitados] = useState([]);          // Lista completa de invitados procesados
  const [grupos, setGrupos] = useState([]);                // Estructura original de grupos desde JSON
  const [invitadosFiltrados, setInvitadosFiltrados] = useState([]); // Lista filtrada según búsqueda
  const [loading, setLoading] = useState(true);            // Control de estado de carga
  const [error, setError] = useState(null);                // Almacenamiento de mensajes de error
  const [orden, setOrden] = useState({ campo: 'grupoNombre', direccion: 'asc' }); // Config ordenamiento
  const [filtroEnvio, setFiltroEnvio] = useState('todos'); // Filtro por estado de envío
  const [busqueda, setBusqueda] = useState('');            // Término de búsqueda para filtrar
  const [editando, setEditando] = useState(null);          // Control de edición (qué invitado y campo)
  const [valoresEditados, setValoresEditados] = useState({}); // Valores temporales durante edición
  const [gruposExpandidos, setGruposExpandidos] = useState({}); // Control de grupos expandidos/colapsados

  // ================================================
  // EFECTO: Cargar datos iniciales al montar el componente
  // ================================================
  // DEPENDENCIAS: [] (solo se ejecuta una vez al montar)
  // ACCIÓN: Carga invitados.json y combina con datos de localStorage
  // PROBLEMA: La estructura JSON tiene contactos anidados, pero componentes necesitan plana
  // ================================================
  useEffect(() => {
    const cargarInvitados = async () => {
      try {
        // 1. Realizar petición al archivo JSON estático
        const response = await fetch('/invitados.json');
        if (!response.ok) throw new Error('No se pudo cargar el archivo JSON');
        
        // 2. Parsear la respuesta JSON
        const data = await response.json();
        
        // 3. Validar la estructura de datos recibida
        if (!data.grupos || !Array.isArray(data.grupos)) {
          throw new Error('Formato de datos inválido');
        }

        // 4. Cargar estados de envío desde localStorage
        const estadosEnvio = JSON.parse(localStorage.getItem('estadosEnvio') || '{}');
        
        // 5. Cargar contactos editados desde localStorage
        const contactosEditados = JSON.parse(localStorage.getItem('contactosEditados') || '{}');

        // 6. Guardar grupos para agrupamiento visual
        setGrupos(data.grupos);

        // 7. 🛠️ SOLUCIÓN: Procesar cada invitado APLANANDO la estructura
        // ORIGINAL: invitado.contacto.telefono (anidado)
        // NUEVO: invitado.telefono (plano) + mantener contactoCompleto por compatibilidad
        const invitadosProcesados = data.grupos.flatMap(grupo => {
          if (!grupo.invitados || !Array.isArray(grupo.invitados)) return [];
          
          return grupo.invitados.map(invitado => {
            const contactoEditado = contactosEditados[invitado.id];
            
            // 🛠️ EXTRACCIÓN CORRECTA de teléfono de estructura anidada
            const telefonoOriginal = invitado.contacto?.telefono || invitado.contacto?.whatsapp || 'N/A';
            const emailOriginal = invitado.contacto?.email || 'N/A';
            
            return {
              ...invitado, // Mantener todos los datos originales
              grupoNombre: grupo.nombre,
              grupoId: grupo.id,
              enviado: estadosEnvio[invitado.id] || false,
              
              // 🛠️ APLANAR ESTRUCTURA: Crear propiedades planas para teléfono y email
              telefono: contactoEditado?.telefono || telefonoOriginal,
              email: contactoEditado?.email || emailOriginal,
              telefonoOriginal: telefonoOriginal,
              emailOriginal: emailOriginal,
              
              // 🛠️ MANTENER compatibilidad: guardar contacto completo por si otros componentes lo necesitan
              contactoCompleto: invitado.contacto
            };
          });
        });

        // 8. Actualizar estados con datos procesados (ahora con estructura plana)
        setInvitados(invitadosProcesados);
        setInvitadosFiltrados(invitadosProcesados);
        
        // 9. Expandir todos los grupos por defecto
        const expandidos = {};
        data.grupos.forEach(grupo => {
          expandidos[grupo.id] = true;
        });
        setGruposExpandidos(expandidos);
        
      } catch (err) {
        // 10. Manejar errores en la carga
        console.error("Error cargando invitados:", err);
        setError(err.message);
      } finally {
        // 11. Indicar que la carga finalizó
        setLoading(false);
      }
    };

    cargarInvitados();
  }, []);

  // ================================================
  // EFECTO: Escuchar actualizaciones de estados de envío
  // ================================================
  // PROPÓSITO: Actualizar la lista cuando otros componentes cambien estados de envío
  // CONEXIONES: Responde a eventos de PasoMasivo5Envio y Paso5EnviarWhatsApp
  // ================================================
  useEffect(() => {
    const handleStorageChange = () => {
      // Recargar estados de envío desde localStorage
      const estadosEnvio = JSON.parse(localStorage.getItem('estadosEnvio') || '{}');
      
      // Actualizar invitados con nuevos estados
      const invitadosActualizados = invitados.map(invitado => ({
        ...invitado,
        enviado: estadosEnvio[invitado.id] || false
      }));
      
      setInvitados(invitadosActualizados);
    };

    // Escuchar eventos de almacenamiento y eventos personalizados
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('estadosEnvioActualizados', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('estadosEnvioActualizados', handleStorageChange);
    };
  }, [invitados]);

  // ================================================
  // EFECTO: Aplicar filtros y ordenamiento cuando cambian parámetros
  // ================================================
  // DEPENDENCIAS: [invitados, orden, filtroEnvio, busqueda]
  // ACCIÓN: Filtra y ordena la lista según criterios actuales
  // ================================================
  useEffect(() => {
    // 1. Crear copia de la lista completa
    let resultado = [...invitados];
    
    // 2. Aplicar filtro de búsqueda si existe término
    if (busqueda) {
      const termino = busqueda.toLowerCase();
      resultado = resultado.filter(inv => 
        inv.nombre.toLowerCase().includes(termino) ||
        inv.grupoNombre.toLowerCase().includes(termino) ||
        inv.telefono.toLowerCase().includes(termino) ||
        inv.email.toLowerCase().includes(termino)
      );
    }
    
    // 3. Aplicar filtro por estado de envío
    if (filtroEnvio !== 'todos') {
      resultado = resultado.filter(inv => 
        filtroEnvio === 'enviados' ? inv.enviado : !inv.enviado
      );
    }
    
    // 4. Aplicar ordenamiento según campo y dirección
    resultado.sort((a, b) => {
      let valorA = a[orden.campo];
      let valorB = b[orden.campo];
      
      // Convertir a número si se ordena por ID
      if (orden.campo === 'id') {
        valorA = parseInt(valorA);
        valorB = parseInt(valorB);
      }
      
      // Comparar valores según dirección
      if (valorA < valorB) return orden.direccion === 'asc' ? -1 : 1;
      if (valorA > valorB) return orden.direccion === 'asc' ? 1 : -1;
      return 0;
    });
    
    // 5. Actualizar lista filtrada
    setInvitadosFiltrados(resultado);
  }, [invitados, orden, filtroEnvio, busqueda]);

  // ================================================
  // FUNCIÓN: Alternar expansión/colapso de grupo
  // ================================================
  // PARÁMETROS: grupoId (ID del grupo a alternar)
  // ACCIÓN: Cambia el estado de expansión del grupo
  // ================================================
  const toggleGrupo = (grupoId) => {
    setGruposExpandidos(prev => ({
      ...prev,
      [grupoId]: !prev[grupoId]
    }));
  };

  // ================================================
  // FUNCIÓN: Expandir/colapsar todos los grupos
  // ================================================
  // PARÁMETROS: expandir (booleano true/false)
  // ACCIÓN: Expande o colapsa todos los grupos simultáneamente
  // ================================================
  const toggleTodosGrupos = (expandir) => {
    const nuevosEstados = {};
    grupos.forEach(grupo => {
      nuevosEstados[grupo.id] = expandir;
    });
    setGruposExpandidos(nuevosEstados);
  };

  // ================================================
  // FUNCIÓN: Iniciar edición de un campo
  // ================================================
  // PARÁMETROS: invitado (objeto), campo ('telefono'/'email')
  // ACCIÓN: Prepara la interfaz para editar un campo específico
  // ================================================
  const iniciarEdicion = (invitado, campo) => {
    setEditando({ id: invitado.id, campo });
    setValoresEditados(prev => ({
      ...prev,
      [invitado.id]: {
        telefono: invitado.telefono,
        email: invitado.email,
        [campo]: invitado[campo]
      }
    }));
  };

  // ================================================
  // FUNCIÓN: Cancelar edición en curso
  // ================================================
  // ACCIÓN: Sale del modo edición sin guardar cambios
  // ================================================
  const cancelarEdicion = () => {
    setEditando(null);
  };

  // ================================================
  // FUNCIÓN: Guardar cambios editados
  // ================================================
  // PARÁMETROS: id (ID del invitado)
  // ACCIÓN: Guarda cambios en estado y localStorage
  // ================================================
  const guardarCambios = (id) => {
    const cambios = valoresEditados[id];
    
    // 1. Actualizar estado local
    const invitadosActualizados = invitados.map(invitado => 
      invitado.id === id ? { 
        ...invitado, 
        telefono: cambios.telefono,
        email: cambios.email
      } : invitado
    );
    
    setInvitados(invitadosActualizados);
    
    // 2. Guardar en localStorage para persistencia
    const contactosEditados = JSON.parse(localStorage.getItem('contactosEditados') || '{}');
    
    const cambiosParaGuardar = {};
    const invitadoOriginal = invitados.find(inv => inv.id === id);
    
    // Solo guardar campos que fueron editados realmente
    if (cambios.telefono !== invitadoOriginal?.telefonoOriginal) {
      cambiosParaGuardar.telefono = cambios.telefono;
    }
    
    if (cambios.email !== invitadoOriginal?.emailOriginal) {
      cambiosParaGuardar.email = cambios.email;
    }
    
    if (Object.keys(cambiosParaGuardar).length > 0) {
      contactosEditados[id] = cambiosParaGuardar;
    } else {
      delete contactosEditados[id];
    }
    
    localStorage.setItem('contactosEditados', JSON.stringify(contactosEditados));
    
    // 3. Limpiar estado de edición
    setEditando(null);
    setValoresEditados(prev => {
      const nuevosValores = { ...prev };
      delete nuevosValores[id];
      return nuevosValores;
    });
  };

  // ================================================
  // FUNCIÓN: Manejar cambio en input de edición
  // ================================================
  // PARÁMETROS: id, campo, valor (nuevo valor)
  // ACCIÓN: Actualiza valor temporal durante edición
  // ================================================
  const handleValorChange = (id, campo, valor) => {
    setValoresEditados(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [campo]: valor
      }
    }));
  };

  // ================================================
  // FUNCIÓN: Restaurar valor original de campo
  // ================================================
  // PARÁMETROS: id, campo, valorOriginal
  // ACCIÓN: Restaura valor original y elimina edición
  // ================================================
  const restaurarValorOriginal = (id, campo, valorOriginal) => {
    const invitadosActualizados = invitados.map(invitado => 
      invitado.id === id ? { ...invitado, [campo]: valorOriginal } : invitado
    );

    setInvitados(invitadosActualizados);
    
    const contactosEditados = JSON.parse(localStorage.getItem('contactosEditados') || '{}');
    
    if (contactosEditados[id]) {
      delete contactosEditados[id][campo];
      
      if (Object.keys(contactosEditados[id]).length === 0) {
        delete contactosEditados[id];
      }
    }
    
    localStorage.setItem('contactosEditados', JSON.stringify(contactosEditados));
    
    if (editando?.id === id) {
      setValoresEditados(prev => ({
        ...prev,
        [id]: {
          ...prev[id],
          [campo]: valorOriginal
        }
      }));
    }
  };

  // ================================================
  // FUNCIÓN: Cambiar estado de envío de invitación
  // ================================================
  // PARÁMETROS: id (ID del invitado)
  // ACCIÓN: Alterna estado enviado/no enviado
  // ================================================
  const handleEnvioCambiado = (id) => {
    const nuevosInvitados = invitados.map(inv => 
      inv.id === id ? { ...inv, enviado: !inv.enviado } : inv
    );
    
    setInvitados(nuevosInvitados);
    
    const estadosEnvio = {};
    nuevosInvitados.forEach(inv => {
      estadosEnvio[inv.id] = inv.enviado;
    });
    localStorage.setItem('estadosEnvio', JSON.stringify(estadosEnvio));
  };

  // ================================================
  // FUNCIÓN: Cambiar campo de ordenamiento
  // ================================================
  // PARÁMETROS: campo (nombre del campo a ordenar)
  // ACCIÓN: Cambia ordenamiento o alterna dirección
  // ================================================
  const cambiarOrden = (campo) => {
    setOrden(prev => ({
      campo,
      direccion: prev.campo === campo && prev.direccion === 'asc' ? 'desc' : 'asc'
    }));
  };

  // ================================================
  // FUNCIÓN: Cambiar filtro por estado de envío
  // ================================================
  // PARÁMETROS: nuevoFiltro ('todos', 'enviados', 'no-enviados')
  // ACCIÓN: Actualiza el filtro activo
  // ================================================
  const cambiarFiltroEnvio = (nuevoFiltro) => {
    setFiltroEnvio(nuevoFiltro);
  };

  // ================================================
  // FUNCIÓN: Manejar cambio en campo de búsqueda
  // ================================================
  // PARÁMETROS: e (evento del input)
  // ACCIÓN: Actualiza término de búsqueda
  // ================================================
  const handleBusquedaChange = (e) => {
    setBusqueda(e.target.value);
  };

  // ================================================
  // FUNCIÓN: Limpiar todos los filtros y búsqueda
  // ================================================
  // ACCIÓN: Restaura valores por defecto de filtros
  // ================================================
  const limpiarFiltros = () => {
    setBusqueda('');
    setFiltroEnvio('todos');
    setOrden({ campo: 'grupoNombre', direccion: 'asc' });
  };

  // ================================================
  // RENDER: Estado de carga
  // ================================================
  if (loading) {
    return <div className="loading">Cargando lista de invitados...</div>;
  }

  // ================================================
  // RENDER: Estado de error
  // ================================================
  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  // ================================================
  // RENDER PRINCIPAL del componente
  // ================================================
  return (
    <div className="lista-invitados-container compacta">
      {/* Título principal */}
      <h1>Lista de Invitados - Verificar y Actualizar datos para enviar Invitaciones</h1>
      
      {/* Controles de filtrado y búsqueda */}
      <div className="controles-invitados compactos">
        <div className="busqueda-container">
          <input
            type="text"
            placeholder="Buscar por nombre, grupo, teléfono, email..."
            value={busqueda}
            onChange={handleBusquedaChange}
            className="busqueda-input"
          />
        </div>
        
        <div className="filtros-container">
          <div className="filtro-grupo">
            <span>Filtrar:</span>
            <button className={filtroEnvio === 'todos' ? 'activo' : ''} onClick={() => cambiarFiltroEnvio('todos')}>Todos</button>
            <button className={filtroEnvio === 'enviados' ? 'activo' : ''} onClick={() => cambiarFiltroEnvio('enviados')}>Enviados</button>
            <button className={filtroEnvio === 'no-enviados' ? 'activo' : ''} onClick={() => cambiarFiltroEnvio('no-enviados')}>No enviados</button>
          </div>
          
          <div className="controles-grupos">
            <button onClick={() => toggleTodosGrupos(true)} title="Expandir todos">📂</button>
            <button onClick={() => toggleTodosGrupos(false)} title="Colapsar todos">📁</button>
          </div>
          
          <button onClick={limpiarFiltros} className="limpiar-filtros">Limpiar</button>
        </div>
      </div>
      
      {/* Resumen de resultados */}
      <div className="resumen-invitados">
        <p>Mostrando {invitadosFiltrados.length} de {invitados.length} invitados{filtroEnvio !== 'todos' && ` (${filtroEnvio})`}{busqueda && ` para "${busqueda}"`}</p>
      </div>

      {/* Mensaje cuando no hay resultados */}
      {invitadosFiltrados.length === 0 ? (
        <div className="no-invitados">No se encontraron invitados con los filtros aplicados</div>
      ) : (
        /* Tabla de invitados agrupada */
        <div className="tabla-invitados compacta">
          <table>
            <thead>
              <tr>
                <th className="columna-grupo" onClick={() => cambiarOrden('grupoNombre')}>
                  Grupo {orden.campo === 'grupoNombre' && (orden.direccion === 'asc' ? '↑' : '↓')}
                </th>
                <th className="columna-nombre" onClick={() => cambiarOrden('nombre')}>
                  Nombre {orden.campo === 'nombre' && (orden.direccion === 'asc' ? '↑' : '↓')}
                </th>
                <th className="columna-telefono">Teléfono</th>
                <th className="columna-email">Email</th>
                <th className="columna-estado" onClick={() => cambiarOrden('enviado')}>
                  Estado {orden.campo === 'enviado' && (orden.direccion === 'asc' ? '↑' : '↓')}
                </th>
                <th className="columna-acciones">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {/* Mapear grupos y sus invitados */}
              {grupos.map(grupo => {
                const invitadosGrupo = invitadosFiltrados.filter(inv => inv.grupoId === grupo.id);
                if (invitadosGrupo.length === 0) return null;
                
                return (
                  <React.Fragment key={grupo.id}>
                    {/* Fila de grupo (expandible/colapsable) */}
                    <tr className="fila-grupo" onClick={() => toggleGrupo(grupo.id)}>
                      <td colSpan="6" className="header-grupo">
                        <span className="toggle-grupo">
                          {gruposExpandidos[grupo.id] ? '▼' : '►'}
                        </span>
                        {grupo.nombre} 
                        <span className="contador-grupo">({invitadosGrupo.length})</span>
                      </td>
                    </tr>
                    
                    {/* Filas de invitados del grupo (si está expandido) */}
                    {gruposExpandidos[grupo.id] && invitadosGrupo.map(invitado => (
                      <tr key={invitado.id} className={invitado.enviado ? 'fila-enviada' : 'fila-no-enviada'}>
                        <td className="celda-grupo"></td>
                        <td className="celda-nombre">{invitado.nombre}</td>
                        
                        {/* Celda Teléfono (editable) */}
                        <td className="celda-telefono">
                          {editando?.id === invitado.id && editando.campo === 'telefono' ? (
                            <div className="edicion-campo">
                              <input
                                type="text"
                                value={valoresEditados[invitado.id]?.telefono || ''}
                                onChange={(e) => handleValorChange(invitado.id, 'telefono', e.target.value)}
                                className="input-edicion"
                                placeholder="Teléfono"
                              />
                            </div>
                          ) : (
                            <div className="campo-display editable" onClick={() => iniciarEdicion(invitado, 'telefono')} title="Haz clic para editar teléfono">
                              {invitado.telefono}
                              {invitado.telefono !== invitado.telefonoOriginal && (
                                <span className="badge-editado" title="Teléfono editado">✏️</span>
                              )}
                            </div>
                          )}
                        </td>
                        
                        {/* Celda Email (editable) */}
                        <td className="celda-email">
                          {editando?.id === invitado.id && editando.campo === 'email' ? (
                            <div className="edicion-campo">
                              <input
                                type="email"
                                value={valoresEditados[invitado.id]?.email || ''}
                                onChange={(e) => handleValorChange(invitado.id, 'email', e.target.value)}
                                className="input-edicion"
                                placeholder="Email"
                              />
                            </div>
                          ) : (
                            <div className="campo-display editable" onClick={() => iniciarEdicion(invitado, 'email')} title="Haz clic para editar email">
                              {invitado.email}
                              {invitado.email !== invitado.emailOriginal && (
                                <span className="badge-editado" title="Email editado">✏️</span>
                              )}
                            </div>
                          )}
                        </td>
                        
                        {/* Celda Estado (toggle enviado/no enviado) */}
                        <td className="celda-estado">
                          <label className="switch compacta">
                            <input type="checkbox" checked={invitado.enviado || false} onChange={() => handleEnvioCambiado(invitado.id)} />
                            <span className="slider"></span>
                            <span className="estado-texto">{invitado.enviado ? '✓' : '✗'}</span>
                          </label>
                        </td>
                        
                        {/* Celda Acciones (botones de edición) */}
                        <td className="celda-acciones">
                          {editando?.id === invitado.id ? (
                            <div className="acciones-edicion">
                              <button onClick={() => guardarCambios(invitado.id)} className="btn-guardar" title="Guardar cambios">💾</button>
                              <button onClick={cancelarEdicion} className="btn-cancelar" title="Cancelar edición">❌</button>
                            </div>
                          ) : (
                            <div className="acciones-normales">
                              <button onClick={() => iniciarEdicion(invitado, 'telefono')} className="btn-editar" title="Editar teléfono">📞</button>
                              <button onClick={() => iniciarEdicion(invitado, 'email')} className="btn-editar" title="Editar email">✉️</button>
                              {invitado.telefono !== invitado.telefonoOriginal && (
                                <button onClick={() => restaurarValorOriginal(invitado.id, 'telefono', invitado.telefonoOriginal)} className="btn-restaurar" title="Restaurar teléfono">↩️</button>
                              )}
                              {invitado.email !== invitado.emailOriginal && (
                                <button onClick={() => restaurarValorOriginal(invitado.id, 'email', invitado.emailOriginal)} className="btn-restaurar" title="Restaurar email">↩️</button>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ListaInvitados;