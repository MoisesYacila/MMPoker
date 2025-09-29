---
## 🌍 Language / Idioma
[English](README.md) (🇬🇧 🇪🇺)

# MMPoker ♦️♠️♥️♣️
## Seguimiento de Liga de Poker

Una aplicación web full-stack para registrar partidas de poker, estadísticas de jugadores y clasificaciones para noches de poker entre amigos o ligas locales. Construida con el stack MERN (MongoDB, Express, React, Node.js), esta app calcula automáticamente estadísticas individuales y globales después de cada partida.

> ⚠️ Este proyecto está en **desarrollo activo** — las funciones principales ya están listas, pero aún está en fase de desarrollo.

---

## 🚀 Funcionalidades

1. **Gestión de Jugadores**
   - Añadir nuevos jugadores con nombre y nacionalidad.
   - Ver perfiles detallados de jugadores, incluyendo:
     - Partidas jugadas
     - Victorias
     - Ganancias
     - Veces en premios (ITM - In The Money)
     - Recompras, add-ons y bounties
   - Eliminar jugadores (solo si no forman parte de ninguna partida).

2. **Gestión de Partidas**
   - Añadir nuevas partidas de poker especificando:
     - Jugadores que participaron
     - Desempeño de cada jugador (ganancias, recompras, add-ons, etc.)
   - Editar y eliminar partidas, actualizando automáticamente las estadísticas.

3. **Clasificación**
   - Ver un ranking ordenable de jugadores basado en:
     - Partidas jugadas
     - Victorias
     - Veces en premios
     - Ganancias
     - Otros datos como recompras, add-ons y bounties.

4. **Estadísticas**
   - Alternar entre **Estadísticas Totales** y **Promedios**:
     - Totales: más partidas jugadas, más victorias, más ganancias, etc.
     - Promedios: mejor ganancia promedio, % de finalizar en premios, % de finalizar en la burbuja (OTB - On The Bubble), etc.
   - Visualización clara usando tarjetas y listas.

5. **Noticias**
   - Los administradores pueden publicar actualizaciones, resultados y más.
   - Los usuarios pueden comentar y dar "me gusta" a las publicaciones.
   - Soporte para subir imágenes en las publicaciones.
  
6. **Autenticación y Gestión de Cuenta**
   - Registro e inicio de sesión (local y Google OAuth 2.0).
   - Editar perfil (usuario, email, nombre completo).
   - Ver información y configuración de la cuenta.

7. **Manejo de errores**
   - Páginas personalizadas para errores 404 (No encontrado) y 403 (No autorizado).

8. **Navegación**
   - Barra de navegación intuitiva con enlaces a todas las secciones.

9. **UI Responsiva**
   - Diseño mayormente responsivo; se sigue puliendo para móviles.

---

## 🛠️ Tecnologías

### **Frontend**
- **React**: Desarrollo de UI basada en componentes.
- **Material UI**: Componentes con estilo moderno y responsivo.
- **React Router**: Navegación fluida entre páginas.
- **Axios**: Para solicitudes al backend.

### **Backend**
- **Node.js**: Entorno de ejecución para JS del lado del servidor.
- **Express**: Framework para construir APIs REST.
- **MongoDB**: Base de datos NoSQL para jugadores y partidas.
- **Mongoose**: ODM para gestionar esquemas y consultas.
- **Passport.js**: Autenticación local y con Google.

- **Subida de imágenes:** Cloudinary

---

## 📸 Capturas de Pantalla (Próximamente)

Pronto agregaré imágenes del ranking, formularios de partida y vistas de estadísticas de jugadores.

---

## 🧑‍💻 Cómo Ejecutar Localmente

### Requisitos
- Node.js y npm
- MongoDB y MongoDB Shell (instalado localmente o en la nube)

### Pasos

1. Clona el repositorio:
   ```bash
   git clone https://github.com/MoisesYacila/mmpoker.git
   cd mmpoker
2. Instala las dependencias:
   ```bash
   # Frontend
   cd mmpokervite
   npm install

   # Backend
   cd ../server
   npm install
3. Inicia el servidor de MongoDB
     ```bash
     mongosh

4. Ejecuta el servidor backend
     ```bash
     cd server
     node app.js

5. Ejecuta el servidor de desarrollo del frontend
     ```bash
     cd mmpokervite
     npm run dev

6. Abre la app en tu navegador
      ```bash    
      http://localhost:5173

## 📅 Hoja de ruta / Próximamente

### Características próximas

- **Responsividad móvil**  
  Mejoras adicionales para móviles y tablets.

- **Testing**  
  Pruebas unitarias e integrales.

- **Despliegue en producción**  
  Preparar para producción (variables de entorno, seguridad, etc.).

---

## 🌟 Créditos

Inspirado por las noches de poker con amigos. Construido como un proyecto para mejorar mis habilidades con el stack MERN y mostrar el seguimiento de estadísticas reales con lógica compleja.

---

## 🎉 Nota final

¡Disfruta gestionando tus noches de poker con **MMPoker**!

