import React from 'react';
import { unstable_HistoryRouter as HistoryRouter, Routes, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import ListaInvitados from './componentes/ListaInvitados';
import PasosInvitacion from './componentes/PasosInvitacion'; 
import Contacto from './componentes/Contacto';
import Header from './componentes/Header';
import Footer from './componentes/Footer';

// Crear el objeto de historial
const history = createBrowserHistory({ window });

const routesConfig = [
  {
    path: '/',
    element: <ListaInvitados />
  },
  {
    path: '/organizacion/invitados',
    element: <ListaInvitados />
  },
  {
    path: '/crear-invitacion',
    element: <PasosInvitacion />
  },
  {
    path: '/enviar-invitacion',
    element: <PasosInvitacion />
  },
  {
    path: '/Contacto',
    element: <Contacto />
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
      {/* Header con navegación */}
      <Header />
      
      {/* Contenido principal con rutas */}
      <main className="main-content">
        <Routes>
          {routesConfig.map((route, index) => (
            <Route 
              key={index} 
              path={route.path} 
              element={route.element} 
            />
          ))}
          
          {/* Ruta para manejar errores 404 - Página no encontrada */}
          <Route path="*" element={<div className="not-found">Página no encontrada</div>} />
        </Routes>
      </main>
      
      {/* Footer de la aplicación */}
      <Footer />
    </HistoryRouter>
  );
}

export default App;