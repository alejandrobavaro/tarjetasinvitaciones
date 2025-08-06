import React, { useState, useEffect } from 'react';
import '../assets/scss/_03-Componentes/_EListaInvitadosqueConfirmaronAsistencia.scss';

const EListaInvitadosqueConfirmaronAsistencia = () => {
  const [confirmaciones, setConfirmaciones] = useState([]);

  useEffect(() => {
    const cargarConfirmaciones = async () => {
      const confirmacionesData = JSON.parse(localStorage.getItem('confirmaciones') || '{}');
      const response = await fetch('/invitados.json');
      const data = await response.json();
      
      const lista = Object.entries(confirmacionesData).map(([id, conf]) => {
        const invitado = data.grupos.flatMap(g => g.invitados).find(i => i.id === parseInt(id));
        return { ...invitado, ...conf };
      });
      
      setConfirmaciones(lista);
    };
    cargarConfirmaciones();
  }, []);

  return (
    <div className="lista-confirmados">
      <h2>Invitados Confirmados</h2>
      <div className="estadisticas">
        Total: {confirmaciones.length}
      </div>
      
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Acompañantes</th>
          </tr>
        </thead>
        <tbody>
          {confirmaciones.map((item, index) => (
            <tr key={index}>
              <td>{item.nombre}</td>
              <td>{item.acompanantes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EListaInvitadosqueConfirmaronAsistencia;