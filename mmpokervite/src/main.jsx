import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import LogIn from './pages/login.jsx'
import Leaderboard from './pages/leaderboard.jsx';
import Forum from './pages/forum.jsx'
import Players from './pages/players.jsx'
import Stats from './pages/stats.jsx'
import NewPlayer from './pages/newplayer.jsx'
import Player from './pages/player.jsx';
import SignUp from './pages/signup.jsx';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import RootLayout from './layouts/RootLayout.jsx'
import MainLayout from './layouts/MainLayout.jsx'
import NewGame from './pages/newgame.jsx'
import Game from './pages/game.jsx'
import EditGame from './pages/editgame.jsx'
import NotFound from './pages/notfound.jsx';

const router = createBrowserRouter(createRoutesFromElements((
  <Route path='/' element={<RootLayout />}>
    <Route path='/' element={<App />}></Route>Main
    <Route path='/leaderboard' element={<MainLayout />}>
      <Route path='/leaderboard' element={<Leaderboard />}></Route>
      <Route path='/leaderboard/new' element={<NewGame />}></Route>
    </Route>

    <Route path='/players' element={<MainLayout />}>
      <Route path='/players' element={<Players />}></Route>
      <Route path='/players/new' element={<NewPlayer />}></Route>
      <Route path='/players/:id' element={<Player />}></Route>
    </Route>
    <Route path='/forum' element={<Forum />}></Route>
    <Route path='/stats' element={<Stats />}></Route>
    <Route path='/login' element={<LogIn />}></Route>
    <Route path='/games/:id' element={<MainLayout />}>
      <Route path='/games/:id' element={<Game />}></Route>
      <Route path='/games/:id/edit' element={<EditGame />}></Route>
    </Route>
    <Route path='/signup' element={<SignUp />}></Route>
    <Route path='*' element={<NotFound />}></Route>
  </Route>
)))

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
