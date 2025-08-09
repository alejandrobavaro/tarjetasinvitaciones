import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BsFilterLeft, BsDownload, BsSearch, BsArrowLeft } from 'react-icons/bs';
import '../assets/scss/_03-Componentes/_EListaInvitadosqueConfirmaronAsistencia.scss';

const EListaInvitadosqueConfirmaronAsistencia = () => {
  const [confirmaciones, setConfirmaciones] = useState([]);
  const [filtro, setFiltro] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Cargar confirmaciones
  useEffect(() => {
    const cargarConfirmaciones = async () => {
      try {
        const confirmacionesData = JSON.parse(localStorage.getItem('confirmaciones') || '{}');
        const response = await fetch('/invitados.json');
        const data = await response.json();
        
        const lista = Object.entries(confirmacionesData).map(([id, conf]) => {
          const invitado = data.grupos.flatMap(g => g.invitados).find(i => i.id === parseInt(id)) || {};
          return { 
            ...invitado, 
            ...conf,
            id: id,
            linkConfirmacion: `${window.location.origin}/confirmar/${id}`,
            // Si es confirmación manual, agregar datos básicos
            nombre: conf.nombre || invitado.nombre || 'Invitado Manual',
            relacion: invitado.relacion || 'Sin especificar'
          };
        });
        
        setConfirmaciones(lista);
      } catch (error) {
        console.error("Error cargando confirmaciones:", error);
      } finally {
        setLoading(false);
      }
    };
    
    cargarConfirmaciones();
  }, []);

  // Filtrar confirmaciones
  const confirmacionesFiltradas = confirmaciones.filter(conf => {
    // Filtro por tipo (asistentes/no asistentes)
    const cumpleFiltro = filtro === 'todos' || 
                         (filtro === 'asistentes' && conf.asistencia) || 
                         (filtro === 'no-asistentes' && !conf.asistencia);
    
    // Filtro por búsqueda
    const cumpleBusqueda = conf.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
                          (conf.mensaje && conf.mensaje.toLowerCase().includes(busqueda.toLowerCase()));
    
    return cumpleFiltro && cumpleBusqueda;
  });

  // Exportar a Excel
  const exportarAExcel = () => {
    // Crear CSV
    const cabeceras = ['Nombre', 'Asistencia', 'Acompañantes', 'Alergias', 'Mensaje', 'Fecha Confirmación'];
    const filas = confirmacionesFiltradas.map(conf => [
      conf.nombre,
      conf.asistencia ? 'Sí' : 'No',
      conf.acompanantes,
      conf.alergias || 'Ninguna',
      conf.mensaje || '',
      new Date(conf.fechaConfirmacion).toLocaleDateString()
    ]);

    const csv = [cabeceras, ...filas].map(row => row.join(',')).join('\n');
    
    // Descargar
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `confirmaciones_boda_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Estadísticas
  const totalInvitados = confirmaciones.length;
  const totalAsistentes = confirmaciones.filter(c => c.asistencia).length;
  const totalNoAsistentes = totalInvitados - totalAsistentes;

  if (loading) {
    return (
      <div className="lista-confirmados loading">
        <p>Cargando confirmaciones...</p>
      </div>
    );
  }

  return (
    <div className="lista-confirmados">
      {/* Encabezado con controles */}
      <div className="controles-superiores">
        <button onClick={() => navigate(-1)} className="btn-volver">
          <BsArrowLeft /> Volver
        </button>
        
        <h2>
          Invitados Confirmados
          <span className="badge">{totalInvitados}</span>
        </h2>
        
        <div className="acciones">
          <button onClick={exportarAExcel} className="btn-exportar">
            <BsDownload /> Exportar
          </button>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="filtros-container">
        <div className="grupo-filtros">
          <div className={`filtro ${filtro === 'todos' ? 'active' : ''}`} onClick={() => setFiltro('todos')}>
            Todos <span>({totalInvitados})</span>
          </div>
          <div className={`filtro ${filtro === 'asistentes' ? 'active' : ''}`} onClick={() => setFiltro('asistentes')}>
            Asistentes <span>({totalAsistentes})</span>
          </div>
          <div className={`filtro ${filtro === 'no-asistentes' ? 'active' : ''}`} onClick={() => setFiltro('no-asistentes')}>
            No asistentes <span>({totalNoAsistentes})</span>
          </div>
        </div>
        
        <div className="busqueda-container">
          <BsSearch className="icono-busqueda" />
          <input
            type="text"
            placeholder="Buscar por nombre o mensaje..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </div>

      {/* Listado de confirmaciones */}
      <div className="tabla-container">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Asistencia</th>
              <th>Acompañantes</th>
              <th>Detalles</th>
            </tr>
          </thead>
          <tbody>
            {confirmacionesFiltradas.length > 0 ? (
              confirmacionesFiltradas.map((item, index) => (
                <tr key={index} className={item.asistencia ? 'asistente' : 'no-asistente'}>
                  <td>
                    <strong>{item.nombre}</strong>
                    {item.relacion && <span className="relacion">{item.relacion}</span>}
                  </td>
                  <td>
                    {item.asistencia ? (
                      <span className="badge asistencia-si">Sí</span>
                    ) : (
                      <span className="badge asistencia-no">No</span>
                    )}
                  </td>
                  <td>{item.asistencia ? item.acompanantes : '-'}</td>
                  <td>
                    <button 
                      onClick={() => navigate(`/confirmar/${item.id}`)}
                      className="btn-detalle"
                    >
                      Ver
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="sin-resultados">
                <td colSpan="4">
                  No se encontraron confirmaciones que coincidan con los filtros
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Resumen estadístico */}
      <div className="resumen-estadistico">
        <div className="estadistica">
          <span className="valor">{totalAsistentes}</span>
          <span className="label">Asistentes confirmados</span>
        </div>
        <div className="estadistica">
          <span className="valor">{totalNoAsistentes}</span>
          <span className="label">No asistentes</span>
        </div>
        <div className="estadistica">
          <span className="valor">
            {totalInvitados > 0 ? Math.round((totalAsistentes / totalInvitados) * 100) : 0}%
          </span>
          <span className="label">Porcentaje de asistencia</span>
        </div>
      </div>
    </div>
  );
};

export default EListaInvitadosqueConfirmaronAsistencia;