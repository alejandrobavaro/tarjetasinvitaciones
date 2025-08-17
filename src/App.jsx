import React from 'react';
import { unstable_HistoryRouter as HistoryRouter, Routes, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import AListaInvitados from './componentes/AListaInvitados';
import BCrearTarjetaInvitacion from './componentes/BCrearTarjetaInvitacion';
import CEnviarTarjetaWhattsapp from './componentes/CEnviarTarjetaWhattsapp';
import ContactoUnificado from './componentes/ContactoUnificado';
import Header from './componentes/Header';
import Footer from './componentes/Footer';

// Crear el objeto de historial
const history = createBrowserHistory({ window });

// Objeto de configuración de rutas (solo las que quedan)
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
  // Otras rutas
  {
    path: '/ContactoUnificado',
    element: <ContactoUnificado />
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
      <Header />
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
      <Footer />
    </HistoryRouter>
  );
}

export default App;
