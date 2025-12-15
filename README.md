---

## 🌍 Language / Idioma

 [Español](README.es.md) (🇪🇸)


# MMPoker ♦️♠️♥️♣️
## Poker League Tracker

A full-stack web app to track poker games, player stats, and rankings for casual poker nights or local leagues. Built with the MERN stack (MongoDB, Express, React, Node.js), this app automatically calculates individual and global stats after each game.

> 👉 Live App: https://mmpoker.netlify.app

---

> ⚠️ Note: The backend is hosted on Render's free tier.
On first visit, it may take up to ~40 seconds to wake up.

---

## 🚀 Features
1. **Player Management**
   - Add new players with their names and nationalities.
   - View detailed player profiles, including:
     - Games played
     - Wins
     - Earnings
     - ITM (In The Money) finishes
     - OTB (On The Bubble) finishes
     - Rebuys, add-ons, and bounties
   - Delete players (if they are not part of any games).

2. **Game Management**
   - Add new poker games, specifying players and their performance (earnings, rebuys, add-ons, etc.)
   - Edit and delete games, with automatic updates to player statistics.

3. **Leaderboard**
   - View a sortable leaderboard showing player rankings based on:
     - Games played
     - Wins
     - ITM finishes
     - Earnings
     - Other metrics like rebuys, add-ons, and bounties.

4. **Statistics**
   - Toggle between **Total Stats** and **Average Stats**:
     - Total Stats: Most games played, most wins, most earnings, etc.
     - Average Stats: Best average profit, ITM percentage, OTB (On The Bubble) percentage, etc.
   - Visualize stats using cards and lists.

5. **Updates**
   - Admins can post updates, results, and more.
   - Users can comment and like posts.
   - Image upload supported for posts.

6. **Authentication & Account Management**
   - Users can sign up and log in (local and Google OAuth 2.0).
   - Edit profile (username, email, full name).
   - View account info and settings.

7. **Navigation**
   - Intuitive navigation bar with links to all key pages.

8. **Responsive UI**
   - Mostly responsive design; mobile support is being polished.

---

## 🛠️ Tech Stack

### **Frontend**
- **React**: Component-based UI development.
- **Material UI**: Pre-styled components for a modern and responsive design.
- **React Router**: For seamless navigation between pages.
- **Axios**: For making API requests to the backend.

### **Backend**
- **Node.js**: Server-side JavaScript runtime.
- **Express**: Web framework for building RESTful APIs.
- **MongoDB**: NoSQL database for storing player and game data.
- **Mongoose**: ODM for MongoDB to manage schemas and queries.
- **Passport.js**: Authentication (Local + Google OAuth 2.0)

### **Hosting**
- **Frontend**: Netlify
- **Backend**: Render
- **Database**: MongoDB Atlas
- **Session**: Redis
- **Image Uploads**: Cloudinary

---

## 🧑‍💻 How to Run Locally
### Prerequisites
To run the project locally, you'll need two separate .env files:
* One for the **frontend**
* One for the **backend**

> ⚠️ For security reasons, the real secrets are not included in the project. Instead, an .env.example file is provided so developers know what variables must be created.

### Backend .env.example
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

### Frontend .env.example
```bash
VITE_BACKEND_URL=http://localhost:8080
```

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/MoisesYacila/mmpoker.git
   cd mmpoker

2. Install Dependecies
   ```bash
   # Frontend
   cd mmpokervite
   npm install

   # Backend
   cd ../server
   npm install
3. Start MongoDB Server
   ```bash
   mongosh

4. Run Backend Server
     ```bash
    cd server
    node app.js

5. Run Frontend Development Server
   ```bash
   cd mmpokervite
   npm run dev

6. Open the app in your browser:
    ```bash
    http://localhost:5173


## 📸 Screenshots

### Landing Page
![Landing Page](/screenshots/LandingPage.png)

### Leaderboard
![Leaderboard](/screenshots/Leaderboard.png)

### New Game Page
![New Game](/screenshots/NewGame.png)

### Player Profile
![Player Profile](/screenshots/Player.png)

### Stats Page
![Stats](/screenshots/Stats.png)

### Updates Page
![Updates](/screenshots/Updates.png)

### Log In Page
![Log In](/screenshots/Login.png)

---

## 📅 Roadmap / Coming Soon

### Upcoming Features

- **Mobile Responsiveness**  
  Full mobile responsiveness redesign.

- **Testing**  
  Add unit and integration tests.

---

## 🌟 Credits

Inspired by poker nights with friends. Built as a project to level up my MERN stack skills and showcase real-world stat tracking with complex logic.

---

## 🎉 Final Note

Enjoy managing your poker games with **MMPoker**!
