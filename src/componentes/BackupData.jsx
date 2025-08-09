import React, { useState } from 'react';
import { BsCloudDownload, BsCloudUpload, BsDatabase } from 'react-icons/bs';
import '../assets/scss/_03-Componentes/_BackupData.scss';

const BackupData = () => {
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('');

  // Exportar datos
  const exportarDatos = () => {
    try {
      const confirmaciones = localStorage.getItem('confirmaciones') || '{}';
      const links = localStorage.getItem('linksConfirmacion') || '{}';
      
      const data = {
        confirmaciones: JSON.parse(confirmaciones),
        linksConfirmacion: JSON.parse(links),
        fechaBackup: new Date().toISOString()
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      link.href = url;
      link.download = `backup_boda_${new Date().toISOString().slice(0,10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setMensaje('Backup exportado con éxito');
      setTipoMensaje('exito');
    } catch (error) {
      setMensaje('Error al exportar backup');
      setTipoMensaje('error');
    }
    
    setTimeout(() => setMensaje(''), 3000);
  };

  // Importar datos
  const importarDatos = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        
        if (data.confirmaciones && data.linksConfirmacion) {
          if (window.confirm('¿Estás seguro de sobrescribir los datos actuales?')) {
            localStorage.setItem('confirmaciones', JSON.stringify(data.confirmaciones));
            localStorage.setItem('linksConfirmacion', JSON.stringify(data.linksConfirmacion));
            
            // Disparar evento para actualizar otros componentes
            window.dispatchEvent(new Event('confirmacionActualizada'));
            
            setMensaje('Datos importados con éxito');
            setTipoMensaje('exito');
          }
        } else {
          setMensaje('Archivo no válido');
          setTipoMensaje('error');
        }
      } catch (error) {
        setMensaje('Error al importar archivo');
        setTipoMensaje('error');
      }
      
      setTimeout(() => setMensaje(''), 3000);
    };
    reader.readAsText(file);
  };

  return (
    <div className="backup-container">
      <h2><BsDatabase /> Gestión de Backup</h2>
      <p className="descripcion">
        Exporta o importa todas las confirmaciones y links de invitación.
      </p>

      <div className="acciones-backup">
        <button onClick={exportarDatos} className="btn-backup exportar">
          <BsCloudDownload /> Exportar Backup
        </button>
        
        <label className="btn-backup importar">
          <BsCloudUpload /> Importar Backup
          <input 
            type="file" 
            accept=".json" 
            onChange={importarDatos}
            style={{ display: 'none' }}
          />
        </label>
      </div>

      {mensaje && (
        <div className={`mensaje-backup ${tipoMensaje}`}>
          {mensaje}
        </div>
      )}

      <div className="info-backup">
        <h3>Datos incluidos en el backup:</h3>
        <ul>
          <li>Todas las confirmaciones de asistencia</li>
          <li>Links de confirmación personalizados</li>
          <li>Fechas de confirmación</li>
          <li>Mensajes y detalles de los invitados</li>
        </ul>
      </div>
    </div>
  );
};

export default BackupData;