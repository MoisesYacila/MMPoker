import App from './App.jsx'
import './index.css'
import LogIn from './pages/login.jsx'
import Leaderboard from './pages/leaderboard.jsx';
import Updates from './pages/updates.jsx'
import Players from './pages/players.jsx'
import Stats from './pages/stats.jsx'
import NewPlayer from './pages/newplayer.jsx'
import Player from './pages/player.jsx';
import SignUp from './pages/signup.jsx';
import RootLayout from './layouts/RootLayout.jsx'
import MainLayout from './layouts/MainLayout.jsx'
import NewGame from './pages/newgame.jsx'
import Game from './pages/game.jsx'
import EditGame from './pages/editgame.jsx'
import NotFound from './pages/notfound.jsx';
import Unauthorized from './pages/unauthorized.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import NewPost from './pages/newpost.jsx';
import Post from './pages/post.jsx';
import EditPost from './pages/editpost.jsx';
import Account from './pages/account.jsx';
import { Route, Routes } from 'react-router-dom';

// This file contains all the routes of the application
export default function AppRoutes() {
    return (
        <Routes>
            <Route path='/' element={<RootLayout />}>
                <Route path='/' element={<App />}></Route>Main
                <Route path='/unauthorized' element={<Unauthorized />}></Route>
                <Route path='/leaderboard' element={<MainLayout />}>
                    <Route path='/leaderboard' element={<Leaderboard />}></Route>
                    <Route path='/leaderboard/new' element={
                        // Wrapping the NewGame component in a ProtectedRoute to ensure only admins can access it
                        <ProtectedRoute requireAdmin={true} >
                            <NewGame />
                        </ProtectedRoute>
                    }></Route>
                </Route>

                <Route path='/players' element={<MainLayout />}>
                    <Route path='/players' element={<Players />}></Route>
                    <Route path='/players/new' element={
                        // Wrapping the NewPlayer component in a ProtectedRoute to ensure only logged in users can access it
                        <ProtectedRoute requireAdmin={false} >
                            <NewPlayer />
                        </ProtectedRoute>
                    }></Route>
                    <Route path='/players/:id' element={<Player />}></Route>
                </Route>
                <Route path='/updates' element={<Updates />}></Route>
                <Route path='/updates/newpost' element={
                    // Wrapping the NewPost component in a ProtectedRoute to ensure only admins can access it
                    <ProtectedRoute requireAdmin={true} >
                        <NewPost />
                    </ProtectedRoute>
                }></Route>
                <Route path='/updates/:id' element={<Post />}></Route>
                <Route path='/updates/:id/edit' element={
                    // Wrapping the Edit Post component in a ProtectedRoute to ensure only logged in users can access it
                    <ProtectedRoute requireAdmin={true} >
                        <EditPost />
                    </ProtectedRoute>
                }></Route>
                <Route path='/stats' element={<Stats />}></Route>
                <Route path='/login' element={<LogIn />}></Route>
                <Route path='/games/:id' element={<MainLayout />}>
                    <Route path='/games/:id' element={<Game />}></Route>
                    <Route path='/games/:id/edit' element={
                        // Wrapping the EditGame component in a ProtectedRoute to ensure only admins can access it
                        <ProtectedRoute requireAdmin={true} >
                            <EditGame />
                        </ProtectedRoute>
                    }></Route>
                </Route>
                <Route path='/account' element={
                    // Wrapping the Account component in a ProtectedRoute to ensure only logged in users can access it
                    <ProtectedRoute requireAdmin={false} >
                        <Account />
                    </ProtectedRoute>
                }></Route>
                <Route path='/signup' element={<SignUp />}></Route>
                <Route path='*' element={<NotFound />}></Route>
            </Route>
        </Routes>
    )
}