import React from 'react';
import { unstable_HistoryRouter as HistoryRouter, Routes, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import AListaInvitados from './componentes/AListaInvitados';
import BCrearTarjetaInvitacion from './componentes/BCrearTarjetaInvitacion';
import CEnviarTarjetaWhattsapp from './componentes/CEnviarTarjetaWhattsapp';
import DPaginaConfirmacionInvitado from './componentes/DPaginaConfirmacionInvitado';
import EListaInvitadosqueConfirmaronAsistencia from './componentes/EListaInvitadosqueConfirmaronAsistencia';
import ContactoUnificado from './componentes/ContactoUnificado';
import Header from './componentes/Header';
import Footer from './componentes/Footer';
import BackupData from './componentes/BackupData';

// Crear el objeto de historial
const history = createBrowserHistory({ window });

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
    path: '/ContactoUnificado',
    element: <ContactoUnificado />
  },
  // Ruta de Backup
  {
    path: '/backup',
    element: <BackupData />,
    alias: '/organizacion/backup'
  }
];

function App() {
  return (
    <HistoryRouter
      history={history}
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
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
    </HistoryRouter>
  );
}

export default App;