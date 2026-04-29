# Examen 3 - Portal Académico SII ITC

Proyecto desarrollado para consumir la API REST del sistema SII ITC, permitiendo la autenticación de usuarios y visualización estructurada de su información académica.

## 🚀 Tecnologías Utilizadas

- **Framework Principal:** Next.js (App Router) - Elegido por su robustez, manejo de rutas API integradas (crucial para el proxy CORS) y renderizado optimizado.
- **Librería UI:** React 18
- **Lenguaje:** TypeScript - Proporciona tipado estático para manejar las respuestas de la API de forma segura.
- **Estilos:** Vanilla CSS (CSS Modules & CSS Variables) - Implementando un diseño único basado en "Neo-Brutalismo Moderno" con una paleta de colores verdes (Emerald).
- **Iconografía:** Lucide React
- **Gestión de Estado:** React Context API (para la autenticación).

## 📂 Arquitectura y Explicación de Archivos

A continuación se detalla la función de cada archivo clave dentro del código fuente (`src/`):

### 1. Configuración y Utilidades Base

- **`src/lib/api.ts`**: Contiene la función `apiFetch`. Es el núcleo de las peticiones HTTP del frontend. Automáticamente inyecta el token JWT (usando `Bearer` y `x-auth-token`) en los headers y redirige las peticiones hacia nuestro Proxy local (`/api/external/...`) para evitar bloqueos CORS.
- **`src/context/AuthContext.tsx`**: Maneja el estado global de autenticación. Almacena el token JWT en el navegador (cookies/localStorage), provee las funciones `login` y `logout`, y protege las rutas redirigiendo al usuario si no está autenticado.
- **`src/app/globals.css`**: Archivo de estilos globales. Define las variables de color (tema verde neo-brutalista), estilos de tipografía, animaciones básicas (`skeleton`) y estilos de las tarjetas (cards).

### 2. Infraestructura Backend (Proxy)

- **`src/app/api/external/[...path]/route.ts`**: **Crítico para el funcionamiento.** Es un servidor intermediario (Proxy) construido con Next.js API Routes. Recibe las peticiones del frontend y las reenvía a `https://sii.celaya.tecnm.mx`. 
  - *¿Por qué es necesario?* Los navegadores bloquean peticiones directas desde `localhost` a dominios externos por políticas CORS. Este archivo actúa como puente desde el lado del servidor, donde CORS no aplica.
  - *Funcionalidad*: Desactiva validaciones SSL estrictas (común en servidores universitarios), extrae los parámetros dinámicos (Next.js v15+ Promise params) y reenvía cabeceras de autorización y el cuerpo de la petición.

### 3. Componentes Reutilizables

- **`src/components/DataRenderer.tsx`**: Componente altamente dinámico que recibe cualquier JSON (objeto o array) y lo renderiza visualmente. Detecta automáticamente si un valor es una imagen (basado en la clave o el contenido) para mostrar etiquetas `<img>`, trunca textos muy largos, genera tablas para arrays y tarjetas para objetos.
- **`src/components/PageWithRawData.tsx`**: Componente envoltura (wrapper). Muestra en la parte superior el diseño bonito (usando `DataRenderer`) y en la parte inferior un botón colapsable que permite ver el JSON puro (Datos crudos) que devolvió la API. Útil para depuración y para cumplir requisitos de transparencia de datos.
- **`src/components/Sidebar.tsx`**: El menú de navegación lateral que permite cambiar entre Perfil, Calificaciones, Kardex, Horario y el Success Kit.

### 4. Vistas de la Aplicación (Rutas)

- **`src/app/login/page.tsx`**: Pantalla de inicio de sesión. Envía las credenciales al proxy, extrae el token JWT específicamente de la ruta `data.message.login.token` (formato único del SII ITC) y lo guarda en el contexto.
- **`src/app/dashboard/page.tsx`**: Pantalla principal tras el login. Consume el endpoint de perfil (`/api/movil/estudiante`). Extrae los datos anidados en `message` y los pasa al renderizador visual.
- **`src/app/grades/page.tsx`**: Vista de Calificaciones. Consume el endpoint respectivo. Incluye lógica compleja para:
  - Buscar materias en tiempo real.
  - Filtrar por periodo.
  - Asignar colores (Verde, Azul, Amarillo, Rojo) dependiendo de la calificación numérica extraída dinámicamente.
- **`src/app/kardex/page.tsx`**: Historial académico. Procesa el array devuelto por la API, agrupa las materias por semestre/ciclo y las muestra en tablas separadas.
- **`src/app/schedule/page.tsx`**: Horario semestral. Agrupa las clases por día de la semana, las ordena por hora de inicio, filtra datos basura ("Sin día") y asigna un color único a cada día de la semana.
- **`src/app/success-kit/page.tsx`**: **Funcionalidad Adicional.** Implementa herramientas extra para el estudiante, como una "Calculadora de Promedio (GPA)" y un tablón de noticias simulado.

## 🛠️ Instrucciones de Instalación y Ejecución

1. Asegúrate de tener **Node.js** (v18 o superior) instalado.
2. Clona o descarga este repositorio.
3. Abre una terminal en la carpeta del proyecto.
4. Instala las dependencias ejecutando:
   ```bash
   npm install
   ```
5. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
6. Abre tu navegador y dirígete a `http://localhost:3000` (o el puerto que indique la consola, comúnmente 3001).

---
*Desarrollado para la materia de Tecnologías y Aplicaciones en Internet.*
