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
│   ├── Paso0Pasos.js # Componente principal de flujo de invitación
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

### Paso0Pasos.js - Flujo Principal de Creación

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



-------------------------------------------------------------------------------
-------------------------------------------------------------------------------

# Documentación del Sistema de Gestión de Invitaciones para Boda

## 📋 Descripción General

Este proyecto es una aplicación web React diseñada para gestionar y enviar invitaciones personalizadas para una boda. La aplicación permite a los organizadores:

- **Gestionar una lista de invitados** con información de contacto y grupos
- **Crear invitaciones personalizadas** con diseño editable
- **Descargar las invitaciones** como imágenes JPG de alta calidad
- **Generar mensajes personalizados** para WhatsApp con enlaces de confirmación
- **Enviar invitaciones directamente** por WhatsApp manteniendo un historial
- **Envíos masivos** por grupos o selección múltiple de invitados

## 🏗️ Estructura del Proyecto

```
src/
├── componentes/
│   ├── Header.js          # Encabezado de navegación
│   ├── Footer.js          # Pie de página
│   ├── ListaInvitados.js  # Gestión de lista de invitados
│   ├── Paso0Pasos.js # Componente principal de flujo de invitación
│   ├── Contacto.js        # Página de contacto
│   ├── PasoMasivo0Pasos.js # Componente principal de flujo masivo
│   └── [Subcomponentes de pasos]/
│       ├── Paso1SeleccionInvitado.js
│       ├── Paso2CrearTarjeta.js
│       ├── Paso3DescargarTarjeta.js
│       ├── Paso4CopiarMensaje.js
│       ├── Paso5EnviarWhatsApp.js
│       └── [Subcomponentes de envío masivo]/
│           ├── PasoMasivo1Seleccion.js
│           ├── PasoMasivo2Diseno.js
│           ├── PasoMasivo3Previsualizacion.js
│           └── PasoMasivo4Envio.js
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
- `/envio-masivo` - Flujo de envío masivo
- `/Contacto` - Página de contacto

### Paso0Pasos.js - Flujo Principal de Creación

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

### PasoMasivo0Pasos.js - Flujo de Envío Masivo

**Propósito**: Coordina el proceso completo de 4 pasos para envíos masivos de invitaciones.

**Estados principales**:
- `pasoActual` - Controla el paso visible (1-4)
- `invitadosSeleccionados` - Lista de invitados seleccionados para envío masivo
- `disenoMasivo` - Plantilla de mensaje para envío masivo

**Funcionalidades**:
- Navegación entre pasos (avanzar, retroceder)
- Persistencia de datos en localStorage
- Barra de progreso visual específica para envío masivo
- Finalización y reinicio del proceso masivo

### PasoMasivo1Seleccion.js - Selección Masiva de Invitados

**Propósito**: Primer paso del flujo masivo - seleccionar múltiples invitados para envío masivo.

**Funcionalidades**:
- Carga la lista de invitados desde `invitados.json`
- Búsqueda y filtrado por nombre, grupo o teléfono
- Selección múltiple con checkboxes individuales y por grupos
- Filtros por estado de envío (todos, enviados, no enviados)
- Controles para expandir/colapsar grupos
- Selección/deselección masiva por grupos o todos los invitados

**Características de interfaz**:
- Diseño compacto y optimizado para grandes listas
- Indicadores visuales de estado de envío
- Contadores de selección en tiempo real
- Interfaz responsive con scroll optimizado

### PasoMasivo2Diseno.js - Diseño de Mensaje Masivo

**Propósito**: Segundo paso del flujo masivo - diseñar la plantilla de mensaje para envío masivo.

**Funcionalidades**:
- Editor de mensaje personalizable con variables
- Variables disponibles: `{nombre}`, `{grupo}`, `{telefono}`
- Inserción rápida de variables
- Vista previa del mensaje con datos de ejemplo
- Plantillas predefinidas (formal, casual)
- Validación de contenido del mensaje

**Variables de personalización**:
- `{nombre}` - Se reemplaza por el nombre del invitado
- `{grupo}` - Se reemplaza por el grupo del invitado
- `{telefono}` - Se reemplaza por el teléfono del invitado

### PasoMasivo3Previsualizacion.js - Previsualización Masiva

**Propósito**: Tercer paso del flujo masivo - revisar mensajes antes del envío.

**Funcionalidades**:
- Navegación entre invitados para previsualización
- Vista detallada del mensaje personalizado para cada invitado
- Estadísticas del mensaje (caracteres, líneas, equivalentes SMS)
- Lista rápida de todos los invitados seleccionados
- Navegación rápida entre invitados

**Características**:
- Visualización del mensaje renderizado con datos reales
- Información completa del invitado en previsualización
- Interfaz de navegación intuitiva

### PasoMasivo4Envio.js - Envío Masivo

**Propósito**: Cuarto paso del flujo masivo - proceso de envío y resultados.

**Funcionalidades**:
- Proceso de envío simulado con barra de progreso
- Estadísticas en tiempo real (éxitos, fallos, porcentaje)
- Copiado automático de mensajes al portapapeles
- Actualización de estados de envío en localStorage
- Manejo de errores y reintentos
- Integración con WhatsApp Web

**Flujo de envío**:
1. Generación de mensajes personalizados para cada invitado
2. Copiado al portapapeles de todos los mensajes
3. Apertura de WhatsApp Web para envío manual
4. Actualización de estados de envío
5. Reporte de resultados finales

## 💾 Persistencia de Datos

La aplicación utiliza localStorage para mantener:

1. **`disenoInvitacion`** - Diseño actual de la invitación individual
2. **`invitadoSeleccionado`** - Invitado actualmente seleccionado
3. **`estadosEnvio`** - Registro de qué invitaciones han sido enviadas
4. **`historialWhatsApp`** - Historial detallado de envíos por WhatsApp
5. **`invitadosMasivosSeleccionados`** - Lista de invitados para envío masivo
6. **`disenoMasivo`** - Plantilla de mensaje para envío masivo

## 🎨 Sistema de Estilos

La aplicación utiliza SCSS organizado en partials:
- Estilos componentes en `_03-Componentes/`
- Estilos específicos para cada paso del flujo individual y masivo
- Diseño responsive y accesible
- Temática consistente con colores de boda

## 🔌 Dependencias y Tecnologías

- **React** (v18+) - Framework principal
- **React Router** - Enrutamiento
- **html2canvas** - Conversión HTML a imagen
- **React Icons** (Fi, Gi) - Conjunto de iconos
- **SCSS** - Preprocesador CSS

## 🚀 Flujos de Trabajo

### Flujo Individual (5 pasos):
1. **Seleccionar invitado** de la lista (Paso 1)
2. **Personalizar invitación** con datos específicos (Paso 2)
3. **Descargar la imagen** JPG de la invitación (Paso 3)
4. **Copiar el mensaje** personalizado para WhatsApp (Paso 4)
5. **Enviar por WhatsApp** y finalizar el proceso (Paso 5)

### Flujo Masivo (4 pasos):
1. **Seleccionar múltiples invitados** (Paso 1)
2. **Diseñar plantilla de mensaje** con variables (Paso 2)
3. **Previsualizar mensajes** para cada invitado (Paso 3)
4. **Enviar masivamente** y gestionar resultados (Paso 4)

## 📱 Características de Usabilidad

- **Progreso visual** con barras de progreso para ambos flujos
- **Persistencia** entre recargas de página
- **Validaciones** en cada paso
- **Manejo de errores** con feedback visual
- **Interfaz intuitiva** con instrucciones claras
- **Diseño responsive** para diferentes dispositivos
- **Accesibilidad** con navegación por teclado

## 🔄 Flujo de Datos

### Flujo Individual:
```
invitados.json → Paso1 → Invitado seleccionado → Paso2 → Diseño personalizado
     ↓
