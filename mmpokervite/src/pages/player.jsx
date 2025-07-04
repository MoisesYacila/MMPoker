import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import '../App.css';
import axios from 'axios';
import { CircularProgress } from '@mui/material';

export default function Player() {
    const { id } = useParams(); // Get player id from URL params
    // //useLocation helps retrieve the data we passed in the navigate function that took us to this page
    const location = useLocation();
    const [playerData, setPlayerData] = useState(location.state?.playerData || null); //using the ? syntax to avoid errors if playerData is not set
    const [gameList, setGameList] = useState([]);
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    const navigate = useNavigate();

    useEffect(() => {
        // If playerData is not set, fetch it from the server
        if (!playerData) {
            axios.get(`http://localhost:8080/players/${id}`)
                .then((res) => {
                    setPlayerData(res.data);
                })
                .catch(() => {
                    navigate('/notfound');
                });
        }
        //This gets the list of games from the DB and saves them in the gameList array
        //The server responds with the data we need, and we save it to an array in state for future use
        axios.get(`http://localhost:8080/games/${id}`)
            .then((res) => {
                let gamesArr = [];
                res.data.forEach(game => {
                    gamesArr.push(game);
                    setGameList(gamesArr);
                })
            })
            .catch((err) => { console.log(err) })
    }, [])

    return (
        <div>
            <h1>{playerData == null ? <CircularProgress /> : playerData.name}</h1>
            <div className='player-data'>
                <Typography variant='h4'>Earnings: ${playerData == null ? <CircularProgress /> : playerData.winnings}</Typography>
                <Typography variant='h4'>Games Played: {playerData == null ? <CircularProgress /> : playerData.gamesPlayed}</Typography>
                <Typography variant='h4'>Wins: {playerData == null ? <CircularProgress /> : playerData.wins}</Typography>
                <Typography variant='h4'>In the Money: {playerData == null ? <CircularProgress /> : playerData.itmFinishes}</Typography>
            </div>
            <div className='player-data'>
                <Typography variant='h4'>On the Bubble: {playerData == null ? <CircularProgress /> : playerData.onTheBubble}</Typography>
                <Typography variant='h4'>Bounties: {playerData == null ? <CircularProgress /> : playerData.bounties}</Typography>
                <Typography variant='h4'>Rebuys: {playerData == null ? <CircularProgress /> : playerData.rebuys}</Typography>
                <Typography variant='h4'>Add Ons: ${playerData == null ? <CircularProgress /> : playerData.addOns}</Typography>
            </div>
            <h2>Games</h2>
            <Box sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <List sx={{ width: '25%' }}>
                    {gameList.map((game, i) => {
                        const gameDay = new Date(game.date)
                        return (
                            <ListItem disablePadding key={i} sx={{ width: '100%' }}>
                                <ListItemButton onClick={async () => {
                                    //Link matches router stucture set in main.jsx
                                    //axios link matches express route endpoint
                                    const link = `/games/${game._id}`;
                                    await axios.get(`http://localhost:8080/games/game/${game._id}`)
                                        .then((res) => {
                                            navigate(link, { state: { gameData: res.data } });
                                        });
                                    console.log(link);
                                }}>
                                    <ListItemText primary={`Home Game - ${gameDay.getDate()} ${monthNames[gameDay.getMonth()]} 
                                ${gameDay.getFullYear()}`}
                                        sx={{ textAlign: 'center', fontWeight: 'bold' }} />
                                </ListItemButton>

                            </ListItem>
                        )
                    })}
                </List>
            </Box>
        </div>
    )
}