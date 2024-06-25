import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Box from '@mui/material/Box';
import '../App.css';
import axios from 'axios';

export default function Player() {
    //useLocation helps retrieve the data we passed in the navigate function that took us to this page
    const location = useLocation();
    const playerData = location.state.playerData;
    const [gameList, setGameList] = useState([]);
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];

    const navigate = useNavigate(); //for link redirect

    //This gets the list of games from the DB and saves them in the gameList array
    //The server responds with the data we need, and we save it to an array in state for future use
    useEffect(() => {
        axios.get(`http://localhost:8080/games/${playerData._id}`)
            .then((res) => {
                let gamesArr = [];
                res.data.forEach(game => {
                    gamesArr.push(game);
                    setGameList(gamesArr);
                })
                console.log(res.data);
            })
            .catch((err) => { console.log(err) })
    }, [])

    return (
        <div>
            <h1>{playerData.name}</h1>
            <div className='player-data'>
                <Typography variant='h4'>Earnings: ${playerData.winnings}</Typography>
                <Typography variant='h4'>Games Played: {playerData.gamesPlayed}</Typography>
                <Typography variant='h4'>Wins: {playerData.wins}</Typography>
                <Typography variant='h4'>In the Money: {playerData.itmFinishes}</Typography>
            </div>
            <div className='player-data'>
                <Typography variant='h4'>On the Bubble: {playerData.onTheBubble}</Typography>
                <Typography variant='h4'>Bounties: {playerData.bounties}</Typography>
                <Typography variant='h4'>Rebuys: {playerData.rebuys}</Typography>
                <Typography variant='h4'>Add Ons: ${playerData.addOns}</Typography>
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