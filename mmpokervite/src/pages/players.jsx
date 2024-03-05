import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import { useState, useEffect } from 'react';
import axios from 'axios';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

export default function Players() {
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8080/players')
            .then((res) => {
                let playersArr = [];
                res.data.forEach(player => playersArr.push(player));
                setPlayers(playersArr);
            })
    }, [])
    return (
        <div>
            <h1>Players</h1>
            <Box sx={{ textAlign: 'center' }}>
                <Link to='/players/new'>Add Player</Link>
                <List>
                    {players.map((player, i) => {
                        return (
                            <ListItem disablePadding key={i}>
                                <ListItemButton>
                                    <ListItemText primary={player.name} sx={{ textAlign: 'center' }} />
                                </ListItemButton>
                            </ListItem>)
                    })}
                </List>
            </Box>
        </div>
    )
}