LocalStorage   ← Persistencia → Paso3 → Imagen JPG → Paso4 → Mensaje WhatsApp
     ↓
Actualización estado → Paso5 → WhatsApp API → Historial → Finalización
```

### Flujo Masivo:
```
invitados.json → PasoMasivo1 → Invitados seleccionados → PasoMasivo2 → Plantilla mensaje
     ↓
LocalStorage   ← Persistencia → PasoMasivo3 → Previsualización → PasoMasivo4 → Envío masivo
     ↓
Actualización estados → WhatsApp Web → Resultados → Finalización
```

## 🆕 Sección de Envíos Masivos - Características Adicionales

### Selección Avanzada de Invitados
- **Selección por grupos**: Permite seleccionar/deseleccionar grupos completos
- **Filtros combinados**: Búsqueda por texto + filtro por estado de envío
- **Interfaz optimizada**: Diseño compacto para manejar grandes listas
- **Estados visuales**: Indicadores claros de selección y estado de envío

### Plantillas de Mensaje Inteligentes
- **Variables dinámicas**: {nombre}, {grupo}, {telefono} para personalización automática
- **Plantillas predefinidas**: Opciones formales y casuales
- **Editor avanzado**: Con sugerencias de variables y vista previa en tiempo real

### Proceso de Envío Optimizado
- **Progreso en tiempo real**: Barra de progreso y estadísticas durante el envío
- **Manejo de errores**: Continuación tras fallos con reporte detallado
- **Integración WhatsApp Web**: Copiado automático al portapapeles + apertura directa
- **Actualización de estados**: Marcado automático de invitados como enviados

### Experiencia de Usuario Mejorada
- **Navegación intuitiva**: Entre pasos y entre invitados en previsualización
- **Feedback constante**: Información de estado y resultados en cada paso
- **Diseño responsive**: Optimizado para desktop y tablet
- **Accesibilidad**: Navegación por teclado y lectores de pantalla

Esta nueva sección de envíos masivos permite gestionar eficientemente el envío de invitaciones a múltiples contactos simultáneamente, manteniendo la personalización individual y optimizando el tiempo de los organizadores.