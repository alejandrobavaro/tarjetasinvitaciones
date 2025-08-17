import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/scss/_03-Componentes/_CEnviarTarjetaWhattsapp.scss';
import { BsWhatsapp, BsCheckCircle } from 'react-icons/bs';

const CEnviarTarjetaWhattsapp = () => {
  const [invitados, setInvitados] = useState([]);
  const [selectedInvitado, setSelectedInvitado] = useState(null);
  const [disenoInvitacion, setDisenoInvitacion] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [mensajePersonalizado, setMensajePersonalizado] = useState('');
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [historialEnviados, setHistorialEnviados] = useState([]);
  const [linksConfirmacion, setLinksConfirmacion] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // Cargar lista de invitados
        const response = await fetch('/invitados.json');
        const data = await response.json();
        const invitadosProcesados = data.grupos.flatMap(g => 
          g.invitados.map(inv => ({
            ...inv,
            grupoNombre: g.nombre,
            telefono: inv.Contacto?.whatsapp || inv.Contacto?.telefono || ''
          }))
        );
        setInvitados(invitadosProcesados);
        
        // Cargar diseño guardado
        const diseno = JSON.parse(localStorage.getItem('disenoInvitacion')) || null;
        setDisenoInvitacion(diseno);

        // Cargar historial de envíos
        const historial = JSON.parse(localStorage.getItem('historialWhatsApp')) || [];
        setHistorialEnviados(historial);

        // Cargar links de confirmación
        const links = JSON.parse(localStorage.getItem('linksConfirmacion') || '{}');
        setLinksConfirmacion(links);
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  const invitadosFiltrados = busqueda 
    ? invitados.filter(inv => 
        inv.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        inv.grupoNombre.toLowerCase().includes(busqueda.toLowerCase()))
    : invitados;

  // Obtener o generar link de confirmación
  const getConfirmacionLink = (id) => {
    if (!linksConfirmacion[id]) {
      const nuevoLink = `${window.location.origin}/confirmar/${id}`;
      const nuevosLinks = {...linksConfirmacion, [id]: nuevoLink};
      localStorage.setItem('linksConfirmacion', JSON.stringify(nuevosLinks));
      setLinksConfirmacion(nuevosLinks);
      return nuevoLink;
    }
    return linksConfirmacion[id];
  };

  const generarMensaje = () => {
    if (!selectedInvitado || !disenoInvitacion) return '';
    
    const linkConfirmacion = getConfirmacionLink(selectedInvitado.id);
    
    const mensajeBase = `¡Hola ${selectedInvitado.nombre}!\n\n` +
      `*${disenoInvitacion.titulo}*\n\n` +
      `${disenoInvitacion.mensaje}\n\n` +
      `*Fecha:* ${disenoInvitacion.fecha}\n` +
      `*Hora:* ${disenoInvitacion.hora}\n` +
      `*Lugar:* ${disenoInvitacion.lugar}\n` +
      `*Código de vestimenta:* ${disenoInvitacion.codigoVestimenta}\n\n` +
      `Por favor confirma tu asistencia aquí: ${linkConfirmacion}`;
    
    return mensajePersonalizado || mensajeBase;
  };

  const enviarInvitacion = () => {
    if (!selectedInvitado || !disenoInvitacion) return;
    
    setEnviando(true);
    const mensaje = generarMensaje();
    const fechaEnvio = new Date().toISOString();
    
    // Registrar en historial antes de enviar
    const nuevoHistorial = [
      ...historialEnviados,
      {
        id: Date.now(),
        invitadoId: selectedInvitado.id,
        invitadoNombre: selectedInvitado.nombre,
        telefono: selectedInvitado.telefono,
        fechaEnvio,
        mensaje,
        linkConfirmacion: getConfirmacionLink(selectedInvitado.id)
      }
    ];
    
    setHistorialEnviados(nuevoHistorial);
    localStorage.setItem('historialWhatsApp', JSON.stringify(nuevoHistorial));
    
    // Simular envío (en producción sería window.open)
    setTimeout(() => {
      setEnviando(false);
      setEnviado(true);
      setTimeout(() => setEnviado(false), 3000);
      
      // En producción descomentar esto:
      window.open(`https://wa.me/${selectedInvitado.telefono}?text=${encodeURIComponent(mensaje)}`);
    }, 1500);
  };

  if (loading) return <div className="loading">Cargando datos...</div>;

  return (
    <div className="enviar-invitacion-container">
      <div className="header">
        <h1>Enviar Invitación por WhatsApp</h1>
        <button 
          className="btn-volver"
          onClick={() => navigate('/lista-invitados')}
        >
          Volver a la lista
        </button>
      </div>

      <div className="content">
        <div className="seleccion-invitado">
          <h2>Seleccionar Invitado</h2>
          
          <div className="search-group">
            <input
              type="text"
              placeholder="Buscar por nombre o grupo..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          
          <select
            value={selectedInvitado?.id || ''}
            onChange={(e) => {
              const invitado = invitados.find(i => i.id === parseInt(e.target.value));
              setSelectedInvitado(invitado);
              setMensajePersonalizado('');
            }}
          >
            <option value="">Seleccione un invitado</option>
            {invitadosFiltrados.map(invitado => (
              <option key={invitado.id} value={invitado.id}>
                {invitado.nombre} ({invitado.grupoNombre}) - {invitado.telefono}
              </option>
            ))}
          </select>

          {selectedInvitado && (
            <div className="info-invitado">
              <p><strong>Nombre:</strong> {selectedInvitado.nombre}</p>
              <p><strong>Teléfono:</strong> {selectedInvitado.telefono}</p>
              <p><strong>Grupo:</strong> {selectedInvitado.grupoNombre}</p>
              <p><strong>Acompañantes:</strong> {selectedInvitado.acompanantes}</p>
              
              {historialEnviados.some(h => h.invitadoId === selectedInvitado.id) && (
                <div className="envio-previo">
                  <span>✓ Invitación enviada anteriormente</span>
                  <small>
                    {new Date(
                      historialEnviados.find(h => h.invitadoId === selectedInvitado.id).fechaEnvio
                    ).toLocaleString()}
                  </small>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="vista-previa-mensaje">
          <h2>Previsualización del Mensaje</h2>
          
          {!disenoInvitacion ? (
            <div className="alert alert-warning">
              No hay diseño de invitación guardado. Por favor crea uno primero.
            </div>
          ) : !selectedInvitado ? (
            <div className="alert alert-info">
              Selecciona un invitado para previsualizar el mensaje
            </div>
          ) : (
            <>
              <div className="personalizacion-mensaje">
                <label>Personalizar mensaje (opcional):</label>
                <textarea
                  placeholder="Puedes modificar el mensaje predeterminado..."
                  value={mensajePersonalizado}
                  onChange={(e) => setMensajePersonalizado(e.target.value)}
                  rows="4"
                />
              </div>
              
              <div className="mensaje-container whatsapp-preview">
                <div className="whatsapp-header">
                  <div className="contacto">
                    <span className="nombre">{selectedInvitado.nombre}</span>
                    <span className="estado">en línea</span>
                  </div>
                </div>
                
                <div className="mensaje-content">
                  <div className="bubble sent">
                    {generarMensaje().split('\n').map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                </div>
              </div>

              <button
                className="btn-enviar"
                onClick={enviarInvitacion}
                disabled={enviando || !selectedInvitado || !disenoInvitacion}
              >
                {enviando ? 'Enviando...' : 'Enviar por WhatsApp'}
              </button>
              
              {enviado && (
                <div className="envio-exitoso">
                  ¡Invitación enviada correctamente a {selectedInvitado.nombre}!
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {historialEnviados.length > 0 && (
        <div className="historial-envios">
          <h2>Historial de Envíos</h2>
          <div className="historial-table">
            <table>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Invitado</th>
                  <th>Teléfono</th>
                  <th>Link Confirmación</th>
                </tr>
              </thead>
              <tbody>
                {[...historialEnviados].reverse().slice(0, 5).map(envio => (
                  <tr key={envio.id}>
                    <td>{new Date(envio.fechaEnvio).toLocaleString()}</td>
                    <td>{envio.invitadoNombre}</td>
                    <td>{envio.telefono}</td>
                    <td>
                      <a 
                        href={envio.linkConfirmacion} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="link-confirmacion"
                      >
                        Ver link
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CEnviarTarjetaWhattsapp;