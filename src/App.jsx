import React from 'react'; // Importación faltante
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AListaInvitados from './componentes/AListaInvitados';
import BCrearTarjetaInvitacion from './componentes/BCrearTarjetaInvitacion';
import CEnviarTarjetaWhattsapp from './componentes/CEnviarTarjetaWhattsapp';
import DPaginaConfirmacionInvitado from './componentes/DPaginaConfirmacionInvitado';
import EListaInvitadosqueConfirmaronAsistencia from './componentes/EListaInvitadosqueConfirmaronAsistencia';
import Contacto from './componentes/Contacto';
import Header from './componentes/Header';
import Footer from './componentes/Footer';

// Objeto de configuración de rutas
const routesConfig = [
  // Paso 1 - Lista de Invitados
  { 
    path: '/', 
    element: <AListaInvitados />,
    alias: '/organizacion/invitados'
  },
  // Paso 2 - Crear Invitación
  { 
    path: '/crear-invitacion', 
    element: <BCrearTarjetaInvitacion />,
    alias: '/organizacion/previsualizar-invitacion'
  },
  // Paso 3 - Enviar Invitaciones
  { 
    path: '/enviar-invitacion', 
    element: <CEnviarTarjetaWhattsapp /> 
  },
  // Paso 4 - Confirmación de Invitado
  { 
    path: '/confirmar/:id', 
    element: <DPaginaConfirmacionInvitado /> 
  },
  // Paso 5 - Lista de Confirmados
  { 
    path: '/confirmados', 
    element: <EListaInvitadosqueConfirmaronAsistencia />,
    alias: '/organizacion/ListadeConfirmaciones'
  },
  // Otras rutas
  { 
    path: '/contacto', 
    element: <Contacto /> 
  }
];

function App() {
  return (
    <Router>
      {/* Header con barra de progreso */}
      <Header />
      
      {/* Contenido principal */}
      <main className="main-content">
        <Routes>
          {routesConfig.map((route, index) => (
            <React.Fragment key={index}>
              <Route path={route.path} element={route.element} />
              {route.alias && <Route path={route.alias} element={route.element} />}
            </React.Fragment>
          ))}
          
          {/* Ruta para manejar errores 404 */}
          <Route path="*" element={<div className="not-found">Página no encontrada</div>} />
        </Routes>
      </main>

      {/* Footer principal */}
      <Footer />
    </Router>
  );
}

export default App;