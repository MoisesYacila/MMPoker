---

## 🌍 Language / Idioma

 [Español](README.es.md) (🇪🇸)


# M&M Poker Nights ♦️♠️♥️♣️
## Poker League Tracker

A full-stack web app to track poker games, player stats, and rankings for casual poker nights or local leagues. Built with the MERN stack (MongoDB, Express, React, Node.js), this app automatically calculates individual and global stats after each game.

> ⚠️ This is a **work in progress** — core features are in place, and development is ongoing!

---

## 🚀 Features (So Far)
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
   - Add new poker games, specifying:
     - Players involved
     - Player performance (earnings, rebuys, add-ons, etc.)
   - Edit existing games to update player stats or game details.
   - Delete games, which automatically updates associated player statistics.

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
   - Visualize stats using cards and lists for easy readability.

5. **Navigation**
   - Intuitive navigation bar with links to key pages:
     - Leaderboard
     - Players
     - Forum (placeholder)
     - Stats
     - Sign-Up (placeholder)

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


---

## 📸 Screenshots (Coming Soon)

I'll add visuals soon to show off the leaderboard, game forms, and player stats views!

---

## 🧑‍💻 How to Run Locally
### Prerequisites
- Node.js and npm
- MongoDB (running locally or in the cloud)

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/MoisesYacila/mmpokervite.git
   cd mmpokervite

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

- **User Authentication**  
  Allow users to sign up, log in, and manage their accounts.

- **Forum (Updates)**  
  Page where admin can post updates, results, and more on the games.

- **Mobile Responsiveness**  
  Enhance user experience on mobile devices.

- **Admin Panel**  
  Provide an admin interface for managing players, games, and posts.

- **Error Handling**  
  Make different error pages, and restrict certain actions.

---

## 🌟 Credits

Inspired by poker nights with friends. Built as a project to level up my MERN stack skills and showcase real-world stat tracking with complex logic.

---

## 🎉 Final Note

Enjoy managing your poker games with **M&M Poker Nights**!
