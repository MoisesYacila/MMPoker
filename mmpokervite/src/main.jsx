import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import SignUp from './pages/signup.jsx'
import Leaderboard from './pages/leaderboard.jsx';
import Forum from './pages/forum.jsx'
import Players from './pages/players.jsx'
import Stats from './pages/stats.jsx'
import NewPlayer from './pages/newplayer.jsx'
import Player from './pages/player.jsx'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import RootLayout from './layouts/RootLayout.jsx'
import PlayersLayout from './layouts/PlayersLayout.jsx'

const router = createBrowserRouter(createRoutesFromElements((
  <Route path='/' element={<RootLayout />}>
    <Route path='/' element={<App />}></Route>
    <Route path='/leaderboard' element={<Leaderboard />}></Route>
    <Route path='/players' element={<PlayersLayout />}>
      <Route path='/players' element={<Players />}></Route>
      <Route path='/players/new' element={<NewPlayer />}></Route>
      <Route path='/players/:id' element={<Player />}></Route>
    </Route>
    <Route path='/forum' element={<Forum />}></Route>
    <Route path='/stats' element={<Stats />}></Route>
    <Route path='/signup' element={<SignUp />}></Route>
  </Route>
)))

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
