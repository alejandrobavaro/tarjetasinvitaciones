import React, { useState, useEffect } from 'react';
import '../assets/scss/_03-Componentes/_AListaInvitados.scss';

const AListaInvitados = () => {
  const [invitados, setInvitados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orden, setOrden] = useState({ campo: 'nombre', direccion: 'asc' });

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

        // Línea corregida:
        const estadosEnvio = JSON.parse(localStorage.getItem('estadosEnvio') || '{}');

        const invitadosProcesados = data.grupos.flatMap(grupo => {
          if (!grupo.invitados || !Array.isArray(grupo.invitados)) {
            return [];
          }
          return grupo.invitados.map(invitado => ({
            ...invitado,
            grupoNombre: grupo.nombre,
            enviado: estadosEnvio[invitado.id] || false,
            telefono: invitado.contacto?.telefono || 'N/A'
          }));
        });

        setInvitados(invitadosProcesados);
      } catch (err) {
        console.error("Error cargando invitados:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    cargarInvitados();
  }, []);

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

  const cambiarOrden = () => {
    setOrden({
      campo: 'nombre',
      direccion: orden.direccion === 'asc' ? 'desc' : 'asc'
    });
  };

  const invitadosOrdenados = [...invitados].sort((a, b) => {
    if (a.nombre < b.nombre) return orden.direccion === 'asc' ? -1 : 1;
    if (a.nombre > b.nombre) return orden.direccion === 'asc' ? 1 : -1;
    return 0;
  });

  if (loading) {
    return <div className="loading">Cargando lista de invitados...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="lista-invitados-container">
      <h1>Lista de Invitados</h1>
      
      {invitados.length === 0 ? (
        <div className="no-invitados">No se encontraron invitados</div>
      ) : (
        <div className="tabla-invitados">
          <table>
            <thead>
              <tr>
                <th onClick={cambiarOrden}>
                  Nombre {orden.campo === 'nombre' && (orden.direccion === 'asc' ? '↑' : '↓')}
                </th>
                <th>Grupo</th>
                <th>Teléfono</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {invitadosOrdenados.map(invitado => (
                <tr key={invitado.id}>
                  <td>{invitado.nombre}</td>
                  <td>{invitado.grupoNombre}</td>
                  <td>{invitado.telefono}</td>
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

export default AListaInvitados;