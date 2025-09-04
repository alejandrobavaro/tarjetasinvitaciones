import React, { useState, useEffect } from 'react';
import { unstable_HistoryRouter as HistoryRouter, Routes, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import ListaInvitados from './componentes/ListaInvitados';
import Paso0Pasos from './componentes/Paso0Pasos'; 
import PasoMasivo0Pasos from './componentes/PasoMasivo0Pasos';
import Contacto from './componentes/Contacto';
import Header from './componentes/Header';
import Footer from './componentes/Footer';
import Login from './componentes/Login'; // Nuevo componente de login

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
    element: <Paso0Pasos />
  },
  {
    path: '/enviar-invitacion',
    element: <Paso0Pasos />
  },
  {
    path: '/Contacto',
    element: <Contacto />
  },
  {
    path: '/envio-masivo',
    element: <PasoMasivo0Pasos />
  }
];

function App() {
  // ESTADO: Controlar si el usuario está autenticado
  const [autenticado, setAutenticado] = useState(false);
  const [verificando, setVerificando] = useState(true);

  // EFECTO: Verificar autenticación al cargar la aplicación
  useEffect(() => {
    const accesoPermitido = localStorage.getItem('accesoPermitido') === 'true';
    setAutenticado(accesoPermitido);
    setVerificando(false);
  }, []);

  // FUNCIÓN: Manejar login exitoso
  const handleLoginSuccess = () => {
    setAutenticado(true);
  };

  // FUNCIÓN: Cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('accesoPermitido');
    setAutenticado(false);
  };

  // Mostrar loading mientras se verifica la autenticación
  if (verificando) {
    return (
      <div className="cargando-auth">
        <div className="spinner-auth"></div>
        <p>Verificando acceso...</p>
      </div>
    );
  }

  // Mostrar login si no está autenticado
  if (!autenticado) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // Mostrar aplicación normal si está autenticado
  return (
    <HistoryRouter
      history={history}
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      {/* Header con botón de cerrar sesión */}
      <Header onLogout={handleLogout} />
      
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
          
          {/* Ruta para manejar errores 404 */}
          <Route path="*" element={<div className="not-found">Página no encontrada</div>} />
        </Routes>
      </main>
      
      {/* Footer de la aplicación */}
      <Footer />
    </HistoryRouter>
  );
}

export default App;