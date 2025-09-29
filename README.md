---

## 🌍 Language / Idioma

 [Español](README.es.md) (🇪🇸)


# MMPoker ♦️♠️♥️♣️
## Poker League Tracker

A full-stack web app to track poker games, player stats, and rankings for casual poker nights or local leagues. Built with the MERN stack (MongoDB, Express, React, Node.js), this app automatically calculates individual and global stats after each game.

> ⚠️ This is a **work in progress** — core features are in place, and development is ongoing!

---

## 🚀 Features
1. **Player Management**
   - Add new players with their names and nationalities.
   - View detailed player profiles, including:
     - Games played
     - Wins
     - Earnings
     - ITM (In The Money) finishes
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

7. **Error Handling**
   - Custom error pages for 404 (Not Found) and 403 (Unauthorized).

8. **Navigation**
   - Intuitive navigation bar with links to all key pages.

9. **Responsive UI**
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

- **Image Uploads:** Cloudinary

---

## 📸 Screenshots (Coming Soon)

I'll add visuals soon to show off the leaderboard, game forms, and player stats views!

---

## 🧑‍💻 How to Run Locally
### Prerequisites
- Node.js and npm
- MongoDB and MongoDB Shell (running locally or in the cloud)

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

## 📅 Roadmap / Coming Soon

### Upcoming Features

- **Mobile Responsiveness**  
  Further polish for mobile and tablet devices.

- **Testing**  
  Add unit and integration tests.

- **Production Deployment**  
  Prepare for deployment (environment variables, security, etc.).

---

## 🌟 Credits

Inspired by poker nights with friends. Built as a project to level up my MERN stack skills and showcase real-world stat tracking with complex logic.

---

## 🎉 Final Note

Enjoy managing your poker games with **MMPoker**!
