import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/scss/_03-Componentes/_AListaInvitados.scss';
import { BsLink45Deg, BsClipboard } from 'react-icons/bs';

const AListaInvitados = () => {
  const [invitados, setInvitados] = useState([]);
  const [filtros, setFiltros] = useState({
    grupo: 'todos',
    confirmacion: 'todos',
    busqueda: ''
  });
  const [orden, setOrden] = useState({ campo: 'nombre', direccion: 'asc' });
  const [paginaActual, setPaginaActual] = useState(1);
  const [itemsPorPagina] = useState(10);
  const [loading, setLoading] = useState(true);
  const [copiadoId, setCopiadoId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarInvitados = async () => {
      try {
        const response = await fetch('/invitados.json');
        const data = await response.json();
        const confirmaciones = JSON.parse(localStorage.getItem('confirmaciones') || '{}');

        const invitadosProcesados = data.grupos.flatMap(grupo =>
          grupo.invitados.map(invitado => ({
            ...invitado,
            grupoNombre: grupo.nombre,
            confirmado: confirmaciones[invitado.id]?.asistencia || false,
            acompanantesConfirmados: confirmaciones[invitado.id]?.acompanantes || 0,
            telefono: invitado.contacto?.telefono || 'N/A'
          }))
        );

        setInvitados(invitadosProcesados);
      } catch (error) {
        console.error("Error cargando invitados:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarInvitados();
  }, []);

  // Agregar este useEffect para escuchar cambios en confirmaciones
  useEffect(() => {
    const handleConfirmacionActualizada = (e) => {
      const { id, confirmacion } = e.detail;
      setInvitados(prev => prev.map(inv =>
        inv.id === parseInt(id) ? {
          ...inv,
          confirmado: confirmacion.asistencia,
          acompanantesConfirmados: confirmacion.acompanantes
        } : inv
      ));
    };

    window.addEventListener('confirmacionActualizada', handleConfirmacionActualizada);

    return () => {
      window.removeEventListener('confirmacionActualizada', handleConfirmacionActualizada);
    };
  }, []);

  const generarLinkConfirmacion = (id) => {
    return `${window.location.origin}/confirmar/${id}`;
  };

  const copiarLinkConfirmacion = (id, nombre) => {
    const link = generarLinkConfirmacion(id);
    const mensajeWhatsApp = `¡Hola ${nombre}! 🎉\n\nPor favor confirma tu asistencia aquí:\n${link}\n\n¡Gracias!`;

    navigator.clipboard.writeText(mensajeWhatsApp);
    setCopiadoId(id);
    setTimeout(() => setCopiadoId(null), 2000);

    // Guardar en localStorage
    const linksGenerados = JSON.parse(localStorage.getItem('linksConfirmacion') || '{}');
    linksGenerados[id] = { link, mensajeWhatsApp };
    localStorage.setItem('linksConfirmacion', JSON.stringify(linksGenerados));
  };

  const invitadosFiltrados = invitados.filter(invitado => {
    const cumpleGrupo = filtros.grupo === 'todos' || invitado.grupoNombre === filtros.grupo;
    const cumpleConfirmacion = filtros.confirmacion === 'todos' ||
      (filtros.confirmacion === 'confirmados' && invitado.confirmado) ||
      (filtros.confirmacion === 'pendientes' && !invitado.confirmado);
    const cumpleBusqueda = invitado.nombre.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
      invitado.telefono.includes(filtros.busqueda);

    return cumpleGrupo && cumpleConfirmacion && cumpleBusqueda;
  });

  const invitadosOrdenados = [...invitadosFiltrados].sort((a, b) => {
    if (a[orden.campo] < b[orden.campo]) return orden.direccion === 'asc' ? -1 : 1;
    if (a[orden.campo] > b[orden.campo]) return orden.direccion === 'asc' ? 1 : -1;
    return 0;
  });

  const indexUltimoItem = paginaActual * itemsPorPagina;
  const indexPrimerItem = indexUltimoItem - itemsPorPagina;
  const invitadosPagina = invitadosOrdenados.slice(indexPrimerItem, indexUltimoItem);
  const totalPaginas = Math.ceil(invitadosOrdenados.length / itemsPorPagina);

  const cambiarPagina = (numeroPagina) => setPaginaActual(numeroPagina);

  const cambiarOrden = (campo) => {
    setOrden({
      campo,
      direccion: orden.campo === campo && orden.direccion === 'asc' ? 'desc' : 'asc'
    });
  };

  const exportarTXT = () => {
    const datos = invitadosOrdenados.map(inv =>
      `Nombre: ${inv.nombre}\n` +
      `Grupo: ${inv.grupoNombre}\n` +
      `Teléfono: ${inv.telefono}\n` +
      `Acompañantes: ${inv.confirmado ? `${inv.acompanantesConfirmados}/${inv.acompanantes}` : inv.acompanantes}\n` +
      `Estado: ${inv.confirmado ? 'Confirmado' : 'Pendiente'}\n` +
      '------------------------------'
    ).join('\n');

    const blob = new Blob([datos], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'lista_invitados.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div className="loading">Cargando lista de invitados...</div>;

  return (
    <div className="lista-invitados-container">
      <div className="header">
        <h1>Lista de Invitados</h1>
        <div className="header-actions">
          <button
            className="btn-primary"
            onClick={() => navigate('/crear-invitacion')}
          >
            Crear Nueva Invitación
          </button>
          <button
            className="btn-secondary"
            onClick={exportarTXT}
            disabled={invitadosOrdenados.length === 0}
          >
            Exportar Lista Invitados
          </button>
        </div>
      </div>
      <div className="stats-bar">
        <div className="stat-card total">
          <span className="stat-number">{invitados.length}</span>
          <span className="stat-label">Total Invitados</span>
        </div>
        <div className="stat-card confirmed">
          <span className="stat-number">{invitados.filter(i => i.confirmado).length}</span>
          <span className="stat-label">Confirmados</span>
        </div>
        <div className="stat-card pending">
          <span className="stat-number">{invitados.filter(i => !i.confirmado).length}</span>
          <span className="stat-label">Pendientes</span>
        </div>
      </div>
      <div className="filtros-container">
        <div className="filtro-group search-group">
          <label>Buscar:</label>
          <input
            type="text"
            placeholder="Nombre o teléfono"
            value={filtros.busqueda}
            onChange={(e) => setFiltros({...filtros, busqueda: e.target.value})}
          />
        </div>
        <div className="filtro-group">
          <label>Grupo:</label>
          <select
            value={filtros.grupo}
            onChange={(e) => {
              setFiltros({...filtros, grupo: e.target.value});
              setPaginaActual(1);
            }}
          >
            <option value="todos">Todos los grupos</option>
            {[...new Set(invitados.map(i => i.grupoNombre))].map(grupo => (
              <option key={grupo} value={grupo}>{grupo}</option>
            ))}
          </select>
        </div>
        <div className="filtro-group">
          <label>Confirmación:</label>
          <select
            value={filtros.confirmacion}
            onChange={(e) => {
              setFiltros({...filtros, confirmacion: e.target.value});
              setPaginaActual(1);
            }}
          >
            <option value="todos">Todos</option>
            <option value="confirmados">Confirmados</option>
            <option value="pendientes">Pendientes</option>
          </select>
        </div>
      </div>
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
              <th>Acompañantes</th>
              <th onClick={() => cambiarOrden('confirmado')}>
                Estado {orden.campo === 'confirmado' && (orden.direccion === 'asc' ? '↑' : '↓')}
              </th>
              <th>Link Confirmación</th>
            </tr>
          </thead>
          <tbody>
            {invitadosPagina.map(invitado => (
              <tr key={invitado.id} className={invitado.confirmado ? 'confirmado' : 'pendiente'}>
                <td>{invitado.nombre}</td>
                <td>{invitado.grupoNombre}</td>
                <td>{invitado.telefono}</td>
                <td>
                  {invitado.confirmado
                    ? `${invitado.acompanantesConfirmados}/${invitado.acompanantes}`
                    : invitado.acompanantes}
                </td>
                <td>
                  <span className={`badge ${invitado.confirmado ? 'confirmado' : 'pendiente'}`}>
                    {invitado.confirmado ? 'Confirmado' : 'Pendiente'}
                    {invitado.confirmado && <span className="check-icon">✓</span>}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => copiarLinkConfirmacion(invitado.id, invitado.nombre)}
                    className="btn-copiar-link"
                    title="Copiar link de confirmación"
                  >
                    {copiadoId === invitado.id ? (
                      <span className="copiado-text">¡Copiado!</span>
                    ) : (
                      <>
                        <BsLink45Deg className="icon-link" />
                        <BsClipboard className="icon-clipboard" />
                      </>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {invitadosFiltrados.length === 0 && (
          <div className="no-results">
            No se encontraron invitados con los filtros aplicados
          </div>
        )}
      </div>
      {totalPaginas > 1 && (
        <div className="pagination">
          <button
            onClick={() => cambiarPagina(paginaActual - 1)}
            disabled={paginaActual === 1}
          >
            Anterior
          </button>
          {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(numero => (
            <button
              key={numero}
              onClick={() => cambiarPagina(numero)}
              className={paginaActual === numero ? 'active' : ''}
            >
              {numero}
            </button>
          ))}
          <button
            onClick={() => cambiarPagina(paginaActual + 1)}
            disabled={paginaActual === totalPaginas}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
};

export default AListaInvitados;
