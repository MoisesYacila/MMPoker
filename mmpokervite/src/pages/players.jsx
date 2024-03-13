import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import { IconButton } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { Us, Ar, Mx, Ni, Es, Ve } from "react-flags-select";
import Box from '@mui/material/Box';


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
            <Box sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Link to='/players/new'>Add Player</Link>
                <List sx={{ width: '25%' }}>
                    {players.map((player, i) => {
                        return (
                            <ListItem disablePadding key={i} sx={{ width: '100%' }}>
                                <ListItemButton>
                                    <ListItemIcon>
                                        {/* There has to be a better way to do this. Research later */}
                                        {player.nationality === "US" ? <Us /> : null}
                                        {player.nationality === "AR" ? <Ar /> : null}
                                        {player.nationality === "MX" ? <Mx /> : null}
                                        {player.nationality === "NI" ? <Ni /> : null}
                                        {player.nationality === "ES" ? <Es /> : null}
                                        {player.nationality === "VE" ? <Ve /> : null}
                                    </ListItemIcon>
                                    <ListItemText primary={player.name} sx={{ textAlign: 'center' }} />
                                    <IconButton>
                                        <ClearIcon></ClearIcon>
                                    </IconButton>


                                </ListItemButton>
                            </ListItem>)
                    })}
                </List>
            </Box>
        </div >
    )
}