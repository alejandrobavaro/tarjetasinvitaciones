import React, { useState, useEffect } from 'react';
import '../assets/scss/_03-Componentes/_Paso1SeleccionInvitado.scss';

/**
 * COMPONENTE: Paso1SeleccionInvitado
 * PROPÓSITO: Primer paso del flujo - Seleccionar el invitado específico
 * CONEXIONES: 
 * - Recibe props del componente principal PasosInvitacion
 * - Carga la lista de invitados desde invitados.json
 * - Filtra y busca invitados por nombre o grupo
 * - Permite seleccionar un invitado para personalizar la invitación
 */
const Paso1SeleccionInvitado = ({ 
  invitadoSeleccionado, 
  setInvitadoSeleccionado, 
  avanzarPaso 
}) => {
  // ESTADO: Lista completa de invitados cargada desde JSON
  const [invitados, setInvitados] = useState([]);
  
  // ESTADO: Término de búsqueda para filtrar invitados
  const [busqueda, setBusqueda] = useState('');
  
  // ESTADO: Control de carga y errores
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // EFECTO: Cargar lista de invitados al montar el componente
  useEffect(() => {
    const cargarInvitados = async () => {
      try {
        setLoading(true);
        const response = await fetch('/invitados.json');
        
        if (!response.ok) {
          throw new Error('No se pudo cargar la lista de invitados');
        }
        
        const data = await response.json();
        
        // Validar estructura de datos
        if (!data.grupos || !Array.isArray(data.grupos)) {
          throw new Error('Formato de datos inválido en invitados.json');
        }

        // Procesar y aplanar la lista de invitados
        const invitadosProcesados = data.grupos.flatMap(grupo => {
          if (!grupo.invitados || !Array.isArray(grupo.invitados)) {
            return [];
          }
          
          return grupo.invitados.map(invitado => ({
            ...invitado,
            grupoNombre: grupo.nombre,
            telefono: invitado.Contacto?.whatsapp || invitado.Contacto?.telefono || 'Sin teléfono',
            // Cargar estado de envío desde localStorage si existe
            enviado: JSON.parse(localStorage.getItem('estadosEnvio') || '{}')[invitado.id] || false
          }));
        });

        setInvitados(invitadosProcesados);
        setError(null);
      } catch (err) {
        console.error("Error cargando invitados:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    cargarInvitados();
  }, []);

  // FUNCIÓN: Filtrar invitados según término de búsqueda
  const invitadosFiltrados = busqueda 
    ? invitados.filter(invitado => 
        invitado.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        invitado.grupoNombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        (invitado.telefono && invitado.telefono.includes(busqueda))
      )
    : invitados;

  // FUNCIÓN: Manejar selección de invitado
  const handleSeleccionInvitado = (invitado) => {
    setInvitadoSeleccionado(invitado);
  };

  // FUNCIÓN: Verificar si puede avanzar al siguiente paso
  const puedeAvanzar = () => {
    return invitadoSeleccionado !== null;
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
    <div className="paso1-seleccion-invitado">
      <div className="instrucciones">
        <h2>Paso 1: Selecciona un Invitado</h2>
        <p>Elige el invitado para quien crearás la invitación personalizada.</p>
      </div>

      {/* Búsqueda de invitados */}
      <div className="busqueda-invitados">
        <div className="search-group">
          <input
            type="text"
            placeholder="Buscar por nombre, grupo o teléfono..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="input-busqueda"
          />
          <span className="icono-busqueda">🔍</span>
        </div>
        
        <div className="contador-resultados">
          {invitadosFiltrados.length} de {invitados.length} invitados
        </div>
      </div>

      {/* Lista de invitados - MÁS COMPACTA */}
      <div className="lista-invitados-compacta">
        {invitadosFiltrados.length === 0 ? (
          <div className="sin-resultados">
            <p>No se encontraron invitados que coincidan con "{busqueda}"</p>
            <button 
              onClick={() => setBusqueda('')}
              className="btn-limpiar-busqueda"
            >
              Limpiar búsqueda
            </button>
          </div>
        ) : (
          <div className="lista-compacta">
            {invitadosFiltrados.map(invitado => (
              <div
                key={invitado.id}
                className={`item-invitado ${
                  invitadoSeleccionado?.id === invitado.id ? 'seleccionado' : ''
                } ${invitado.enviado ? 'ya-enviado' : ''}`}
                onClick={() => handleSeleccionInvitado(invitado)}
              >
                <div className="info-compacta">
                  <div className="nombre-grupo">
                    <span className="nombre">{invitado.nombre}</span>
                    <span className="grupo">{invitado.grupoNombre}</span>
                  </div>
                  
                  <div className="detalles-rapidos">
                    <span className="telefono">📱 {invitado.telefono}</span>
                    {invitado.acompanantes > 0 && (
                      <span className="acompanantes">👥 {invitado.acompanantes}</span>
                    )}
                  </div>
                </div>
                
                <div className="estados">
                  {invitado.enviado && (
                    <span className="badge-enviado">✓</span>
                  )}
                  <span className="indicador-seleccion">
                    {invitadoSeleccionado?.id === invitado.id ? '✓' : '→'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Información del invitado seleccionado */}
      {invitadoSeleccionado && (
        <div className="panel-invitado-seleccionado">
          <h3>Invitado Seleccionado:</h3>
          <div className="info-invitado-detalle">
            <p><strong>Nombre:</strong> {invitadoSeleccionado.nombre}</p>
            <p><strong>Grupo:</strong> {invitadoSeleccionado.grupoNombre}</p>
            <p><strong>Teléfono:</strong> {invitadoSeleccionado.telefono}</p>
            {invitadoSeleccionado.acompanantes > 0 && (
              <p><strong>Acompañantes:</strong> {invitadoSeleccionado.acompanantes}</p>
            )}
            {invitadoSeleccionado.enviado && (
              <p className="advertencia-enviado">
                ⚠️ Ya se envió una invitación a esta persona
              </p>
            )}
          </div>
        </div>
      )}

      {/* Acciones del paso */}
      <div className="acciones-paso">
     
        {!puedeAvanzar() && (
          <p className="mensaje-ayuda">
            💡 Selecciona un invitado para continuar
          </p>
        )}
      </div>
    </div>
  );
};

export default Paso1SeleccionInvitado;