# Documentación del Sistema de Gestión de Invitaciones para Boda

## 📋 Descripción General

Este proyecto es una aplicación web React diseñada para gestionar y enviar invitaciones personalizadas para una boda. La aplicación permite a los organizadores:

- **Gestionar una lista de invitados** con información de contacto y grupos
- **Crear invitaciones personalizadas** con diseño editable
- **Descargar las invitaciones** como imágenes JPG de alta calidad
- **Generar mensajes personalizados** para WhatsApp con enlaces de confirmación
- **Enviar invitaciones directamente** por WhatsApp manteniendo un historial

## 🏗️ Estructura del Proyecto

```
src/
├── componentes/
│   ├── Header.js          # Encabezado de navegación
│   ├── Footer.js          # Pie de página
│   ├── ListaInvitados.js  # Gestión de lista de invitados
│   ├── PasosInvitacion.js # Componente principal de flujo de invitación
│   ├── Contacto.js        # Página de contacto
│   └── [Subcomponentes de pasos]/
│       ├── Paso1SeleccionInvitado.js
│       ├── Paso2CrearTarjeta.js
│       ├── Paso3DescargarTarjeta.js
│       ├── Paso4CopiarMensaje.js
│       └── Paso5EnviarWhatsApp.js
├── assets/
│   └── scss/              # Estilos SCSS organizados
└── App.js                 # Componente principal con enrutamiento
```

## 🧩 Componentes Principales

### App.js - Componente Principal y Enrutamiento

**Propósito**: Configura el enrutamiento principal de la aplicación y la estructura base.

**Funcionalidades**:
- Define las rutas de la aplicación usando React Router
- Configura el historial de navegación
- Proporciona la estructura base con Header, contenido principal y Footer
- Maneja rutas no encontradas (404)

**Rutas configuradas**:
- `/` y `/organizacion/invitados` - Lista de invitados
- `/crear-invitacion` y `/organizacion/previsualizar-invitacion` - Flujo de creación
- `/enviar-invitacion` - Redirección al flujo completo
- `/Contacto` - Página de contacto

### PasosInvitacion.js - Flujo Principal de Creación

**Propósito**: Coordina el proceso completo de 5 pasos para crear y enviar invitaciones.

**Estados principales**:
- `pasoActual` - Controla el paso visible (1-5)
- `disenoInvitacion` - Almacena el diseño de la invitación (persistente)
- `invitadoSeleccionado` - Invitado actual para personalización

**Funcionalidades**:
- Navegación entre pasos (avanzar, retroceder, saltar a paso específico)
- Persistencia de datos en localStorage
- Barra de progreso visual
- Finalización y reinicio del proceso

### Paso1SeleccionInvitado.js - Selección de Invitado

**Propósito**: Primer paso - seleccionar el invitado para personalizar la invitación.

**Funcionalidades**:
- Carga la lista de invitados desde `invitados.json`
- Búsqueda y filtrado por nombre, grupo o teléfono
- Visualización de estado de envío previo
- Selección del invitado para personalización

**Estados**:
- `invitados` - Lista completa de invitados
- `busqueda` - Término de búsqueda para filtrar
- `loading` y `error` - Estados de carga y error

### Paso2CrearTarjeta.js - Diseño de Invitación

**Propósito**: Segundo paso - diseñar y personalizar la tarjeta de invitación.

**Funcionalidades**:
- Formulario editable para todos los detalles de la invitación
- Vista previa en tiempo real con el nombre del invitado seleccionado
- Campos personalizables (nombres, hora, lugar, vestimenta, etc.)
- Persistencia automática de cambios

**Características de diseño**:
- Iconos decorativos consistentes (FiUser, FiHeart, GiRing, etc.)
- Estructura visual atractiva con separadores elegantes
- Diseño responsive para vista previa

### Paso3DescargarTarjeta.js - Descarga de Invitación

**Propósito**: Tercer paso - convertir la tarjeta a imagen JPG y descargarla.

**Funcionalidades**:
- Conversión de HTML a imagen usando html2canvas
- Descarga en alta calidad (scale: 3)
- Manejadores de estado para descarga (éxito/error)
- Vista idéntica al paso 2 para consistencia

**Características técnicas**:
- Alta resolución (scale: 3)
- Formato JPG con 95% de calidad
- Nombres de archivo personalizados con el nombre del invitado

### Paso4CopiarMensaje.js - Generación de Mensaje

**Propósito**: Cuarto paso - generar y copiar mensaje personalizado para WhatsApp.

**Funcionalidades**:
- Generación automática de mensaje con todos los detalles
- Inclusión de enlaces fijos para confirmación y ubicación
- Vista previa simulando interfaz de WhatsApp
- Copiado al portapapeles con manejo de errores

**Enlaces fijos incluidos**:
- Confirmación: `https://confirmarasistenciaevento.netlify.app/`
- Ubicación: `https://noscasamos-aleyfabi.netlify.app/ubicacion`

### Paso5EnviarWhatsApp.js - Envío por WhatsApp

**Propósito**: Quinto paso - integración con WhatsApp y finalización del proceso.

**Funcionalidades**:
- Apertura de WhatsApp con mensaje predefinido
- Validación de número de teléfono
- Registro de envío en historial (localStorage)
- Actualización de estado del invitado
- Visualización de historial reciente

**Características**:
- Formateo automático de números de teléfono
- Manejo de envíos previos y reenvíos
- Interfaz de confirmación y finalización

## 💾 Persistencia de Datos

La aplicación utiliza localStorage para mantener:

1. **`disenoInvitacion`** - Diseño actual de la invitación
2. **`invitadoSeleccionado`** - Invitado actualmente seleccionado
3. **`estadosEnvio`** - Registro de qué invitaciones han sido enviadas
4. **`historialWhatsApp`** - Historial detallado de envíos por WhatsApp

## 🎨 Sistema de Estilos

La aplicación utiliza SCSS organizado en partials:
- Estilos componentes en `_03-Componentes/`
- Estilos específicos para cada paso del flujo
- Diseño responsive y accesible

## 🔌 Dependencias y Tecnologías

- **React** (v18+) - Framework principal
- **React Router** - Enrutamiento
- **html2canvas** - Conversión HTML a imagen
- **React Icons** (Fi, Gi) - Conjunto de iconos
- **SCSS** - Preprocesador CSS

## 🚀 Flujo de Trabajo Típico

1. **Seleccionar invitado** de la lista (Paso 1)
2. **Personalizar invitación** con datos específicos (Paso 2)
3. **Descargar la imagen** JPG de la invitación (Paso 3)
4. **Copiar el mensaje** personalizado para WhatsApp (Paso 4)
5. **Enviar por WhatsApp** y finalizar el proceso (Paso 5)

## 📱 Características de Usabilidad

- **Progreso visual** con barra de 5 pasos
- **Persistencia** entre recargas de página
- **Validaciones** en cada paso
- **Manejo de errores** con feedback visual
- **Interfaz intuitiva** con instrucciones claras
- **Diseño responsive** para diferentes dispositivos

## 🔄 Flujo de Datos

```
invitados.json → Paso1 → Invitado seleccionado → Paso2 → Diseño personalizado
     ↓
LocalStorage   ← Persistencia → Paso3 → Imagen JPG → Paso4 → Mensaje WhatsApp
     ↓
Actualización estado → Paso5 → WhatsApp API → Historial → Finalización
```

