import React, { useState, useEffect } from 'react';
import '../assets/scss/_03-Componentes/_ListaInvitados.scss';

const ListaInvitados = () => {
  const [invitados, setInvitados] = useState([]);
  const [invitadosFiltrados, setInvitadosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orden, setOrden] = useState({ campo: 'grupoNombre', direccion: 'asc' });
  const [filtroEnvio, setFiltroEnvio] = useState('todos'); // 'todos', 'enviados', 'no-enviados'
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    const cargarInvitados = async () => {
      try {
        const response = await fetch('/invitados.json');
        if (!response.ok) {
          throw new Error('No se pudo cargar el archivo JSON');
        }
        const data = await response.json();
        
        if (!data.grupos || !Array.isArray(data.grupos)) {
          throw new Error('Formato de datos inválido');
        }

        const estadosEnvio = JSON.parse(localStorage.getItem('estadosEnvio') || '{}');

        const invitadosProcesados = data.grupos.flatMap(grupo => {
          if (!grupo.invitados || !Array.isArray(grupo.invitados)) {
            return [];
          }
          return grupo.invitados.map(invitado => ({
            ...invitado,
            grupoNombre: grupo.nombre,
            grupoId: grupo.id,
            enviado: estadosEnvio[invitado.id] || false,
            telefono: invitado.contacto?.telefono || 'N/A',
            email: invitado.contacto?.email || 'N/A'
          }));
        });

        setInvitados(invitadosProcesados);
        setInvitadosFiltrados(invitadosProcesados);
      } catch (err) {
        console.error("Error cargando invitados:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    cargarInvitados();
  }, []);

  // Aplicar filtros y ordenamiento cuando cambien los parámetros
  useEffect(() => {
    let resultado = [...invitados];
    
    // Aplicar filtro de búsqueda
    if (busqueda) {
      const termino = busqueda.toLowerCase();
      resultado = resultado.filter(inv => 
        inv.nombre.toLowerCase().includes(termino) ||
        inv.grupoNombre.toLowerCase().includes(termino) ||
        inv.telefono.toLowerCase().includes(termino) ||
        inv.email.toLowerCase().includes(termino)
      );
    }
    
    // Aplicar filtro de estado de envío
    if (filtroEnvio !== 'todos') {
      resultado = resultado.filter(inv => 
        filtroEnvio === 'enviados' ? inv.enviado : !inv.enviado
      );
    }
    
    // Aplicar ordenamiento
    resultado.sort((a, b) => {
      let valorA = a[orden.campo];
      let valorB = b[orden.campo];
      
      // Para ordenamiento numérico
      if (orden.campo === 'id') {
        valorA = parseInt(valorA);
        valorB = parseInt(valorB);
      }
      
      if (valorA < valorB) return orden.direccion === 'asc' ? -1 : 1;
      if (valorA > valorB) return orden.direccion === 'asc' ? 1 : -1;
      return 0;
    });
    
    setInvitadosFiltrados(resultado);
  }, [invitados, orden, filtroEnvio, busqueda]);

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

  const cambiarOrden = (campo) => {
    setOrden(prev => ({
      campo,
      direccion: prev.campo === campo && prev.direccion === 'asc' ? 'desc' : 'asc'
    }));
  };

  const cambiarFiltroEnvio = (nuevoFiltro) => {
    setFiltroEnvio(nuevoFiltro);
  };

  const handleBusquedaChange = (e) => {
    setBusqueda(e.target.value);
  };

  const limpiarFiltros = () => {
    setBusqueda('');
    setFiltroEnvio('todos');
    setOrden({ campo: 'grupoNombre', direccion: 'asc' });
  };

  if (loading) {
    return <div className="loading">Cargando lista de invitados...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="lista-invitados-container">
      <h1>Lista de Invitados</h1>
      
      {/* Controles de filtrado y búsqueda */}
      <div className="controles-invitados">
        <div className="busqueda-container">
          <input
            type="text"
            placeholder="Buscar por nombre, grupo, teléfono..."
            value={busqueda}
            onChange={handleBusquedaChange}
            className="busqueda-input"
          />
        </div>
        
        <div className="filtros-container">
          <div className="filtro-grupo">
            <span>Filtrar por estado:</span>
            <button 
              className={filtroEnvio === 'todos' ? 'activo' : ''}
              onClick={() => cambiarFiltroEnvio('todos')}
            >
              Todos
            </button>
            <button 
              className={filtroEnvio === 'enviados' ? 'activo' : ''}
              onClick={() => cambiarFiltroEnvio('enviados')}
            >
              Enviados
            </button>
            <button 
              className={filtroEnvio === 'no-enviados' ? 'activo' : ''}
              onClick={() => cambiarFiltroEnvio('no-enviados')}
            >
              No enviados
            </button>
          </div>
          
          <div className="ordenamiento-grupo">
            <span>Ordenar por:</span>
            <button 
              className={orden.campo === 'grupoNombre' ? 'activo' : ''}
              onClick={() => cambiarOrden('grupoNombre')}
            >
              Grupo {orden.campo === 'grupoNombre' && (orden.direccion === 'asc' ? '↑' : '↓')}
            </button>
            <button 
              className={orden.campo === 'nombre' ? 'activo' : ''}
              onClick={() => cambiarOrden('nombre')}
            >
              Nombre {orden.campo === 'nombre' && (orden.direccion === 'asc' ? '↑' : '↓')}
            </button>
            <button 
              className={orden.campo === 'enviado' ? 'activo' : ''}
              onClick={() => cambiarOrden('enviado')}
            >
              Estado {orden.campo === 'enviado' && (orden.direccion === 'asc' ? '↑' : '↓')}
            </button>
          </div>
          
          <button onClick={limpiarFiltros} className="limpiar-filtros">
            Limpiar filtros
          </button>
        </div>
      </div>
      
      {/* Resumen de resultados */}
      <div className="resumen-invitados">
        <p>
          Mostrando {invitadosFiltrados.length} de {invitados.length} invitados
          {filtroEnvio !== 'todos' && ` (${filtroEnvio})`}
          {busqueda && ` para "${busqueda}"`}
        </p>
      </div>

      {invitadosFiltrados.length === 0 ? (
        <div className="no-invitados">No se encontraron invitados con los filtros aplicados</div>
      ) : (
        <div className="tabla-invitados">
          <table>
            <thead>
              <tr>
                <th onClick={() => cambiarOrden('nombre')}>
                  Nombre {orden.campo === 'nombre' && (orden.direccion === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => cambiarOrden('grupoNombre')}>
                  Grupo {orden.campo === 'grupoNombre' && (orden.direccion === 'asc' ? '↑' : '↓')}
                </th>
                <th>Teléfono</th>
                <th>Email</th>
                <th onClick={() => cambiarOrden('enviado')}>
                  Estado {orden.campo === 'enviado' && (orden.direccion === 'asc' ? '↑' : '↓')}
                </th>
              </tr>
            </thead>
            <tbody>
              {invitadosFiltrados.map(invitado => (
                <tr key={invitado.id} className={invitado.enviado ? 'fila-enviada' : 'fila-no-enviada'}>
                  <td>{invitado.nombre}</td>
                  <td>{invitado.grupoNombre}</td>
                  <td>{invitado.telefono}</td>
                  <td>{invitado.email}</td>
                  <td>
                    <label className="switch">
                      <input 
                        type="checkbox" 
                        checked={invitado.enviado || false}
                        onChange={() => handleEnvioCambiado(invitado.id)}
                      />
                      <span className="slider"></span>
                      <span className="estado-texto">
                        {invitado.enviado ? 'Enviada' : 'No enviada'}
                      </span>
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ListaInvitados;