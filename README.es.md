---
## 🌍 Language / Idioma
[English](README.md) (🇬🇧 🇪🇺)

# MMPoker ♦️♠️♥️♣️
## Seguimiento de Liga de Poker

Una aplicación web full-stack para registrar partidas de poker, estadísticas de jugadores y clasificaciones para noches de poker entre amigos o ligas locales. Construida con el stack MERN (MongoDB, Express, React, Node.js), esta app calcula automáticamente estadísticas individuales y globales después de cada partida.

> 👉 Link al proyecto: https://mmpoker.netlify.app

---

## 🚀 Funcionalidades

1. **Gestión de Jugadores**
   - Añadir nuevos jugadores con nombre y nacionalidad.
   - Ver perfiles detallados de jugadores, incluyendo:
     - Partidas jugadas
     - Victorias
     - Ganancias
     - Veces en premios (ITM - In The Money)
     - Veces en la burbuja (OTB - On The Bubble)
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

7. **Navegación**
   - Barra de navegación intuitiva con enlaces a todas las secciones.

8. **UI Responsiva**
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

### **Despliegue**
- **Frontend**: Netlify
- **Backend**: Render
- **Base de datos**: MongoDB Atlas
- **Sesiones**: Redis
- **Subida de imágenes:** Cloudinary

---

## 🧑‍💻 Cómo Ejecutar Localmente

### Requisitos
Para ejecutar el proyecto localmente, se necesitas dos archivos .env:
* Uno para el **frontend**
* Uno para el **backend**

> ⚠️ Por razones de seguridad, los secretos reales no están incluidos en el proyecto. En su lugar, se proporciona un archivo .env.example para que los desarrolladores sepan qué variables deben crear.

### Archivo de ejemplo para backend .env.example
```bash
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:8080/auth/google/callback

CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_KEY=your_cloudinary_key
CLOUDINARY_SECRET=your_cloudinary_secret

REDIS_USERNAME=your_redis_username
REDIS_PASSWORD=your_redis_password
REDIS_HOST=your_redis_host
REDIS_PORT=your_redis_port

SESSION_COOKIE_NAME=your_session_cookie_name
SESSION_SECRET=your_session_secret

FRONTEND_URL=http://localhost:5173
```

### Archivo de ejemplo para frontend .env.example
```bash
VITE_BACKEND_URL=http://localhost:8080
```

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


## 📸 Capturas de Pantalla

### Página Landing
![Landing](/screenshots/LandingPage.png)

### Clasificación
![Clasificación](/screenshots/Leaderboard.png)

### Página de creación de partida
![Nueva Partida](/screenshots/NewGame.png)

### Perfil de jugador
![Perfil de Jugador](/screenshots/Player.png)

### Página de estadísticas
![Estadísticas](/screenshots/Stats.png)

### Página de noticias
![Noticias](/screenshots/Updates.png)

### Página de inicio de sesión
![Log In](/screenshots/Login.png)

---

## 📅 Hoja de ruta / Próximamente

### Características próximas

- **Responsividad móvil**  
  Rediseño completo de la responsividad para dispositivos móviles.

- **Testing**  
  Pruebas unitarias e integrales.

---

## 🌟 Créditos

Inspirado por las noches de poker con amigos. Construido como un proyecto para mejorar mis habilidades con el stack MERN y mostrar el seguimiento de estadísticas reales con lógica compleja.

---

## 🎉 Nota final

¡Disfruta gestionando tus noches de poker con **MMPoker**!

